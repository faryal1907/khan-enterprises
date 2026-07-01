# Accounting Module Changelog

This document summarizes all the architectural, backend, and frontend changes made during this session to extend the ERP system with full accounting capabilities, including Accounts Receivable (AR), Accounts Payable (AP), Partial Payments, and Installment Plans.

---

## 1. Core Architectural & Database Changes

- **Double-Entry Ledger Engine**: Implemented `JournalEntry` and `JournalEntryLine` models to strictly track all financial movements in the system using double-entry accounting principles.
- **Accrual Accounting Transition**: Transitioned the financial core from cash-basis (logging payments) to accrual-basis (recognizing revenue upon sale and tracking AR/AP).
- **Data Migration**: Migrated historical payment transactions into the new ledger system. Initialized `paidAmount` and `balanceDue` fields across the necessary database models to maintain the state of partially paid invoices and payables.

## 2. Backend (NestJS API)

- **Order & Sales Updates (`OrdersService`)**:
  - Implemented the 50% upfront payment rule. The system now validates that any order intended for an installment plan receives at least 50% of the total amount upfront.
  - Overhauled revenue recognition: Full order amounts are recognized as `REVENUE` immediately, with unpaid balances moving to `Accounts Receivable`.
- **Purchase & AP Updates (`PurchaseOrdersService` & `PayablesService`)**:
  - Created dedicated services to handle Supplier Purchase Orders (POs) and Accounts Payable.
  - Receiving a PO now automatically influxes inventory into the system and records the supplier debt as an Accounts Payable record with corresponding journal entries.
  - Newly received Bikes are automatically generated in a `PENDING_SETUP` state to hide them from the client-side/POS until warehouse staff configure their real chassis and engine numbers.
  - Implemented logic to make partial or full cash payments against Payables.
- **Dashboard Updates (`DashboardService`)**:
  - Rewrote dashboard financial metrics to calculate aggregates strictly from `JournalEntryLine` records, ensuring accurate accrual-based reporting.
- **Accounting API Controller (`AccountingController`, `AccountingService`, `AccountingModule`)**:
  - Bootstrapped a brand new `AccountingModule` and wired it into `AppModule`.
  - Exposed REST endpoints to fetch the Chart of Accounts, Journal Entries, Purchase Orders, and Payables (`/accounting/*`).
  - Added mutation endpoints for receiving POs and paying Payables.

## 3. Frontend (Next.js Admin App)

- **Navigation Integration**:
  - Added the **Accounts** menu item to the main sidebar (`navigation.tsx`) using the `BookOpen` icon.
- **API Client Integration (`lib/api/accounting.ts`)**:
  - Created a robust API wrapper utilizing Axios to securely interface with the new backend endpoints.
- **Accounting Hub Page (`app/accounts/page.tsx`)**:
  - Built a comprehensive, tabbed accounting dashboard containing four primary views:
    1. **Overview**: Displays the Chart of Accounts (Assets, Liabilities, Equity, Revenue, COGS, Expenses) and live balances.
    2. **Journals**: Presents a read-only, immutable ledger of all double-entry transaction logs.
    3. **Purchase Orders**: Lists supplier POs and provides an interactive **Mark Received** button to trigger inventory updates and payable generation. Also includes a **Create PO** modal for submitting new Purchase Orders directly from the UI, supporting dynamic line items for both bikes and parts.
    4. **Payables**: Lists outstanding supplier debts with remaining balances, and features an interactive **Pay** button to allocate partial or full cash payments.
- **UI Styling Polish**:
  - Applied uniform design tokens (`theme.text.primary` and `theme.text.secondary`) to the Accounting Hub data tables to ensure text visibility and seamless integration with the global theme.

## 4. Bug Fixes & Improvements

- **Account Balances Calculation**:
  - Dynamically compute Account balances based on POSTED journal entries and account category (Asset/Expense vs Liability/Equity/Revenue) in `AccountingService.getAccounts()`, ensuring the Chart of Accounts Overview accurately reflects ledger data instead of showing all zeros.
- **Payables Payment Modal**:
  - Replaced the native `window.prompt` with a custom `PayPayableModal` UI component, providing a cleaner, more robust user experience for entering payment amounts and selecting payment methods (Cash vs. Online Transfer).
  - Enhanced the payment input to automatically format values with commas, enforce maximum limits against the remaining balance, and dynamically display the typed amount in words using the shared `@repo/utils` module.
  - Implemented loading state protection on the Confirm Payment button to prevent duplicate submissions during API calls.
- **Manual Journal Entries**:
  - Created a robust UI (`CreateJournalEntryModal`) allowing administrators to manually record journal entries (e.g., Owner Capital Injections or Adjustments).
  - Built real-time validation in the modal to enforce double-entry accounting rules (Total Debits must equal Total Credits before submission).
  - Added a new `POST /accounting/journals` REST endpoint to persist these manual entries with a unique `MAN-JE-...` tracking number.

> [!NOTE]
> All code changes across the API and Admin apps have been verified against the TypeScript compiler (`npm run build` passed successfully) and are now actively running in the development environment.

## [2026-06-29] Fix AR Going Negative Bug
- Added Revenue Recognition Journal Entry (Debit AR, Credit Revenue) on customer order creation (orders.service.ts -> createCustomerOrder).
- Added Cash Receipt Journal Entry (Debit Cash, Credit AR) on online payment verification (orders.service.ts ->  erifyPayment).
- Added full reversal JVs for Revenue and Cash in orders.service.ts -> cancelOrder.
- Implemented missing double-entry JVs for part-orders.service.ts (createPartOrder, createManualPartOrder,  erifyPartOrderPayment, and cancelPartOrder) to ensure part sales and payments are tracked in AR and Revenue.

## [2026-06-29] Fix Bank Transfer JVs
- Fixed a bug where non-CASH payments (like ONLINE_TRANSFER) were incorrectly debiting the CASH account instead of the BANK account in Journal Entries.
- Updated orders.service.ts (ecordPayment,  erifyPayment, createManualOrder) to conditionally debit AccountSubtype.BANK when method !== 'CASH'.
- Updated part-orders.service.ts (createManualPartOrder,  erifyPartOrderPayment) to apply the same BANK vs CASH logic.

## [2026-06-29] Add Live Refresh via Push Notifications to Accounts Page
- Added a Firebase FCM `onMessage` listener to `AccountsPage` (`apps/admin/app/accounts/page.tsx`).
- The accounting hub now automatically refetches and refreshes all accounting data (accounts, journals, POs, payables) in real-time when push notifications (such as new or updated orders) arrive.

## [2026-06-29] Fix Part Order Record Payment JVs
- Fixed an issue where the \
ecordPartOrderPayment\ method in \part-orders.service.ts\ was missing Journal Entry (JV) creation logic entirely.
- Added logic to generate the Cash/Bank Receipt JV (Debit Cash/Bank, Credit AR) when an admin records a successful payment for a part order.

## [2026-06-29] Fix Purchase Order Payments Treated as Revenue
- Fixed a bug in `TransactionsService` (`getTransactions` and `getTransactionStats`) where supplier payments (transactions with no `orderId`) were being incorrectly included in the "Payments" tab and summed into "Total Revenue".
- Added `orderId: { not: null }` filter to ensure only customer payments are fetched for the Transactions view and revenue calculation, aligning with correct accounting principles where inventory purchase is an asset exchange, not an immediate expense or revenue.

## [2026-06-29] Align Expenses and Cost of Goods Sold with Accounting
- Updated `ExpensesService.create` to automatically generate Journal Entries mapping to `5002` (Salary Expense) or `5003` (General Expense) based on category.
- Added `paymentAccountId` to the DTO and frontend UI for Expenses, allowing users to select from which Asset account (Cash or Bank) the expense is paid from.
- Updated `OrdersService.createCustomerOrder` and `OrdersService.createManualOrder` to automatically record Cost of Goods Sold (COGS). The JV debits `5001` (COGS) and credits `1003` (Inventory) using `bike.purchasePrice` as the cost basis upon order creation.

## [2026-06-29] Fix COGS Calculation (Use purchasePrice instead of price)
- **Database Schema**: Added a new `purchasePrice` column to the `BikeUnit` model to correctly store the actual unit cost. (Previously, the `price` column was incorrectly used as a proxy for cost, but that is the retail sale price).
- **Seeding**: Updated `seed.ts` to mock a `purchasePrice` of 150,000 PKR for all seeded bikes so they have a cost basis.
- **Purchase Orders**: Updated `PurchaseOrdersService.markAsReceived` to assign `item.purchasePrice` to the new `BikeUnit.purchasePrice` field when receiving supplier inventory.
- **Order COGS**: Updated the COGS logic in `OrdersService` to use the accurate `bike.purchasePrice` instead of `bike.price` for the Journal Entry.

## [2026-06-29] Fix Bank Transfer for Payables
- Changed the label from 'Online Transfer' to 'Bank Transfer' in the Pay Payable modal.
- Updated PayablesService.payPayable to dynamically select the BANK account instead of hardcoding the CASH account when the payment method is ONLINE_TRANSFER.


## Commit: Owner Equity and bank/wallet accounts logic

### Schema Changes
- **JournalEntry Model Enhancement**
  - Added optional `notes` field (String?) to journal entries for additional documentation
  - Updated all Prisma-generated types to include the new notes field in input/output types

- **Account Subtype Expansion**
  - Added `DRAWINGS` to the `AccountSubtype` enum to support owner withdrawal tracking

### Account Structure Updates
- **New System Accounts Added**
  - **Owner Drawings** (Code: 3002)
    - Category: EQUITY
    - Subtype: DRAWINGS
    - Purpose: Track owner withdrawals from business
  - **Retained Earnings** (Code: 3003)
    - Category: EQUITY
    - Subtype: EQUITY
    - Purpose: Track accumulated business earnings
  - **Cash Adjustment Expense** (Code: 5004)
    - Category: EXPENSE
    - Subtype: EXPENSE
    - Purpose: Track cash-related adjustments

### Data Migration
- Updated `migrate-accounting.ts` to include the three new accounts in migration scripts
- Updated `seed.ts` to include the new accounts in database seeding

---

## Commit: Receivables module full workflow implemented

### Payment Account Integration
- **Order Model Enhancement**
  - Added `paymentAccountId` (String?) field to link orders to specific payment accounts
  - Added `paymentAccount` relation to Account model via "OrderPaymentAccount" relation

- **PartOrder Model Enhancement**
  - Added `paymentAccountId` (String?) field to link part orders to specific payment accounts
  - Added `paymentAccount` relation to Account model via "PartOrderPaymentAccount" relation

- **Account Model Relations**
  - Added `orderPayments` relation to track all orders paid from this account
  - Added `partOrderPayments` relation to track all part orders paid from this account

### Receivables Alert Tracking System
- **New ReceivablesAlert Model**
  - **Core Fields**
    - `id`: Unique identifier (UUID)
    - `customerPhone`: Customer phone number (unique constraint)
    - `customerName`: Customer name for identification
    - `outstandingAmount`: Outstanding balance (Decimal 12,2)
    - `status`: Payment state tracking
  
  - **Notification Tracking**
    - `lastNotifiedAt`: Timestamp of last notification sent
    - `notificationCount`: Counter for total notifications sent (default: 0)
  
  - **Audit Fields**
    - `createdAt`: Record creation timestamp
    - `updatedAt`: Last update timestamp
  
  - **Indexes & Constraints**
    - Unique constraint on `customerPhone` to prevent duplicate alerts
    - Index on `customerPhone` for query optimization

### Receivables Service Implementation
- **ReceivablesService** ([apps/api/src/modules/accounting/receivables.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/accounting/receivables.service.ts:0:0-0:0))
  - **getReceivables()**
    - Aggregates outstanding balances per customer across both bike orders AND part orders
    - Shows all payment-verified orders (including fully paid)
    - Groups by customer phone number
    - Calculates total billed, total paid, outstanding balance
    - Determines customer status (DUE, PARTIAL, OVERDUE, PAID) with priority logic
    - Fetches last payment dates from both payment transaction tables
    - Returns order count, latest order date, and last payment date per customer

  - **getCustomerLedger(customerPhone)**
    - Fetches all orders and part orders for a specific customer
    - Builds chronological ledger with running balance
    - Includes bike details (brand, model, year) for bike orders
    - Includes part details for part orders
    - Shows all transactions (invoices and payments) with verification timestamps
    - Returns summary statistics (total billed, total paid, outstanding)
    - Provides drill-down capability to view individual orders

  - **getPaymentAccounts()**
    - Returns available payment accounts (Bank, E-Wallet, Cash)
    - Filters for active accounts only
    - Ordered by subtype and name for consistent UI display

  - **collectPayment(customerPhone, amount, paymentMethod, userId, notes?, accountId?)**
    - Allocates payment across outstanding orders using oldest-first strategy
    - Supports both bike orders and part orders
    - Handles advance payments (holds excess as credit)
    - Creates payment transactions with verification
    - Updates order payment states (PARTIAL → PAID)
    - Generates journal entries for accounting
    - Links to specific payment accounts for online transfers
    - Returns allocation details and advance credit information

  - **getCustomerStatement(customerPhone)**
    - Generates customer statement from ledger data
    - Separates invoices and payments into distinct tables
    - Includes generation timestamp
    - Provides summary statistics

### Receivables Alert Service
- **ReceivablesAlertService** ([apps/api/src/modules/accounting/receivables-alert.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/accounting/receivables-alert.service.ts:0:0-0:0))
  - **checkAndNotifyPartialPayments()**
    - Scheduled job to identify customers in PARTIAL status for 48+ hours
    - Checks against last payment date and last notification timestamp
    - Sends notifications to admin users only
    - Updates or creates receivables alert records
    - Tracks notification count and outstanding amounts

  - **getPartialPaymentCustomers()**
    - Queries both bike orders and part orders with PARTIAL status
    - Groups by customer phone number
    - Aggregates outstanding balances and order counts
    - Fetches last payment dates from transaction tables

  - **shouldSendNotification()**
    - Determines notification eligibility based on 48-hour intervals
    - Handles first-time notifications (no previous alert)
    - Handles repeat notifications (based on last notification time)

  - **calculateDuration()**
    - Calculates human-readable duration since last payment
    - Returns days, hours, or "less than an hour"

  - **resetCustomerAlert()**
    - Clears alert tracking when customer status changes from PARTIAL
    - Called automatically when payment is collected

### UI Components
- **CollectReceivableModal** ([apps/admin/app/accounts/collect-receivable-modal.tsx](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/app/accounts/collect-receivable-modal.tsx:0:0-0:0))
  - Modal for collecting payments from customers
  - Displays customer info and outstanding balance
  - Supports amount input with number-to-words conversion
  - Payment method selection (Cash / Bank Transfer)
  - Bank account selection for online transfers
  - Optional notes field for reference
  - Handles overpayments with advance credit notification
  - Validates required fields before submission

- **CustomerLedgerModal** ([apps/admin/app/accounts/customer-ledger-modal.tsx](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/app/accounts/customer-ledger-modal.tsx:0:0-0:0))
  - Displays full customer transaction history
  - Summary cards showing total billed, paid, and outstanding
  - Chronological table with date, type, reference, description
  - Debit/credit/balance columns with running balance
  - Payment state badges (PAID, PARTIAL, OVERDUE)
  - Direct links to view individual orders
  - Color-coded balance (red for outstanding, green for settled)

- **CustomerStatementModal** ([apps/admin/app/accounts/customer-statement-modal.tsx](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/app/accounts/customer-statement-modal.tsx:0:0-0:0))
  - Customer statement view with generation timestamp
  - Summary statistics cards
  - Separate invoice table with payment status
  - Separate payment table with method descriptions
  - Clean, printable format for customer communication

### API Endpoints
- **AccountingController** ([apps/api/src/modules/accounting/accounting.controller.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/accounting/accounting.controller.ts:0:0-0:0))
  - `GET /accounting/receivables` - Get all customer receivables
  - `GET /accounting/receivables/payment-accounts` - Get available payment accounts
  - `GET /accounting/receivables/:customerPhone/ledger` - Get customer ledger
  - `GET /accounting/receivables/:customerPhone/statement` - Get customer statement
  - `POST /accounting/receivables/:customerPhone/collect` - Collect payment from customer

- **Client API Functions** ([apps/admin/lib/api/accounting.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/lib/api/accounting.ts:0:0-0:0))
  - [getReceivables()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/lib/api/accounting.ts:94:0-97:2) - Fetch receivables data
  - [getCustomerLedger(customerPhone)](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/lib/api/accounting.ts:99:0-102:2) - Fetch customer ledger
  - [getCustomerStatement(customerPhone)](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/lib/api/accounting.ts:104:0-107:2) - Fetch customer statement
  - [collectReceivable(customerPhone, payload)](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/lib/api/accounting.ts:109:0-115:2) - Submit payment collection

### Scheduler Integration
- **SchedulerService** ([apps/api/src/modules/scheduler/scheduler.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/scheduler/scheduler.service.ts:0:0-0:0))
  - Added [checkReceivablesPartialPayments()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/scheduler/scheduler.service.ts:53:2-72:3) cron job
  - Runs every hour using `@Cron(CronExpression.EVERY_HOUR)`
  - Prevents concurrent execution with flag checking
  - Logs notification counts for monitoring
  - Calls ReceivablesAlertService to process reminders

### Order Alerts Integration
- **OrderAlertsService** ([apps/api/src/modules/order-alerts/order-alerts.service.ts](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/order-alerts/order-alerts.service.ts:0:0-0:0))
  - Added [createAlertsForReceivables()](cci:1://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/api/src/modules/order-alerts/order-alerts.service.ts:527:2-579:3) method
  - Creates admin-only alerts for partial payment reminders
  - Targets only ADMIN users (excludes MANAGER and SALES_STAFF)
  - Sends push notifications with customer details
  - Includes outstanding amount and duration since last payment
  - Links directly to receivables tab in accounting hub
  - Uses AlertType.RECEIVABLES_PARTIAL_REMINDER

### Admin UI Integration
- **Accounts Page** ([apps/admin/app/accounts/page.tsx](cci:7://file:///c:/Users/Laptop/Desktop/khan-enterprises/apps/admin/app/accounts/page.tsx:0:0-0:0))
  - Added RECEIVABLES tab to accounting hub
  - Displays customer list with aggregated balances
  - Shows total invoiced, total paid, and outstanding per customer
  - Last payment date column
  - Status badges (PAID, PARTIAL, OVERDUE, DUE)
  - Action buttons for collect payment and view ledger
  - Summary badge showing total customers and outstanding amount
  - Firebase push notification listener for real-time updates
  - Integration with CollectReceivableModal and CustomerLedgerModal

### Type Generation
- Generated complete Prisma client types for ReceivablesAlert model including:
  - Create, update, delete, and upsert operations
  - Select and omit type definitions
  - Where input filters for queries
  - Field references for type-safe operations
- Updated Order and PartOrder model types to include payment account relations
- Updated Account model types to include payment relations