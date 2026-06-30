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
- Fixed an issue where the \ecordPartOrderPayment\ method in \part-orders.service.ts\ was missing Journal Entry (JV) creation logic entirely.
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
