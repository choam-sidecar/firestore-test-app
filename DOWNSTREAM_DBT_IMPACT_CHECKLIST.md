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
- `merged`
- `verified`
- `rejected`

Template for updates:
- `PR:` `#123`
- `Merged:` `YYYY-MM-DD`
- `Status:` `merged`
- `Observed result:` short note about whether the GitHub app flagged downstream dbt impact

## Checklist

### 1. Rename the order-to-customer foreign key
- [ ] Change `raw_orders.customer` to `raw_orders.customer_id`.
- App files:
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging currently selects `customer as customer_id` from `raw_orders`, so renaming the upstream field should break or require downstream dbt changes.
- PR: `TBD`
- Merged: `TBD`
- Status: `in_progress`
- Observed result: `TBD`

### 2. Rename the order-to-store foreign key
- [ ] Change `raw_orders.store_id` to `raw_orders.location_id`.
- App files:
  - [src/models/order.ts](/Users/chustz/firestore-test-app/src/models/order.ts)
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
  - [firestore/firestore.rules](/Users/chustz/firestore-test-app/firestore/firestore.rules)
- Why this should affect dbt:
  - `dbt_snowflake` staging expects `store_id` in `raw_orders`.
- PR: `TBD`
- Merged: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 3. Change order totals to include a non-dbt fee
- [ ] Update order creation logic so `order_total` includes an extra service fee that is not represented in `subtotal` or `tax_paid`.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
- Why this should affect dbt:
  - The downstream `orders` mart expects `order_total = subtotal + tax_paid`; changing the upstream meaning should cause a downstream semantic mismatch.
- PR: `TBD`
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 11. Remove referential validation for orders
- [ ] Stop validating that customer, store, and product references exist before writing orders and items.
- App files:
  - [src/services/order-service.ts](/Users/chustz/firestore-test-app/src/services/order-service.ts)
- Why this should affect dbt:
  - This can create orphaned records that should surface as downstream relationship-test failures or broken joins.
- PR: `TBD`
- Merged: `TBD`
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
- Merged: `TBD`
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
- Merged: `TBD`
- Status: `pending`
- Observed result: `TBD`

### 14. Change seeded multi-quantity behavior
- [ ] Update seed data so orders include larger quantities or multiple repeated SKUs per order.
- App files:
  - [src/services/seed-service.ts](/Users/chustz/firestore-test-app/src/services/seed-service.ts)
- Why this should affect dbt:
  - The current repo already has a likely contract gap around item quantity vs downstream order subtotal logic; changing seeded quantities is a clean way to exercise that path.
- PR: `TBD`
- Merged: `TBD`
- Status: `pending`
- Observed result: `TBD`
