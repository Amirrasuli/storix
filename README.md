# Storix — Inventory Management System

A modern inventory management web application built with Next.js and TypeScript.

Storix helps users manage products, categories, suppliers, and stock movements through a simple and organized dashboard.

## Overview

Storix is a frontend-focused inventory management application.

The main goal is to provide a clear and reliable way to manage warehouse inventory, track stock movements, and monitor product availability.

The first release focuses on a **Single Warehouse / Single User** experience.

## Goals

- Manage products and categories.
- Manage suppliers.
- Track stock movements.
- Monitor product availability.
- Identify low-stock products.
- View inventory statistics.
- Keep inventory data organized and accessible.

## MVP Features

| Feature | Description |
|---|---|
| Dashboard | Overview of inventory statistics |
| Products | Create, view, update, and delete products |
| Categories | Manage product categories |
| Suppliers | Manage suppliers |
| Stock Management | Record stock IN and OUT |
| Transactions | View inventory movement history |
| Settings | Manage basic application settings |

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| TypeScript | Static type checking |
| Tailwind CSS | Styling |
| React Hook Form | Form management |
| Zod | Schema validation |
| Recharts | Data visualization |
| Zustand | Client-side state management |
| LocalStorage | Initial data persistence |

## Project Scope

### MVP

- Single warehouse
- Single user
- Local data persistence
- Product CRUD operations
- Category management
- Supplier management
- Stock IN / OUT operations
- Transaction history
- Basic analytics

### Future Improvements

- Multi-warehouse management
- Authentication
- Role-based access control
- Backend integration
- Barcode scanning
- Purchase orders
- Sales management
- Advanced analytics
- Excel and PDF exports

## Development Roadmap

- [ ] Phase 0 — Product Discovery
- [ ] Phase 1 — Product Backlog
- [ ] Phase 2 — UI/UX Design
- [ ] Phase 3 — Data Modeling
- [ ] Phase 4 — Frontend Architecture
- [ ] Phase 5 — Project Setup
- [ ] Phase 6 — Core Features
- [ ] Phase 7 — Dashboard & Analytics
- [ ] Phase 8 — Testing & Optimization
- [ ] Phase 9 — Release

## Business Rules

- Every product must have a unique SKU.
- Product stock cannot be negative.
- Stock IN increases available quantity.
- Stock OUT decreases available quantity.
- Every stock movement must create a transaction record.
- Low-stock products must be identified.
- Product deletion must not remove its historical transaction records.

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

Storix is currently in the product planning phase. Development will start after the requirements, backlog, and frontend architecture are defined.

## License

This project is currently for educational and portfolio purposes.
