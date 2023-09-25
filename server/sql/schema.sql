CREATE DATABASE IF NOT EXISTS `test`;

USE `test`;

--
-- Table structure for table `User`
--
DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
);

--
-- Table structure for table `Edit`
--
DROP TABLE IF EXISTS `Edit`;

CREATE TABLE `Edit` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `date` datetime(3) NOT NULL,
  `model` varchar(191) NOT NULL,
  `operation` varchar(191) NOT NULL,
  `arguments` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Edit_userId_fkey` (`userId`),
  CONSTRAINT `Edit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `Patient`
--
DROP TABLE IF EXISTS `Patient`;

CREATE TABLE `Patient` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `patronymic` varchar(100) NOT NULL,
  `ageOnRegistration` smallint unsigned NOT NULL,
  `gender` smallint unsigned NOT NULL,
  `code` varchar(11) NOT NULL,
  `birthDate` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Patient_code_idx` (`code`),
  KEY `Patient_birthDate_idx` (`birthDate` DESC),
  FULLTEXT KEY `Patient_name_surname_patronymic_idx` (`name`, `surname`, `patronymic`)
);

--
-- Table structure for table `ContactInfo`
--
DROP TABLE IF EXISTS `ContactInfo`;

CREATE TABLE `ContactInfo` (
  `patientId` int unsigned NOT NULL,
  `address` text,
  `fedDist` varchar(20) DEFAULT NULL,
  `region` varchar(120) DEFAULT NULL,
  `area` varchar(120) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `settlement` varchar(120) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phones` text NOT NULL,
  `familyPhones` text NOT NULL,
  PRIMARY KEY (`patientId`),
  UNIQUE KEY `ContactInfo_patientId_key` (`patientId`),
  KEY `ContactInfo_region_idx` (`region`),
  FULLTEXT KEY `ContactInfo_address_idx` (`address`),
  CONSTRAINT `ContactInfo_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `Disease`
--
DROP TABLE IF EXISTS `Disease`;

CREATE TABLE `Disease` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int unsigned NOT NULL,
  `diagnosedAt` datetime(3) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Disease_patientId_fkey` (`patientId`),
  FULLTEXT KEY `Disease_name_idx` (`name`),
  CONSTRAINT `Disease_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `Analysis`
--
DROP TABLE IF EXISTS `Analysis`;

CREATE TABLE `Analysis` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `patientId` int unsigned NOT NULL,
  `lab` varchar(255) NOT NULL,
  `collectedAt` datetime(3) NOT NULL,
  `completedAt` datetime(3) DEFAULT NULL,
  `completedIn` int unsigned DEFAULT NULL,
  `result` text,
  PRIMARY KEY (`id`),
  KEY `Analysis_completedIn_idx` (`completedIn`),
  KEY `Analysis_patientId_fkey` (`patientId`),
  CONSTRAINT `Analysis_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);