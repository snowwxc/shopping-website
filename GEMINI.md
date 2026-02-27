# Project name: Wood carving website
## Tech Stack
- **Frontend Framework:** Angular
- **Backend Framework:** Spring Boot
- **Styling:** Angular Material
- **Icons:** Material Icons
- **State Management:** RxJS with Angular Services
- **Payment Gateway:** Stripe

## Coding Standards (The "Vibe")
- **Component Pattern:** Use Angular components with TypeScript.
- **Styling Preference:** Use component-specific styles; avoid global CSS files.
- **Cleanliness:** Remove console logs and unused imports before finishing a task.
- **Naming:** Use kebab-case for filenames and PascalCase for components and classes.
- **Backend:** Follow standard Java and Spring Boot conventions.

## Agent Workflow Rules
1. **Plan First:** Before making changes, provide a bulleted plan and ask for approval.
2. **Atomic Commits:** After completing a logic block, suggest a `git commit` command.
3. **Self-Check:** Run `ng build` and `mvn spring-boot:build-image` after major changes to catch breaking errors.
4. **Iterative Development:** Complete tasks one by one, verifying that everything builds and works correctly at the end of each task.
5. **Task Completion:** After completing a task, add implementation details to the description of the matching task in the GitHub project and mark the task as done.

## Persona
- **Role:** Full-stack developer
- **Goal:** Build a wood carving shopping website.
- **Priorities:**
    - Code conciseness.
    - Modern best practices.
    - Speed to market.
    - Security.

## Features

### Merchant (Admin)
-   **Admin Dashboard:** A password-protected area for all merchant activities.
-   **Product Management:**
    -   Upload new wood carvings with pictures, descriptions, and prices.
    -   Update product details and pictures.
    -   Manage inventory by setting and adjusting stock levels.
    -   View all listed products.
-   **Order Management:**
    -   View a list of incoming customer orders.
    -   Update order status (e.g., "Processing", "Shipped", "Completed").
-   **Customer Communication:**
    -   View and reply to questions submitted by customers.

### Customer
-   **Product Browsing:**
    -   A main gallery page to view all wood carvings.
    -   A detailed page for each product showing images, description, price, and stock availability.
-   **Shopping Cart:**
    -   Add items to a cart.
    -   View and update the cart before purchase.
-   **Checkout:**
    -   A simple and secure checkout process using an existing Stripe plug-in for payments.
-   **Q&A Feature:**
    -   A form on product pages for customers to ask questions.

## Project Management
- **Task Tracking:** Features and tasks will be tracked in the GitHub project: https://github.com/users/snowwxc/projects/2
    - The GitHub project can be managed by invoking GitHub CLI.

## Major Code Directory

### Backend (`backend/`)
-   `src/main/java/com/example/woodcarvingwebsite/entity`: JPA entities (Product, Order, User, Question).
-   `src/main/java/com/example/woodcarvingwebsite/repository`: Spring Data JPA repositories.
-   `src/main/java/com/example/woodcarvingwebsite/controller`: REST controllers for API endpoints.
-   `src/main/java/com/example/woodcarvingwebsite/service`: Business logic and service layer.
-   `src/main/java/com/example/woodcarvingwebsite/security`: Spring Security configuration and related classes.

### Frontend (`frontend/`)
-   `src/app/core`: Core services, authentication, and global utilities.
-   `src/app/shared`: Shared components, modules, and directives.
-   `src/app/auth`: Authentication-related components and services (login, registration).
-   `src/app/admin`: Components and modules for the merchant dashboard (Product Management, Order Management, Q&A Management).
-   `src/app/shop`: Components and modules for customer-facing shop (Product Gallery, Product Detail, Shopping Cart, Checkout).