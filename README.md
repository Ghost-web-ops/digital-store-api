# Digital Store - Backend API

This is the backend API for the Digital Store, a full-stack e-commerce platform for selling digital products. It is built with Node.js, Express.js, and uses Prisma for powerful and safe database access to a PostgreSQL database.

## ✨ Features

- **Secure Authentication:** Full user registration and login system using JWT and bcrypt password hashing.
- **Product Management:** Complete CRUD API for creating, reading, updating, and deleting products.
- **Order Processing:** Logic for handling customer orders and linking them to purchased products.
- **Payment Integration:** Secure endpoint to create checkout sessions with Stripe.
- **Advanced Validation:** Uses Zod for robust, type-safe validation of all incoming requests.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Validation:** Zod

## 🚀 Getting Started

To run this project locally:

1. Clone the repository.
2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your PostgreSQL database.
4. Create a `.env` file and add your `DATABASE_URL` and `JWT_SECRET`.
5. Synchronize your database schema with Prisma:

    ```bash
    npx prisma db push
    ```

6. Start the server:

    ```bash
    npm run dev 
    ```
