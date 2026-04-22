# CP Connect - Database Architecture

This document describes the database architecture for CP Connect, optimized for multi-tenant SaaS, high-performance public reading, and future scalability.

## Core Principles

1.  **ULID Identification**: All primary keys use ULIDs (`char(26)`). This ensures non-sequential, globally unique IDs that are sortable and efficient for indexing.
2.  **Single Schema Multi-Tenancy**: The project uses a shared MySQL database. Each tenant's data is isolated via `tenant_id` using Eloquent Global Scopes.
3.  **Denormalization for Performance**: The `flix_cards` table is denormalized to allow the "CreativeFlix" public directory to list profiles with zero joins.
4.  **Snake Case**: All table and column names follow the `snake_case` convention.
5.  **Plan-Based Limits**: Resource limits (max images, blocks, etc.) are stored as JSON in the `connect_plans` table and enforced via application logic, not database constraints.

## Table Structure

### Core & Tenants
- `connect_plans`: Subscription tiers with resource limits in `limits_json`.
- `tenants`: The primary entity represent a "client". References `connect_plans`.
- `tenant_users`: Users associated with a specific tenant.

### Content & Pages
- `tenant_pages`: Flexible page content (links, landing, store) with content, style, and links stored as JSON.
- `media_assets`: Metadata and URLs for images/videos. Binaries are stored in external storage (S3/R2).

### CreativeFlix (Directory)
- `flix_cards`: Denormalized table for public reading. Synchronized automatically when tenant data changes.
- `flix_categories`: Global categories for the directory.
- `flix_cities`: Global cities for the directory.

### E-commerce & CRM
- `products`, `customers`, `orders`: Foundation for the store module.
- `partners`, `commission_records`, `payouts`: Foundation for the affiliate/referral system.
- `coupons`, `testimonials`, `abandoned_carts`: Marketing and conversion tools.

## Synchronization & Cache

### Flix Synchronization
Data is synchronized from `tenants` and `tenant_pages` to `flix_cards` using the `FlixSyncService`. This service is triggered by `TenantObserver` (or direct service calls) whenever relevant data is updated.

### Cache Versioning
To support aggressive caching (HTML/Data) in shared hosting environments, a global `flix_version` is stored in the `system_settings` table. This version is incremented whenever a card is updated, allowing for effective cache busting.

## Scalability Guidelines
- **Avoid Joins**: For public listing, always read from `flix_cards`.
- **JSON for Flexibility**: Use JSON fields for content that varies between templates (e.g., page blocks).
- **Index Heavily**: Always include `tenant_id` and `status`/`category_id`/`city_id` in compound indexes for fast filtering.
