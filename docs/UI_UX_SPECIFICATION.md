# Storix — UI/UX Specification

**Project:** Storix  
**Document Type:** UI/UX Specification  
**Version:** 1.0  
**Status:** Initial Draft  
**Related Document:** Product Requirements Document (PRD)

---

## 1. Introduction

### 1.1. Purpose

This document defines the user interface and user experience requirements for Storix.

It describes the application structure, page layouts, reusable components, user interactions, and visual behavior.

The purpose is to establish a consistent design direction before frontend implementation begins.

### 1.2. Product Overview

Storix is a frontend-focused inventory and sales management web application built with Next.js and TypeScript.

The application combines sales information with inventory management capabilities.

Its interface should help users understand business performance, monitor sales activities, and access relevant product and inventory information.

### 1.3. Design Goals

The interface should:

- Provide a clear overview of sales performance.
- Present business information in an organized way.
- Make important information easy to find.
- Support efficient data exploration.
- Maintain consistency across all pages.
- Provide reusable and maintainable UI components.
- Support different screen sizes.
- Provide clear feedback for user actions.

---

## 2. Scope

### 2.1. Initial Design Focus

The initial design phase focuses on the following areas:

1. Dashboard
2. Sales Orders
3. Sales Order Details
4. Products
5. Product Details
6. Customers

### 2.2. Out of Scope

The following capabilities are not part of the initial UI/UX scope:

- Manufacturing management
- Bill of Materials (BOM)
- Advanced warehouse operations
- Complex shipment management
- Plugin management
- Advanced permission management
- Multi-warehouse workflows

These features may be considered in future development phases.

---

## 3. Application Structure

### 3.1. Main Navigation

The application should use a persistent sidebar for primary navigation.

Proposed navigation structure:

| Section | Description |
|---|---|
| Dashboard | Business overview and sales analytics |
| Sales | Sales orders and related information |
| Inventory | Product catalog and stock information |
| Customers | Customer information and order history |
| Suppliers | Supplier information |
| Reports | Business reports and analytics |
| Settings | Application preferences |

The visibility and implementation priority of each section will depend on the approved product scope.

### 3.2. Global Layout

The application layout consists of:

- Sidebar navigation
- Top navigation bar
- Main content area
- Breadcrumb navigation where appropriate
- User profile menu

### 3.3. Navigation Behavior

- The active navigation item must be visually distinguishable.
- Sidebar navigation must support access to all primary sections.
- Breadcrumbs must show the current page hierarchy.
- Navigation should preserve relevant page state when practical.
- The layout must adapt to smaller screens.

---

## 4. Dashboard

### 4.1. Purpose

The Dashboard provides a summary of business performance.

It should help users understand sales activity and identify important trends without opening multiple pages.

### 4.2. Dashboard Components

#### A. Sales Overview

Display key performance indicators (KPIs):

| KPI | Description |
|---|---|
| Total Revenue | Total sales revenue within the selected period |
| Total Orders | Number of sales orders |
| Completed Orders | Number of completed orders |
| Average Order Value | Average value per sales order |

KPI calculations must follow the approved business rules.

#### B. Sales Trend

Display a time-based sales chart.

Requirements:

- Support different date ranges.
- Display readable axis labels.
- Provide tooltips for data points.
- Show the selected reporting period.
- Handle empty datasets.
- Allow users to understand changes over time.

Proposed date ranges:

- Last 7 Days
- Last 30 Days
- Last 90 Days
- Last 12 Months

#### C. Order Status Distribution

Display the distribution of sales orders by status.

A chart or other visual representation may be used.

Each status must have a readable label.

#### D. Top Selling Products

Display products with the highest sales performance.

Suggested information:

- Product name
- Product image
- SKU
- Quantity sold
- Sales revenue

#### E. Recent Orders

Display the latest sales orders.

Suggested columns:

- Order ID
- Customer
- Order Date
- Total Amount
- Status

Users should be able to open an order directly from this section.

### 4.3. Dashboard Interactions

- Users can change the reporting period.
- KPI cards may link to related pages.
- Chart tooltips display detailed values.
- Product entries link to product details.
- Order entries link to order details.

---

## 5. Sales Orders

### 5.1. Purpose

The Sales Orders page provides a centralized view of customer orders.

Users should be able to find, review, and understand sales orders efficiently.

### 5.2. Page Layout

The page should contain:

1. Page title
2. Short description
3. Summary statistics
4. Search input
5. Filter controls
6. Sales orders table
7. Pagination

### 5.3. Sales Orders Table

Proposed columns:

| Column | Description |
|---|---|
| Order ID | Unique order identifier |
| Customer | Customer associated with the order |
| Order Date | Date the order was created |
| Items | Number of order line items |
| Total Amount | Total order value |
| Status | Current order status |
| Actions | Available row actions |

### 5.4. Search and Filtering

The page should support:

- Search by Order ID
- Search by Customer
- Filter by Order Status
- Filter by Date Range
- Sort by Order Date
- Sort by Total Amount

Filters should be easy to apply, review, and clear.

### 5.5. Order Status

The interface should support the approved order statuses.

Proposed status labels:

- Pending
- In Progress
- Shipped
- Complete
- Cancelled
- Returned

The final status model must be defined in the PRD.

Status indicators must use both text and visual styling.

### 5.6. Table Interactions

- Clicking an order opens its details.
- Search updates the displayed results.
- Filters can be combined.
- Sorting updates the row order.
- Pagination provides access to additional results.
- Empty results display a helpful message.

### 5.7. Optional Features

The following features may be introduced after the initial implementation:

- Saved filters
- Column visibility controls
- Bulk actions
- Data export
- Advanced filtering
- Preview drawer

---

## 6. Sales Order Details

### 6.1. Purpose

This page displays detailed information about an individual sales order.

The information should be organized into clear sections.

### 6.2. Order Header

The header should display:

- Order ID
- Customer name
- Order status
- Order date
- Total amount
- Primary available actions

### 6.3. Order Information

Display the main order information:

- Customer
- Order Date
- Expected Date, if applicable
- Order Status
- Notes
- Total Amount

### 6.4. Order Line Items

Each sales order may contain multiple products.

Suggested table columns:

| Column | Description |
|---|---|
| Product | Product name |
| SKU | Product identifier |
| Quantity | Ordered quantity |
| Unit Price | Price per unit |
| Total | Line item total |

### 6.5. Additional Sections

The page may contain the following tabs:

- Overview
- Line Items
- Shipments
- History

Only relevant tabs should be displayed.

### 6.6. Interactions

- Users can navigate to the related customer.
- Users can navigate to product details.
- Users can review order information.
- Available actions must depend on the order status.
- Important actions must provide confirmation when necessary.

---

## 7. Products

### 7.1. Purpose

The Products page provides access to the product catalog.

Users should be able to browse products and review their sales and inventory information.

### 7.2. Products Table

Proposed columns:

| Column | Description |
|---|---|
| Product | Product name |
| SKU | Unique product identifier |
| Category | Product category |
| Unit Price | Selling price |
| Stock Quantity | Current stock quantity |
| Stock Status | Inventory availability |
| Actions | Available actions |

### 7.3. Search and Filtering

The page should support:

- Search by product name
- Search by SKU
- Filter by category
- Filter by stock status
- Sort by product name
- Sort by price
- Sort by stock quantity

### 7.4. Stock Status

Proposed stock indicators:

- In Stock
- Low Stock
- Out of Stock

The rules for these statuses must be defined in the product requirements.

---

## 8. Product Details

### 8.1. Purpose

The Product Details page provides a complete view of an individual product.

### 8.2. Product Overview

Display:

- Product name
- Product image
- SKU
- Category
- Description
- Selling Price
- Stock Quantity
- Stock Status

### 8.3. Product Tabs

Proposed tabs:

| Tab | Description |
|---|---|
| Overview | Main product information |
| Inventory | Current stock information |
| Sales | Related sales orders |
| Suppliers | Related suppliers |
| History | Relevant product and stock changes |

The final tab structure depends on the approved data model.

### 8.4. Interactions

- Navigate to related sales orders.
- Navigate to related suppliers.
- Review stock information.
- Review product history.
- Display clear empty states when no related records exist.

---

## 9. Customers

### 9.1. Purpose

The Customers section provides access to customer information and their sales history.

### 9.2. Customer List

Suggested columns:

| Column | Description |
|---|---|
| Customer | Customer name |
| Email | Contact email |
| Phone | Contact number |
| Total Orders | Number of associated orders |
| Total Sales | Total sales value |
| Actions | Available actions |

### 9.3. Customer Details

The Customer Details page should contain:

- Customer information
- Contact details
- Total Orders
- Total Sales
- Recent Orders
- Sales History

Users should be able to open individual orders from the customer's history.

---

## 10. Reusable UI Components

The application should use reusable components to maintain consistency.

### 10.1. Layout Components

- AppSidebar
- Topbar
- PageContainer
- PageHeader
- Breadcrumbs

### 10.2. Data Components

- DataTable
- SearchInput
- FilterPanel
- FilterChip
- Pagination
- EmptyState
- LoadingState
- ErrorState

### 10.3. Dashboard Components

- KPICard
- SalesChart
- StatusDistributionChart
- TopProductsList
- RecentOrdersTable

### 10.4. Feedback Components

- StatusBadge
- Tooltip
- Modal
- ConfirmationDialog
- ToastNotification
- SkeletonLoader

Components should support consistent styling and predictable behavior.

---

## 11. User Experience Requirements

### 11.1. Consistency

- Similar pages must use consistent layouts.
- Buttons with the same purpose must have consistent styling.
- Status indicators must follow a shared visual system.
- Forms must use consistent validation behavior.

### 11.2. Feedback

The interface must provide feedback for important user actions.

Examples:

- Successful form submission
- Validation errors
- Failed operations
- Loading data
- Empty search results

### 11.3. Data Presentation

- Important information should be easy to identify.
- Tables should avoid unnecessary visual complexity.
- Numeric values should use consistent formatting.
- Currency values should display their currency.
- Dates should use a consistent format.

### 11.4. Accessibility

The interface should follow basic accessibility principles:

- Sufficient color contrast
- Clear focus indicators
- Keyboard navigation
- Accessible form labels
- Meaningful button labels
- Text labels for status indicators

---

## 12. Responsive Design

The application must support:

- Desktop
- Tablet
- Mobile

### 12.1. Desktop

- Persistent sidebar
- Full data tables
- Multi-column dashboard layouts
- Full access to page controls

### 12.2. Tablet

- Collapsible sidebar
- Adapted dashboard grid
- Responsive tables
- Appropriate spacing adjustments

### 12.3. Mobile

- Collapsible navigation
- Single-column layouts
- Simplified KPI presentation
- Horizontally scrollable tables where necessary
- Touch-friendly controls
- Readable forms and dialogs

Responsive behavior must preserve access to important information and actions.

---

## 13. UI States

Every data-driven page must account for the following states.

### 13.1. Loading State

Display skeletons or loading indicators while data is being loaded.

### 13.2. Empty State

Display a clear message when no records are available.

The message should explain the situation and provide an appropriate next step when possible.

### 13.3. Error State

Display a useful error message when data cannot be loaded.

Where appropriate, provide a retry action.

### 13.4. Success State

Provide visual feedback after successful operations.

### 13.5. Validation State

Show validation errors near the related form fields.

---

## 14. Frontend Architecture Considerations

Storix is currently a frontend-focused project.

The UI should be designed so that data presentation and business logic are not tightly coupled.

Recommended separation:

- Components: Reusable interface elements
- Pages: Page-level composition
- Features: Feature-specific components and logic
- Types: TypeScript data definitions
- Services: Data access layer
- Hooks: Reusable client-side logic
- Mock Data: Development and demonstration data

Mock data should follow consistent TypeScript types.

Components should not depend directly on hardcoded sample records.

The structure should allow mock data to be replaced by an API integration in the future.

No backend implementation is required by this specification.

---

## 15. Data and Business Rules Requiring Definition

Some interface elements depend on business rules that must be defined before final implementation.

| Topic | Required Decision |
|---|---|
| Revenue | Gross revenue or net revenue |
| Cancelled Orders | Whether cancelled orders affect sales statistics |
| Returned Orders | How returns affect revenue |
| Order Date | Which date is used in sales reports |
| Average Order Value | Which orders are included in the calculation |
| Stock Quantity | Total stock or available stock |
| Low Stock | Threshold definition |
| Currency | Single-currency or multi-currency support |
| Product Price | Selling price and purchase price definitions |

The UI must not make assumptions about these calculations.

---

## 16. Design Principles

The following principles should guide all UI/UX decisions:

1. **Clarity:** Present information in a clear and understandable way.
2. **Consistency:** Maintain common patterns across the application.
3. **Efficiency:** Reduce unnecessary navigation and user actions.
4. **Scalability:** Design components that can support future features.
5. **Responsiveness:** Support different screen sizes.
6. **Maintainability:** Keep components reusable and responsibilities clear.
7. **Data Accuracy:** Present information according to defined business rules.

---

## 17. Acceptance Criteria

The initial UI/UX implementation will be considered complete when:

- [ ] The main application layout is implemented.
- [ ] Primary navigation works.
- [ ] Dashboard displays the defined sales information.
- [ ] Sales Orders page displays structured order data.
- [ ] Search and basic filters work.
- [ ] Order details are accessible.
- [ ] Product list and product details are available.
- [ ] Customer list and customer details are available.
- [ ] Reusable UI components are used consistently.
- [ ] Loading, empty, and error states are implemented.
- [ ] Responsive layouts work on desktop, tablet, and mobile.
- [ ] TypeScript types are defined for the displayed data.
- [ ] Mock data is separated from UI components.
- [ ] No undefined business calculations are presented as final results.

---

## 18. Future Considerations

The following areas may be evaluated in future iterations:

- Advanced inventory management
- Multiple warehouse support
- Supplier management workflows
- Purchase orders
- Shipment management
- Advanced reporting
- Customizable dashboards
- Data export
- Notifications
- User preferences

These items are future considerations, not commitments for the initial release.

---

## 19. Conclusion

This specification establishes the initial UI/UX direction for Storix.

The primary focus is on presenting sales information in a clear and useful way while providing access to related product, inventory, and customer information.

The design should remain modular, consistent, responsive, and maintainable.

The implementation should prioritize the initial product scope and avoid unnecessary complexity.

**Document Status:** Initial Draft  
**Next Step:** Review the specification and define the detailed business rules before finalizing page designs and frontend implementation.