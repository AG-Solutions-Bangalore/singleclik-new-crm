# Implementation Plan: SingleClik CRM Referral System APIs & Management

This document details the completed phase-by-phase implementation of all 8 Referral APIs for the SingleClik CRM panel, adhering to existing codebase patterns, Ponytail minimalism, and validated backend schemas.

---

## 1. Verified API Specification & Payloads

Credentials verified against `https://singleclik.com/api/public`:
- **Auth Token Header**: `Authorization: Bearer <token>`
- **Storage Path for Images**: `https://singleclik.com/api/storage/app/public/refferalproducts_images/{image_name}`

| # | Endpoint | Method | Payload / Params | Status | Response Summary |
|---|----------|--------|------------------|--------|------------------|
| 1 | `/api/fetch-refferal-product-list` | `GET` | None | [x] Completed | `{ code: 200, data: ReferralProduct[], image_url: string }` |
| 2 | `/api/panel-create-refferal-product` | `POST` | FormData: `refferal_products_for` ("1", "2", "1,2"), `refferal_products`, `refferal_products_description`, `refferal_products_points`, `refferal_product_validity`, `refferal_products_image` | [x] Completed | `{ code: 200, msg: "Product created Successfully" }` |
| 3 | `/api/panel-fetch-refferal-product-by-id/{id}` | `GET` | `id` in URL | [x] Completed | `{ data: ReferralProduct, image_url: string }` |
| 4 | `/api/panel-update-refferal-product/{id}?_method=PUT` | `POST` | FormData: `refferal_products_for`, `refferal_products`, `refferal_products_description`, `refferal_products_points`, `refferal_product_validity`, `refferal_products_image` (optional), `refferal_products_status` | [x] Completed | `{ code: 200, msg: "Product updated Successfully" }` |
| 5 | `/api/panel-update-refferal-product-status/{id}` | `PUT` | JSON: `{ refferal_products_status: "Active" \| "Inactive" }` | [x] Completed | `{ code: 200, msg: "Product status updated Successfully" }` |
| 6 | `/api/fetch-refferal-point-list` | `GET` | None | [x] Completed | `{ code: 200, data: ReferralPoint[] }` |
| 7 | `/api/fetch-refferal-claim-point-list` | `GET` | None | [x] Completed | `{ code: 200, data: ReferralClaimPoint[] }` |
| 8 | `/api/panel-update-refferal-claim-point-status/{id}` | `PUT` | JSON: `{ refferal_claim_point_status: string }` | [x] Completed | `{ code: 200, msg: "Refferal Claim Point status updated Successfully" }` |

---

## 2. Phase-by-Phase Implementation Status

### Phase 1: API & Types Foundation (`src/modules/referral/`) — [x] COMPLETED
- **File**: `src/modules/referral/types/referral.ts`
  - Defined interfaces:
    - `ReferralProduct`: id, `refferal_products_for`, `refferal_products`, `refferal_products_description`, `refferal_products_points`, `refferal_product_validity`, `refferal_products_image`, `refferal_products_status`, timestamps.
    - `ReferralProductFormState`: form fields for create and edit.
    - `ReferralPoint`: id, `refferal_from_id`, `referred_to_id`, `refferal_point`, `refferal_point_date`, `reffer_user`, `referred_user`.
    - `ReferralClaimPoint`: id, `user_id`, `refferal_claim_point`, `refferal_claim_created_date`, `refferal_claim_validity_date`, `refferal_product_id`, `refferal_claim_point_status`, `user`, `claim_products`.
- **File**: `src/modules/referral/api/referral.api.ts`
  - URL constants and helper functions with Bearer token authentication via `authHeaders()`.

### Phase 2: React Query Hooks Layer (`src/modules/referral/hooks/useReferral.ts`) — [x] COMPLETED
- Query Hooks:
  - `useReferralProductList()`
  - `useReferralProductDetail(id)`
  - `useReferralPointList()`
  - `useReferralClaimList()`
- Mutation Hooks:
  - `useCreateReferralProduct()`
  - `useUpdateReferralProduct()`
  - `useUpdateReferralProductStatus()`
  - `useUpdateReferralClaimStatus()`
- Cache invalidation and toast feedback with `@tanstack/react-query` and `react-hot-toast`.

### Phase 3: Referral Products Management UI — [x] COMPLETED
- **File**: `src/modules/referral/pages/ReferralProductList.tsx`
  - DataTable with image preview, title, target audience badge ("1: Business", "2: Consumer", "1,2: Both"), points required, validity days, status switch/badge with toggle, and edit action.
  - Status toggle action calling `panel-update-refferal-product-status/{id}`.
- **File**: `src/modules/referral/pages/ReferralProductAdd.tsx`
  - Form matching requirements:
    - Multi-select / dual-select dropdown for `refferal_products_for` allowing selecting 1 (Business), 2 (Consumer), or both ("1,2") with synchronized checkboxes.
    - `refferal_products` (Title)
    - `refferal_products_description` (Textarea)
    - `refferal_products_points` (Points)
    - `refferal_product_validity` (Validity days)
    - `refferal_products_image` (Image upload with preview)
- **File**: `src/modules/referral/pages/ReferralProductEdit.tsx`
  - Loads data via `useReferralProductDetail(id)`.
  - Supports image replacement or keeping existing image with live preview.
  - Status dropdown ("Active" / "Inactive").
  - Form submission calling `panel-update-refferal-product/{id}?_method=PUT`.

### Phase 4: Referral Points Ledger UI — [x] COMPLETED
- **File**: `src/modules/referral/pages/ReferralPointsList.tsx`
  - Displays all awarded referral points.
  - Columns: SL No, Referring Member (`reffer_user.name`), Referred Member (`referred_user.name`), Points Awarded (`refferal_point`), Award Date (`refferal_point_date`).
  - Search filter, tabular layout with `DataTable`.

### Phase 5: Referral Claim Points UI & Status Update — [x] COMPLETED
- **File**: `src/modules/referral/pages/ReferralClaimsList.tsx`
  - Displays reward claims made by users.
  - Columns: SL No, User Name, Claimed Product, Points, Claim Date, Validity Date, Status Badge.
  - Quick status update action dropdown menu to update `refferal_claim_point_status` (Pending, Approved, Rejected, Completed) via `panel-update-refferal-claim-point-status/{id}`.

### Phase 6: Navigation & Route Registration — [x] COMPLETED
- **File**: `src/App.tsx`:
  - Registered `/referral-products`
  - Registered `/add-referral-product`
  - Registered `/edit-referral-product/:id`
  - Registered `/referral-points`
  - Registered `/referral-claims`
- **File**: `src/components/layout/SideNav.tsx`:
  - Added navigation items for:
    - "Referral Products"
    - "Referral Points"
    - "Referral Claims"

### Phase 7: Verification & Build Validation — [x] COMPLETED
- Successfully compiled and built with zero errors via `tsc -b && vite build`.
