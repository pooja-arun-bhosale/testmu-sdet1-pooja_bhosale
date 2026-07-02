# OrangeHRM Dashboard Test Plan

## Application Overview

OrangeHRM dashboard test plan covering widget loading, data accuracy, filters and sorting, responsive layout, and permission-based visibility.

## Test Scenarios

### 1. Dashboard

**Seed:** `tests/seed.spec.ts`

#### 1.1. Dashboard widget loading and content

**File:** `specs/dashboard.md`

**Steps:**

1. Log in to OrangeHRM using credentials from the .env file and navigate to the dashboard.
   - expect: Dashboard page loads successfully and main dashboard widgets are visible.

2. Verify the presence of key dashboard widgets such as Time at Work, My Actions, Quick Launch, Buzz Latest Posts, Employees on Leave Today, and Employee Distribution charts.
   - expect: Each widget displays a title or label and visible widget content.

#### 1.2. Filter and sort behavior

**File:** `specs/dashboard.md`

**Steps:**

1. Use available filter or control elements on dashboard widgets, if present, to change visible data.
   - expect: Widget content updates appropriately when filters are applied and no JavaScript errors occur.

2. Validate that sorting or quick access controls on dashboard lists preserve expected ordering or refresh behavior.
   - expect: Dashboard controls react visibly and the displayed data remains consistent with the selected criteria.

#### 1.3. Responsive layout

**File:** `specs/dashboard.md`

**Steps:**

1. Resize the dashboard viewport to tablet and mobile widths.
   - expect: Dashboard widgets realign or stack correctly and remain readable on smaller screens.

2. Verify that navigation and widget access remain available in responsive views.
   - expect: Side navigation collapses or adapts and dashboard cards remain accessible at reduced widths.

#### 1.4. Permission-based visibility

**File:** `specs/dashboard.md`

**Steps:**

1. Log in as the configured demo user and confirm dashboard content visibility.
   - expect: Dashboard widgets are visible only for permitted sections and no restricted admin widgets appear unexpectedly.

2. If possible, verify reduced dashboard visibility for a user with lower permissions or a role-limited view.
   - expect: Permission-restricted widgets or menu options are hidden for lower-access users and the dashboard shows only allowed widgets.

---

#### Notes

The following scenarios have limitations in the OrangeHRM public demo environment:

- **Data Accuracy:** End-to-end validation of dashboard data cannot be performed because the demo environment uses shared, dynamic data that changes over time. Database and backend API access are not available to verify the dashboard values against the underlying data source. Validation is limited to confirming that widgets, charts, and labels are displayed correctly without rendering errors.
