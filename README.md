# Storix — Inventory Management System

A modern, frontend-only inventory management web application built with Next.js and TypeScript.

Storix combines inventory management with sales analytics in a simple and organized interface.

It helps users manage products, categories, suppliers, stock levels, and inventory transactions. It also provides dashboards and reports to monitor inventory and sales performance.

## Overview

Storix is a general-purpose inventory management application.

The project focuses on UI/UX design and frontend development. It does not include a backend or real business integrations.

The MVP provides a **Single Warehouse / Single User** experience.

Inventory data is stored in LocalStorage. Sales analytics use mock data.

## Goals

- Manage products and categories.
- Manage supplier information.
- Track stock movements.
- Monitor product availability.
- Identify low-stock products.
- View inventory statistics.
- Display sales analytics.
- Compare product performance.
- Provide a consistent and responsive user interface.

## MVP Features

| Feature | Description |
|---|---|
| Dashboard | Overview of inventory and sales statistics |
| Products | Create, view, update, and delete products |
| Categories | Manage product categories |
| Suppliers | Manage supplier information |
| Stock Management | Record stock IN and OUT operations |
| Transactions | View inventory movement history |
| Sales Analytics | Display simulated sales statistics and product performance |
| Settings | Manage basic application preferences |

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| TypeScript | Static type checking |
| Tailwind CSS | Styling |
| React Hook Form | Form management |
| Zod | Schema validation |
| Zustand | Client-side state management |
| Recharts | Data visualization |
| LocalStorage | Client-side data persistence |

The technology stack is subject to the decisions made during the Frontend Architecture phase.

## Project Scope

### Included in MVP

- General-purpose inventory management
- Single warehouse
- Single user
- Product management
- Category management
- Supplier management
- Stock IN / OUT operations
- Inventory transaction history
- Low-stock identification
- Inventory dashboard
- Sales analytics with mock data
- Responsive user interface
- Client-side data persistence

### Excluded from MVP

- Backend development
- Database integration
- Authentication
- Multiple user accounts
- Role-based access control
- Multi-warehouse management
- Barcode scanning
- Purchase order management
- Customer management
- Sales order management
- Invoice generation
- Payment processing
- Real sales transactions
- Advanced analytics
- Excel and PDF exports

## Business Rules

- Every product must have a unique SKU.
- Product stock must never be negative.
- Stock IN increases the available quantity.
- Stock OUT decreases the available quantity.
- Every stock movement must create a transaction record.
- Products at or below their minimum stock level must be identified as low-stock products.
- Deleting a product must not remove its historical transaction records.
- Stock OUT operations must not exceed available stock.
- Transaction quantities must be positive.
- Sales analytics must use mock data.

## Development Roadmap

| Phase | Title | Status |
|---|---|---|
| Phase 0 | Product Discovery | Completed |
| Phase 1 | Feature Planning | In Progress |
| Phase 2 | UI/UX Design | Pending |
| Phase 3 | Data Modeling | Pending |
| Phase 4 | Frontend Architecture | Pending |
| Phase 5 | Project Setup | Pending |
| Phase 6 | Core Features | Pending |
| Phase 7 | Dashboard & Analytics | Pending |
| Phase 8 | Testing & Optimization | Pending |
| Phase 9 | Release | Pending |

## Documentation

- [Product Requirements Document](docs/PRD.md)

Additional project documents will be added as their respective phases are completed.

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd storix
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Status

**Status:** Planning

Phase 0 — Product Discovery is complete.

Phase 1 — Feature Planning is in progress.

Frontend development will begin after the planning, design, data modeling, and architecture phases are complete.

## License

This project is intended for educational and portfolio purposes.