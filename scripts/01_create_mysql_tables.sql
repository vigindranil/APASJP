-- Create tables for WhatsApp Chat Bot in MySQL
-- Run this script in your MySQL database: db_apas

USE db_apas;

-- Create blocks table
CREATE TABLE IF NOT EXISTS blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    name_np VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wards table
CREATE TABLE IF NOT EXISTS wards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    name_np VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- Create electoral_booths table
CREATE TABLE IF NOT EXISTS electoral_booths (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ward_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255),
    name_np VARCHAR(255),
    camp_details TEXT,
    camp_details_bn TEXT,
    camp_details_np TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(id) ON DELETE CASCADE
);

-- Create user_data table
CREATE TABLE IF NOT EXISTS user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    block_id INT NOT NULL,
    ward_id INT NOT NULL,
    booth_id INT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (block_id) REFERENCES blocks(id),
    FOREIGN KEY (ward_id) REFERENCES wards(id),
    FOREIGN KEY (booth_id) REFERENCES electoral_booths(id)
);

-- Create user_experiences table
CREATE TABLE IF NOT EXISTS user_experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    experience TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
