# Database Structure

## Overview
CleanStart uses a MySQL database to store all rental, customer, and inventory management data. The database schema is designed to support efficient rental operations while maintaining data integrity through proper relationships.

## Main Tables

### 1. rentals
The primary table tracking rental transactions.

| Column          | Type         | Description                               |
|-----------------|--------------|-------------------------------------------|
| id              | INT          | Primary key                               |
| customer_id     | INT          | Foreign key to customers table            |
| rental_date     | DATETIME     | When the rental was created               |
| status          | ENUM         | Status: pending, active, completed, etc.  |
| total_amount    | DECIMAL      | Total rental amount                       |
| discount        | DECIMAL      | Any applied discount                      |
| notes           | TEXT         | Additional notes                          |
| created_at      | TIMESTAMP    | Creation timestamp                        |
| updated_at      | TIMESTAMP    | Last update timestamp                     |

### 2. rental_items
Individual items included in each rental.

| Column          | Type         | Description                               |
|-----------------|--------------|-------------------------------------------|
| id              | INT          | Primary key                               |
| rental_id       | INT          | Foreign key to rentals table              |
| item_number     | VARCHAR      | Reference to inventory item               |
| start_date      | DATE         | Start date of the rental period           |
| end_date        | DATE         | End date of the rental period             |
| price           | DECIMAL      | Price per day/unit                        |
| discount        | VARCHAR      | Discount applied to this item             |
| total           | DECIMAL      | Total price for this item                 |

### 3. boat_times
Scheduled boat service times.

| Column          | Type         | Description                               |
|-----------------|--------------|-------------------------------------------|
| id              | INT          | Primary key                               |
| rental_id       | INT          | Foreign key to rentals table              |
| service_date    | DATE         | Date of the boat service                  |
| start_time      | TIME         | Start time of the service                 |
| end_time        | TIME         | End time of the service                   |
| service_type    | VARCHAR      | Type of boat service provided             |
| location        | VARCHAR      | Service location                          |
| notes           | TEXT         | Additional information                    |

### 4. customers
Customer information.

| Column          | Type         | Description                               |
|-----------------|--------------|-------------------------------------------|
| id              | INT          | Primary key                               |
| name            | VARCHAR      | Customer name                             |
| email           | VARCHAR      | Email address                             |
| phone           | VARCHAR      | Phone number                              |
| address         | TEXT         | Physical address                          |
| created_at      | TIMESTAMP    | Creation timestamp                        |
| updated_at      | TIMESTAMP    | Last update timestamp                     |

### 5. inventory
Inventory of items available for rental.

| Column          | Type         | Description                               |
|-----------------|--------------|-------------------------------------------|
| id              | INT          | Primary key                               |
| item_number     | VARCHAR      | Unique inventory identifier               |
| name            | VARCHAR      | Item name                                 |
| category        | VARCHAR      | Item category                             |
| daily_rate      | DECIMAL      | Standard daily rental rate                |
| status          | ENUM         | Available, rented, maintenance, etc.      |
| notes           | TEXT         | Additional information                    |

## Relationships

- A **rental** belongs to one **customer**
- A **rental** has many **rental_items**
- A **rental** has many **boat_times**
- An **inventory** item can be referenced by many **rental_items**

## Migration History

### Initial Migration (v1.0.0)
- Created initial schema with core tables
- Established foreign key relationships
- Set up indexes for common query patterns

### v1.1.0 Migration
- Added service_type field to boat_times table
- Enhanced validation constraints on rental_items
- Added additional indexes for improved query performance 