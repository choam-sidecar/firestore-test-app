# Downstream DBT Impact Checklist

Use this file to track intentional `firestore-test-app` changes that should plausibly affect downstream `jaffle_shop` dbt assets.

Process:
1. Make one checklist change at a time.
2. Open a PR for that change.
3. Update the matching checklist item with the PR number/link, date, and observed contract-agent result.
4. Leave untouched items unchecked until they are actually implemented.

Suggested status values:
- `pending`
- `in_progress`
- `verified`
- `rejected`

Template for updates:
- `PR:` `#123`
- `Status:` `verified`
- `Observed result:` short note about whether the GitHub app flagged downstream dbt impact

## Checklist

### 1. Rename the order-to-customer foreign key
- [x] Change `raw_orders.customer` to `raw_orders.customer_id`.
- App files:
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging currently selects `customer as customer_id` from `raw_orders`, so renaming the upstream field should break or require downstream dbt changes.
- PR: `#4`
- Status: `verified`
- Observed result: `2026-04-24: sidecar-data-contract-agent-dev commented with a high-confidence, high-severity structural contract change alert. It identified stg_orders, orders, customers, ORDERS_mixed_case, customer_order_metrics, order_metrics, and order_items as impacted or indirectly impacted assets.`

### 2. Rename the order-to-store foreign key
- [ ] Change `raw_orders.store_id` to `raw_orders.location_id`.
- App files:
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging expects `store_id` in `raw_orders`.
- PR: `#27`
- Status: `pending`
- Observed result: `TBD`

### 3. Change order totals to include a non-dbt fee
- [ ] Update order creation logic so `order_total` includes an extra service fee that is not represented in `subtotal` or `tax_paid`.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
- Why this should affect dbt:
  - The downstream `orders` mart expects `order_total = subtotal + tax_paid`; changing the upstream meaning should cause a downstream semantic mismatch.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 4. Change tax calculation semantics
- [ ] Replace store-based tax calculation with channel-based or flat-rate tax calculation.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [src/models/store.ts](/Users/chustz/firestore-test-app/src/models/store.ts)
- Why this should affect dbt:
  - Downstream marts aggregate `tax_paid` and `order_total`, so a meaning change should affect business metrics even if the schema is unchanged.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 5. Rename product price field
- [ ] Change `raw_products.price` to `raw_products.unit_price`.
- App files:
  - [src/models/product.ts](/Users/chustz/firestore-test-app/src/models/product.ts)
  - [src/services/catalog-service.ts](/Users/chustz/firestore-test-app/src/services/catalog-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging expects `price` from `raw_products`.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 6. Change product taxonomy values
- [ ] Replace one or more product `type` enum values such as `jaffle` or `beverage` with new values like `food` and `drink`.
- App files:
  - [src/models/product.ts](/Users/chustz/firestore-test-app/src/models/product.ts)
  - [src/mock-data/jaffle-shop.ts](/Users/chustz/firestore-test-app/src/mock-data/jaffle-shop.ts)
- Why this should affect dbt:
  - Downstream dbt derives `is_food_item` and `is_drink_item` using the existing raw `type` values.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 7. Rename item SKU field
- [ ] Change `raw_items.sku` to `raw_items.product_sku`.
- App files:
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging expects `sku` from `raw_items` and maps it to `product_id`.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 8. Start writing one item row per quantity instead of aggregated quantity
- [ ] Change order creation so each purchased unit becomes its own `raw_items` document and remove or repurpose the `quantity` field.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
- Why this should affect dbt:
  - This changes the grain of `raw_items`, which should affect downstream item and order aggregations.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 9. Rename store opening timestamp
- [ ] Change `raw_stores.opened_at` to `raw_stores.opened_on`.
- App files:
  - [src/models/store.ts](/Users/chustz/firestore-test-app/src/models/store.ts)
  - [src/services/catalog-service.ts](/Users/chustz/firestore-test-app/src/services/catalog-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` uses `opened_at` for `stg_locations` and has a unit test around date truncation.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 10. Rename supply cost field
- [ ] Change `raw_supplies.cost` to `raw_supplies.unit_cost`.
- App files:
  - [src/models/supply.ts](/Users/chustz/firestore-test-app/src/models/supply.ts)
  - [src/services/catalog-service.ts](/Users/chustz/firestore-test-app/src/services/catalog-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging expects `cost` and rolls it into downstream `order_cost`.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 11. Remove referential validation for orders
- [ ] Stop validating that customer, store, and product references exist before writing orders and items.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
- Why this should affect dbt:
  - This can create orphaned records that should surface as downstream relationship-test failures or broken joins.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 12. Change ordered timestamp granularity or source
- [ ] Populate `raw_orders.ordered_at` differently, such as truncating at write time or using a client-provided local timestamp string.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
- Why this should affect dbt:
  - Downstream models and metrics group and rank orders by `ordered_at`, so semantic changes here should affect reporting logic.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 13. Change seeded product types without changing app code
- [ ] Update seeded/mock product records so at least one known product changes from `jaffle` to `side` or `beverage`.
- App files:
  - [src/mock-data/jaffle-shop.ts](/Users/chustz/firestore-test-app/src/mock-data/jaffle-shop.ts)
  - [src/services/seed-service.ts](/Users/chustz/firestore-test-app/src/services/seed-service.ts)
- Why this should affect dbt:
  - This is a data-only change that should still alter downstream food/drink classification and test behavior.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 14. Change seeded multi-quantity behavior
- [ ] Update seed data so orders include larger quantities or multiple repeated SKUs per order.
- App files:
  - [src/services/seed-service.ts](/Users/chustz/firestore-test-app/src/services/seed-service.ts)
- Why this should affect dbt:
  - The current repo already has a likely contract gap around item quantity vs downstream order subtotal logic; changing seeded quantities is a clean way to exercise that path.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

## Negative Cases

These are intentional controls. Upstream changes listed here should **not** be flagged as impacting downstream `jaffle_shop` dbt assets. A contract agent that flags any of these is producing a false positive.

For each item, the expected `Observed result` is something like `not flagged (true negative)`.

### A. No data impact (syntax / refactor only)

The raw Firestore document shape, field names, field types, and written values are all unchanged. Only source code structure, comments, or transport-layer naming change.

#### 15. Rename internal TypeScript helpers and variables
- [ ] Rename private/local helpers and variables inside order and catalog services (e.g. rename a local `sortedOrders` variable, split a function into `computeLineTotal` / `computeOrderTotal` with identical behavior).
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [src/services/catalog-service.ts](/Users/chustz/firestore-test-app/src/services/catalog-service.ts)
  - [src/functions/on-order-written.ts](/Users/chustz/firestore-test-app/src/functions/on-order-written.ts)
- Why this should NOT affect dbt:
  - No Firestore collection, field name, field type, or written value changes. Internal identifiers are not part of the data contract.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 16. Reorder fields inside TypeScript interfaces
- [ ] Reorder properties in `RawOrder`, `RawItem`, `RawProduct`, etc. without adding, removing, or renaming any field.
- App files:
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/models/product.ts](/Users/chustz/firestore-test-app/src/models/product.ts)
  - [src/models/store.ts](/Users/chustz/firestore-test-app/src/models/store.ts)
  - [src/models/supply.ts](/Users/chustz/firestore-test-app/src/models/supply.ts)
- Why this should NOT affect dbt:
  - Field order in a TypeScript interface has no effect on Firestore document structure or on the staging SELECT lists in `dbt_snowflake`.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 17. Add or expand JSDoc and inline comments
- [ ] Add JSDoc blocks to public service functions and inline comments clarifying business rules; do not change any code behavior.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [src/services/customer-service.ts](/Users/chustz/firestore-test-app/src/services/customer-service.ts)
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
- Why this should NOT affect dbt:
  - Comment-only changes cannot alter the shape or semantics of any upstream data.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 18. Move Zod schemas into a dedicated `src/schemas/` folder
- [ ] Extract `createCustomerSchema`, `createOrderSchema`, `updateOrderStatusSchema`, etc. from the model files into a new `src/schemas/` folder and re-export. Keep validation rules byte-identical.
- App files:
  - [src/models/customer.ts](/Users/chustz/firestore-test-app/src/models/customer.ts)
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/models/index.ts](/Users/chustz/firestore-test-app/src/models/index.ts)
- Why this should NOT affect dbt:
  - File layout refactor with no change to validation rules, payload shape, or Firestore writes.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 19. Rename an Express route path without changing payloads
- [ ] Rename e.g. `POST /seed/jaffle-shop` to `POST /admin/seed/jaffle-shop`, or version routes under `/v1/`, leaving request/response bodies and all Firestore writes identical.
- App files:
  - [src/index.ts](/Users/chustz/firestore-test-app/src/index.ts)
- Why this should NOT affect dbt:
  - HTTP route naming is a transport concern. Firestore documents, their fields, and their values are unchanged.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

### B. Data impact outside the tracked dbt surface

The app writes new data, or writes more data, but only to collections/fields that are **not** part of the `jaffle_shop` dbt staging sources (`raw_customers`, `raw_stores`, `raw_products`, `raw_supplies`, `raw_orders`, `raw_items`).

#### 20. Extend `customer_stats` with new computed fields
- [ ] Add fields like `avg_order_value` or `last_channel` to the `customer_stats` documents written by the `onOrderWritten` trigger.
- App files:
  - [src/models/customer-stats.ts](/Users/chustz/firestore-test-app/src/models/customer-stats.ts)
  - [src/functions/on-order-written.ts](/Users/chustz/firestore-test-app/src/functions/on-order-written.ts)
  - [src/utils/firestore-converter.ts](/Users/chustz/firestore-test-app/src/utils/firestore-converter.ts)
- Why this should NOT affect dbt:
  - `customer_stats` is a derived collection maintained by the app itself, not a raw staging source for `dbt_snowflake`. Adding fields to it changes app-side data without touching any `raw_*` contract.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 21. Write a new `app_state` document on seed runs
- [ ] On each call to `seedJaffleShopData`, write a document into the already-declared `app_state` collection capturing the last seed timestamp, counts, and build metadata.
- App files:
  - [src/services/seed-service.ts](/Users/chustz/firestore-test-app/src/services/seed-service.ts)
  - [src/utils/collection-refs.ts](/Users/chustz/firestore-test-app/src/utils/collection-refs.ts)
- Why this should NOT affect dbt:
  - `app_state` is an internal operational collection and is not referenced by any `dbt_snowflake` staging or mart model.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 22. Add a new `order_audit_log` collection for order mutations
- [ ] When an order is created or has its status updated, write an append-only entry to a new `order_audit_log` collection (`{order_id, previous_status, new_status, actor, changed_at}`). Do not change `raw_orders` or `raw_items`.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [src/utils/collection-refs.ts](/Users/chustz/firestore-test-app/src/utils/collection-refs.ts)
- Why this should NOT affect dbt:
  - `order_audit_log` is a brand-new collection with no corresponding dbt source, staging model, or test.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 23. Add request-level metadata to a new `api_request_log` collection
- [ ] Add middleware that logs request metadata (path, method, status, latency) into a new `api_request_log` collection. No `raw_*` writes change.
- App files:
  - [src/middleware/validate-request.ts](/Users/chustz/firestore-test-app/src/middleware/validate-request.ts)
  - [src/index.ts](/Users/chustz/firestore-test-app/src/index.ts)
  - [src/utils/collection-refs.ts](/Users/chustz/firestore-test-app/src/utils/collection-refs.ts)
- Why this should NOT affect dbt:
  - Telemetry collection is unrelated to any jaffle-shop raw source; dbt does not read it.
- PR: `TBD`
- Status: `pending`
- Observed result: `TBD`

#### 24. Add a new `product_recommendations` derived collection
- [x] Compute a lightweight "frequently-bought-together" score per SKU and write it into a new `product_recommendations` collection. Do not alter `raw_products` or `raw_items`.
- App files:
  - [src/services/catalog-service.ts](/Users/chustz/firestore-test-app/src/services/catalog-service.ts)
  - [src/functions/on-order-written.ts](/Users/chustz/firestore-test-app/src/functions/on-order-written.ts)
  - [src/utils/collection-refs.ts](/Users/chustz/firestore-test-app/src/utils/collection-refs.ts)
- Why this should NOT affect dbt:
  - The new collection is derived and owned by the app; dbt staging models only read the raw `product`/`item` sources, which are unchanged.
- PR: `TBD`
- Status: `verified`
- Observed result: `awaiting contract-agent evaluation`
