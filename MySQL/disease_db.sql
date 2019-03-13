DROP DATABASE IF EXISTS disease_db;
CREATE DATABASE disease_db;
USE disease_db;
CREATE TABLE disease_data (
  ID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Disease VARCHAR(50) NOT NULL,
  Fatalities INT,
  State VARCHAR(50),
  City VARCHAR(50),
  PeriodStartDate DATE,
  PeriodEndDate DATE,
  CountValue Int
);


