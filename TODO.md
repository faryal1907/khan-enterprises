# TODO

## Orders/Part Orders customer ownership fix (processedById vs customerId)

- [ ] Update Prisma schema (`packages/prisma/schema.prisma`):
  - [ ] Add `customerId String` + `customer User @relation(...)` to `Order`
  - [ ] Add `customerId String` + `customer User @relation(...)` to `PartOrder`
  - [ ] Add relation back fields on `User` (e.g., `customerOrders`, `customerPartOrders`) if needed
  - [ ] Add indexes on `customerId`

- [ ] Update customer creation flows:
  - [ ] `apps/api/src/modules/orders/orders.service.ts`: in `createCustomerOrder`, set `customerId = user.id` and stop using `processedById` for customer ownership
  - [ ] `apps/api/src/modules/part-orders/part-orders.service.ts`: in `createPartOrder`, if endpoint is customer-auth aware, set `customerId = user.id`

- [ ] Update listing/filtering for customer role:
  - [ ] `apps/api/src/modules/orders/orders.service.ts`: change `applyCustomerScope()` to filter by `customerId`
  - [ ] `apps/api/src/modules/part-orders/part-orders.service.ts`: change `applyCustomerScope()` to filter by `customerId`

- [ ] Update access checks:
  - [ ] `assertOrderAccess()` and `assertPartOrderAccess()` to check `order.customerId === user.id` (and keep phone check as fallback if desired)

- [ ] Update any DTO/query code that passes/uses `processedById` for customer scoping.

- [ ] Generate Prisma migration + update Prisma client.

- [ ] Run API build/tests and smoke test:
  - [ ] Customer can list only their own orders/part-orders
  - [ ] Customer cannot access others via `orderNumber`/IDs
  - [ ] Staff/manager listing by branch/status still works

