# firestore-test-app

Firebase/Cloud Firestore test app for mocking the upstream operational data that
feeds the jaffle_shop dbt project.

The app now produces Firestore collections shaped like the dbt raw e-commerce
sources:

- `raw_customers`
- `raw_orders`
- `raw_items`
- `raw_stores`
- `raw_products`
- `raw_supplies`

It intentionally does not calculate lineage or downstream dbt impact. That
reasoning belongs to the Sidecar contract agent in `service-platform`. This app
exists to provide realistic backend contracts, validation, Firestore rules, and
business logic changes that the contract agent can inspect.
