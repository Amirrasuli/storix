# Storix — Inventory Management System

A modern, frontend-focused inventory management web application built with Next.js and TypeScript.

Storix helps businesses manage products, categories, suppliers, and stock movements. It also provides sales analytics through a clear and organized dashboard.

## Overview

Storix is a general-purpose inventory management application.

It combines inventory management with sales analytics in a single interface.

The project focuses on a **Single Warehouse / Single User** experience.

The MVP uses LocalStorage for data persistence and mock data for sales analytics. It does not require a real backend.

## Goals

- Manage products and categories.
- Manage supplier information.
- Track stock movements.
- Monitor product availability.
- Identify low-stock products.
- View inventory statistics.
- Display sales analytics.
- Compare product performance.
- Keep business data organized and accessible.

## MVP Features

| Feature | Description |
|---|---|
| Dashboard | Overview of inventory and sales statistics |
| Products | Create, view, update, and delete products |
| Categories | Manage product categories |
| Suppliers | Manage supplier information |
| Stock Management | Record stock IN and OUT operations |
| Transactions | View inventory movement history |
| Sales Analytics | Display sales statistics and product performance using mock data |
| Settings | Manage basic application settings |

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
| LocalStorage | Initial data persistence |

## Project Scope

### MVP

- General-purpose inventory management
- Single warehouse
- Single user
- Product CRUD operations
- Category management
- Supplier management
- Stock IN / OUT operations
- Transaction history
- Low-stock identification
- Inventory dashboard
- Sales analytics with mock data
- Responsive user interface
- Local data persistence

### Out of Scope

- Multi-warehouse management
- Authentication
- User management
- Role-based access control
- Real backend integration
- Barcode scanning
- Purchase orders
- Customer management
- Order management
- Invoice generation
- Payment management
- Real sales processing
- Advanced analytics
- Excel and PDF exports

### Future Improvements

Features outside the MVP may be considered for future releases.

- Multi-warehouse support
- Authentication and user management
- Role-based access control
- Backend integration
- Barcode scanning
- Purchase order management
- Customer and sales management
- Advanced analytics
- Excel and PDF exports

## Business Rules

- Every product must have a unique SKU.
- Product stock cannot be negative.
- Stock IN increases available quantity.
- Stock OUT decreases available quantity.
- Every stock movement must create a transaction record.
- Low-stock products must be identified.
- Product deletion must not remove its historical transaction records.
- Stock OUT operations must not exceed available stock.
- Transaction quantities must be positive.
- Sales analytics must use mock data in the MVP.

## Development Roadmap

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

## Documentation

Project documentation is available in the `docs` directory.

- [Product Requirements Document](docs/PRD.md)
- [Product Backlog](docs/PRODUCT-BACKLOG.md) — Coming soon
- [UI/UX Design](docs/UI-UX-DESIGN.md) — Coming soon
- [Data Model](docs/DATA-MODEL.md) — Coming soon
- [Frontend Architecture](docs/FRONTEND-ARCHITECTURE.md) — Coming soon

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

Phase 0 (Product Discovery) is complete.

The project is currently entering Phase 1 (Product Backlog). Development will start after product requirements, UI/UX design, data modeling, and frontend architecture are defined.

## License

This project is currently intended for educational and portfolio purposes.