-- Rental System Database Schema
-- Created: 2024

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS rental_payment_splits;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS baggage_transports;
DROP TABLE IF EXISTS rental_items;
DROP TABLE IF EXISTS vacation_addresses;
DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS item_types;
DROP TABLE IF EXISTS price_codes;

-- Create customers table
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(50),
  address VARCHAR(255),
  postal_code VARCHAR(20),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create item_types table
CREATE TABLE item_types (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create price_codes table
CREATE TABLE price_codes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create items table
CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  item_number VARCHAR(50) NOT NULL UNIQUE,
  brand VARCHAR(100) NOT NULL,
  model_type VARCHAR(100) NOT NULL,
  gender VARCHAR(1) NOT NULL,
  brake_type VARCHAR(100) NOT NULL,
  frame_height VARCHAR(100) NOT NULL,
  wheel_size VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  license_plate VARCHAR(50) NOT NULL,
  lock_type VARCHAR(100) NOT NULL,
  frame_number VARCHAR(100) NOT NULL UNIQUE,
  lock_number VARCHAR(50) NOT NULL,
  key_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  price_code_id BIGINT,
  item_type_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (item_type_id) REFERENCES item_types(id),
  FOREIGN KEY (price_code_id) REFERENCES price_codes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create rentals table
CREATE TABLE rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  rental_number VARCHAR(50) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  comments TEXT,
  payment_status ENUM('pending', 'partially_paid', 'paid') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;

-- Create rental_items table
CREATE TABLE rental_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (rental_id) REFERENCES rentals(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
) ENGINE=InnoDB;

-- Create vacation_addresses table
CREATE TABLE vacation_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT NOT NULL,
  address VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
) ENGINE=InnoDB;

-- Create payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT NOT NULL,
  method ENUM('pin', 'cash', 'invoice', 'split') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_at DATETIME NOT NULL,
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
) ENGINE=InnoDB;

-- Create rental_payment_splits table
CREATE TABLE rental_payment_splits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL,
  item_id INT NOT NULL,
  method ENUM('pin', 'cash', 'invoice') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  FOREIGN KEY (item_id) REFERENCES rental_items(id)
) ENGINE=InnoDB;

-- Create invoices table
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  generated_at DATETIME NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  pdf_url VARCHAR(255),
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
) ENGINE=InnoDB;

-- Create baggage_transports table
CREATE TABLE baggage_transports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT NOT NULL,
  departure_date DATE NOT NULL,
  boat_departure_time TIME NOT NULL,
  baggage_dropoff_time TIME NOT NULL,
  transport_departure_time DATETIME NOT NULL,
  return_date DATE NOT NULL,
  boat_return_time TIME NOT NULL,
  baggage_pickup_time TIME NOT NULL,
  transport_return_time DATETIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
) ENGINE=InnoDB; 