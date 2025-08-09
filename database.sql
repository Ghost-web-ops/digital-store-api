-- Creates the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash CHAR(60) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creates the products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    file_url VARCHAR(255) NOT NULL, -- Link to download the digital product
    image_url VARCHAR(255), -- Link to the product's display image
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creates the orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- e.g., completed, pending, failed
    order_date TIMESTAMPTZ DEFAULT NOW()
);

-- Creates the order_items table to link products to orders
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    price_at_purchase DECIMAL(10, 2) NOT NULL -- Price of the product at the time of purchase
);