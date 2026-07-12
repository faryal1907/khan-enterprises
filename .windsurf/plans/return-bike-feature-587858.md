# Return Bike Feature Implementation Plan

This plan implements a "Return Bike" feature to replace the "Delete Bike" functionality, allowing admins to return bikes to vendors with proper accounting impact, supporting both single bike returns from the edit page and bulk returns from the inventory list.

## Requirements Summary

- Replace "Delete Bike" button with "Return Bike" on single bike edit page
- Add bulk return functionality on bikes inventory list page with checkbox selection
- Only allow returns for bikes with `vendorAllocationId` (all bikes in current system)
- Allow returns for bikes in AVAILABLE or PENDING_SETUP status
- Optional notes field for return reason
- Selectable return date (defaults to today)
- No journal entry preview in confirmation modal
- Use existing `returnDefectiveInventory` API endpoint

## Phase 1: Single Bike Return (Edit Page)

**File: `apps/admin/app/bikes/[id]/edit/page.tsx`**

1. **Replace Delete Button**
   - Change "Delete Bike" button text to "Return Bike"
   - Change button color from red to appropriate return color (e.g., orange/amber)
   - Update modal title from "Delete Bike Unit" to "Return Bike to Vendor"

2. **Update Return Modal**
   - Add date picker field (defaults to today)
   - Add optional notes field
   - Show bike details (chassis number, model, vendor)
   - Show return value (bike's `purchaseCost`)
   - Remove "cannot be undone" warning (since it's a return with accounting impact)
   - Add warning about vendor balance increase

3. **Update Return Logic**
   - Replace `deleteBike()` API call with `returnDefectiveInventory()` API call
   - Pass single bike ID in `bikeIds` array
   - Include date and notes in API call
   - Handle success/error responses appropriately
   - Redirect to bikes page after successful return

## Phase 2: Bulk Bike Return (List Page)

**File: `apps/admin/app/bikes/page.tsx`**

1. **Add Selection State**
   - Add `selectedBikeIds` state array
   - Add checkbox column to table header (select all)
   - Add checkbox to each bike row
   - Add "Return Selected" button in header (visible when bikes selected)

2. **Update BikeTable Component**
   - Add checkbox column to table header
   - Add checkbox to each bike row
   - Only show checkboxes for bikes with AVAILABLE or PENDING_SETUP status
   - Pass selection handlers to parent component

3. **Add Return Modal**
   - Create modal similar to single bike return
   - Show count of selected bikes
   - Show total return value (sum of all bikes' `purchaseCost`)
   - Add date picker field
   - Add optional notes field
   - Show vendor information (if all bikes from same vendor, show warning if mixed vendors)

4. **Implement Bulk Return Logic**
   - Call `returnDefectiveInventory()` API with all selected bike IDs
   - Include date and notes in API call
   - Clear selection after successful return
   - Refresh bike list after successful return

## Phase 3: Backend Validation (if needed)

**File: `apps/api/src/modules/vendor/vendor.service.ts`**

The existing `returnDefectiveInventory` method already supports:
- Multiple bike IDs in `bikeIds` array
- Date and notes parameters
- Status validation (AVAILABLE only currently)
- Vendor allocation validation

**Potential Updates:**
- Extend status validation to allow PENDING_SETUP status
- Add validation to ensure all bikes belong to the same vendor (optional, for better UX)

## Phase 4: API Client Updates

**File: `apps/admin/lib/api/vendors.ts`**

The `returnDefectiveInventory` function already exists and supports the required parameters. No changes needed.

## Implementation Order

1. **Phase 1**: Single bike return on edit page (simpler, isolated changes)
2. **Phase 2**: Bulk return on list page (more complex, builds on Phase 1 understanding)
3. **Phase 3**: Backend validation updates (if needed based on testing)
4. **Phase 4**: API client (likely no changes needed)

## Testing Considerations

- Test single bike return with AVAILABLE status
- Test single bike return with PENDING_SETUP status
- Test bulk return with multiple bikes from same vendor
- Test bulk return with bikes from different vendors (should show warning)
- Verify vendor balance increases after return
- Verify journal entries are created correctly
- Verify bikes are removed from inventory after return
- Test date selection functionality
- Test notes field (optional vs required)
