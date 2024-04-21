-- Creating database
CREATE DATABASE saber;

-- User
CREATE TYPE ROLE AS ENUM ( 'user', 'courier', 'admin');
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(40) UNIQUE NOT NULL,
  password CHAR(60) NOT NULL,
  role ROLE NOT NULL DEFAULT 'user',
  phone CHAR(15) DEFAULT NULL,
  photo VARCHAR(100) DEFAULT NULL,
  balance NUMERIC(9,0) DEFAULT 0,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pickup
CREATE TYPE STATUS AS ENUM ( 'editing', 'waiting', 'success', 'failed');
CREATE TABLE pickups (
  id CHAR(36) PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  time TIMESTAMP NOT NULL,
  status STATUS NOT NULL DEFAULT 'editing',
  balance NUMERIC(9,0) DEFAULT 0,
  user_id CHAR(36) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Withdrawals
CREATE TABLE Withdrawals (
  id CHAR(36) PRIMARY KEY,
  withdrawal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount NUMERIC(9,0) DEFAULT 0,
  user_id CHAR(36) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Trash Types
CREATE TABLE trash_types (
  id CHAR(36) PRIMARY KEY,
  type VARCHAR(40) NOT NULL,
  amount NUMERIC(9,0) DEFAULT 0
);

-- Trashes
CREATE TYPE CONDITION AS ENUM ( 'waiting', 'accepted', 'declined', 'change');
CREATE TABLE trashes (
  id CHAR(36) PRIMARY KEY,
  description TEXT DEFAULT NULL,
  weight_kg NUMERIC(5,2) NOT NULL DEFAULT 0,
  photo VARCHAR(100) DEFAULT NULL,
  condition CONDITION NOT NULL DEFAULT 'waiting',
  pickup_id CHAR(36) NOT NULL,
  trash_type_id CHAR(36) NOT NULL,
  CONSTRAINT fk_pickup FOREIGN KEY(pickup_id) REFERENCES pickups(id),
  CONSTRAINT fk_trash_type FOREIGN KEY(trash_type_id) REFERENCES trash_types(id)
);

