-- Create database tables for WhatsApp Chat Bot
-- Creating all necessary tables for the chat bot functionality

-- Blocks/Municipalities table
CREATE TABLE IF NOT EXISTS blocks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    name_np VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GP/Wards table
CREATE TABLE IF NOT EXISTS wards (
    id SERIAL PRIMARY KEY,
    block_id INTEGER REFERENCES blocks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    name_np VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Electoral Booths table
CREATE TABLE IF NOT EXISTS electoral_booths (
    id SERIAL PRIMARY KEY,
    ward_id INTEGER REFERENCES wards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    name_np VARCHAR(255) NOT NULL,
    camp_details TEXT,
    camp_details_bn TEXT,
    camp_details_np TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Data table for storing user selections and details
CREATE TABLE IF NOT EXISTS user_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    block_id INTEGER REFERENCES blocks(id),
    ward_id INTEGER REFERENCES wards(id),
    booth_id INTEGER REFERENCES electoral_booths(id),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Experiences table for storing shared experiences
CREATE TABLE IF NOT EXISTS user_experiences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    experience TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
