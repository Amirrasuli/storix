# Storix
## Product Requirements Document (PRD)

| Property | Value |
|---|---|
| Product Name | Storix |
| Document Version | 1.1 |
| Status | Approved |
| Product Type | Web Application |
| Project Scope | MVP |
| Target Platform | Web |

---

# 1. Product Overview

## 1.1. Product Description

Storix is a general-purpose inventory management system with sales analytics.

It provides a unified interface for managing:

- Products
- Categories
- Suppliers
- Stock levels
- Inventory transactions
- Sales statistics

The system uses dashboards, charts, tables, and reports to present business information.

Storix is not designed for a specific industry. Its structure must support different types of businesses.

## 1.2. Problem Statement

Businesses need a simple and reliable way to manage inventory, track stock movements, and monitor product performance.

Manual inventory management can lead to errors, wasted time, and poor visibility into stock levels.

Storix aims to simplify these processes through a centralized management interface.

## 1.3. Product Vision

To provide a simple, practical, and extensible system for inventory management and sales monitoring through a unified interface.

---

# 2. Target Users

Storix is not limited to a specific industry.

Its target users are defined by their roles and responsibilities.

| User Role | Primary Need |
|---|---|
| Business Owner | Monitor overall business and inventory status |
| Sales Manager | Review sales statistics and product performance |
| Warehouse Manager | Manage stock levels and inventory transactions |
| Operator | Create and update business records |

### MVP Limitation

These roles are defined for UX design purposes.

The MVP supports a single user. It does not include authentication, multiple user accounts, or role-based access control.

---

# 3. Product Goals

The primary goals of Storix are:

1. Provide an overview of inventory status.
2. Manage products and categories.
3. Manage supplier information.
4. Record stock IN and stock OUT operations.
5. Display inventory transaction history.
6. Identify low-stock products.
7. Display sales statistics and charts.
8. Show product performance.
9. Provide a simple and intuitive user interface.
10. Maintain an extensible and maintainable project structure.

---

# 4. Scope Definition

## 4.1. In Scope — MVP

The following features are included in the MVP:

- Dashboard
- Product Management
- Category Management
- Supplier Management
- Stock Management
- Transaction History
- Sales Analytics
- Basic Settings
- Responsive UI
- Local Data Persistence

## 4.2. Out of Scope — MVP

The following features are excluded from the initial release:

- Multi-Warehouse Management
- Authentication
- User Management
- Role-Based Access Control
- Real Backend Integration
- Barcode Scanner
- Purchase Orders
- Customer Management
- Order Management
- Invoice Generation
- Payment Management
- Real Sales Processing
- Advanced Analytics
- Excel/PDF Export

## 4.3. Project Constraints

| Constraint | Description |
|---|---|
| Warehouse | Single Warehouse |
| Users | Single User |
| Backend | Not included |
| Persistence | LocalStorage |
| Sales Data | Mock Data |
| Business Type | General-purpose |
| Application Type | Frontend-focused |

## 4.4. Sales Analytics Scope

Sales analytics are part of the MVP.

However, Storix does not manage real sales operations.

The MVP only displays simulated sales information.

Included:

- Sales quantity statistics
- Sales revenue statistics
- Sales charts
- Best-selling products
- Product performance comparisons

Excluded:

- Creating sales orders
- Managing customers
- Generating invoices
- Processing payments
- Recording real sales transactions

---

# 5. Functional Requirements

## 5.1. Dashboard

- FR-01: Display the total number of products.
- FR-02: Display the total number of units in stock.
- FR-03: Display the number of low-stock products.
- FR-04: Display the estimated total inventory value.
- FR-05: Display sales charts.
- FR-06: Display recent inventory transactions.
- FR-07: Display best-selling products.

## 5.2. Product Management

- FR-08: Create a new product.
- FR-09: Update product information.
- FR-10: Delete a product.
- FR-11: View product details.
- FR-12: Display a list of products.
- FR-13: Search products.
- FR-14: Filter products.
- FR-15: Sort products.
- FR-16: Paginate product lists.

## 5.3. Category Management

- FR-17: Create a category.
- FR-18: Update a category.
- FR-19: Delete a category.
- FR-20: Display a list of categories.

## 5.4. Supplier Management

- FR-21: Create a supplier.
- FR-22: Update supplier information.
- FR-23: Delete a supplier.
- FR-24: Display a list of suppliers.
- FR-25: View supplier details.

## 5.5. Stock Management

- FR-26: Record stock IN operations.
- FR-27: Record stock OUT operations.
- FR-28: Display current product stock levels.
- FR-29: Prevent stock OUT operations that exceed available stock.
- FR-30: Allow users to add notes to stock transactions.
- FR-31: Identify low-stock products.

## 5.6. Transaction Management

- FR-32: Display inventory transaction history.
- FR-33: Filter transactions by type.
- FR-34: Filter transactions by product.
- FR-35: View transaction details.
- FR-36: Display transaction dates and quantities.

## 5.7. Sales Analytics

- FR-37: Display sales quantities for a selected date range.
- FR-38: Display sales revenue.
- FR-39: Display sales charts.
- FR-40: Display best-selling products.
- FR-41: Compare product performance.

### Sales Data Source

All sales data in the MVP must use mock data.

The system does not create real sales transactions or process payments.

## 5.8. Settings

- FR-42: Display basic application settings.
- FR-43: Allow users to change basic appearance settings, if included in the design scope.

---

# 6. Non-Functional Requirements

| ID | Requirement | Description |
|---|---|---|
| NFR-01 | Responsive Design | Support desktop, tablet, and mobile screens. |
| NFR-02 | Performance | Provide fast page rendering and interactions. |
| NFR-03 | Usability | Provide a simple and intuitive interface. |
| NFR-04 | Accessibility | Follow accessibility best practices. |
| NFR-05 | Maintainability | Use a maintainable project structure. |
| NFR-06 | Consistency | Maintain consistent UI patterns across pages. |
| NFR-07 | Data Persistence | Preserve data after page refreshes. |
| NFR-08 | Error Handling | Display clear and useful error messages. |
| NFR-09 | Validation | Validate user input before processing. |

---

# 7. Business Rules

1. Every product must have a unique SKU.
2. Product stock quantity must never be negative.
3. Stock IN operations must increase the product quantity.
4. Stock OUT operations must decrease the product quantity.
5. Every stock change must create a transaction record.
6. Products below their minimum stock level must be identified.
7. Deleting a product must not delete its transaction history.
8. Sales data in the MVP must be simulated.
9. Transaction quantities must be positive numbers.
10. Stock OUT operations are allowed only when sufficient stock is available.

---

# 8. User Experience Requirements

The user interface must meet the following requirements:

- Every page must have a clear purpose.
- Primary actions must be easy to find.
- Forms must display clear validation messages.
- Tables must support search and filtering where applicable.
- Successful and failed operations must provide feedback.
- Destructive actions must require confirmation.
- Stock status must use both color and text.
- Pages must support Loading, Empty, and Error states.
- UI components and patterns must remain consistent.
- Layouts must work across different screen sizes.
- Important information must be easy to scan.
- Navigation must remain clear and predictable.

---

# 9. Data Persistence

LocalStorage will be used for data persistence in the MVP.

The application must:

- Preserve product data after page refreshes.
- Preserve category data.
- Preserve supplier data.
- Preserve transaction history.
- Preserve stock quantity changes.
- Keep mock sales data available for dashboard charts and reports.

### Limitation

LocalStorage is an initial client-side persistence solution.

It is not a replacement for a real backend or database.

---

# 10. MVP Acceptance Criteria

The MVP must successfully support the following scenario:

1. Create a category named `Electronics`.
2. Create a supplier.
3. Create a product named `Keyboard` with an initial quantity of 20.
4. Record a stock IN transaction of 10 units.
5. Record a stock OUT transaction of 5 units.
6. Display the final stock quantity as 25.
7. Display both transactions in the transaction history.
8. Preserve all data after refreshing the page.

The MVP passes this acceptance test when all steps work as expected.

---

# 11. Technology Direction

The initial technology stack is:

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| TypeScript | Static type checking |
| Tailwind CSS | Styling |
| React Hook Form | Form management |
| Zod | Schema validation |
| Zustand | Client-side state management |
| Recharts | Data visualization |
| LocalStorage | Initial data persistence |

This is the initial technical direction.

Final implementation decisions will be made during the Frontend Architecture phase.

---

# 12. Project Roadmap

| Phase | Title | Status |
|---|---|---|
| Phase 0 | Product Discovery | Completed |
| Phase 1 | Product Backlog | In Progress |
| Phase 2 | UI/UX Design | Pending |
| Phase 3 | Data Modeling | Pending |
| Phase 4 | Frontend Architecture | Pending |
| Phase 5 | Project Setup | Pending |
| Phase 6 | Core Features | Pending |
| Phase 7 | Dashboard & Analytics | Pending |
| Phase 8 | Testing & Optimization | Pending |
| Phase 9 | Release | Pending |

---

# 13. Project Success Criteria

The MVP is considered successful when:

- All defined MVP features are functional.
- All business rules are enforced.
- Data persists after page refreshes.
- The interface works on desktop, tablet, and mobile screens.
- All pages follow a consistent design system.
- The project structure is maintainable and extensible.
- Sales analytics display the expected mock data.
- The MVP acceptance scenario passes successfully.

---

# 14. Document Information

| Property | Value |
|---|---|
| Document | Storix PRD |
| Version | 1.1 |
| Phase | Product Discovery |
| Status | Completed |
| Last Updated | 2026-11-02 |