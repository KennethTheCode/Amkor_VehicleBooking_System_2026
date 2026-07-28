-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: AmkorVehicleBookingSystem
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `AmkorVehicleBookingSystem`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `AmkorVehicleBookingSystem` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `AmkorVehicleBookingSystem`;

--
-- Table structure for table `BookingTable`
--

DROP TABLE IF EXISTS `BookingTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `BookingTable` (
  `ticket_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `pick_up` varchar(255) NOT NULL,
  `drop_off` varchar(55) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `date_needed` date NOT NULL,
  `time_needed` time NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `fk_user` (`user_id`),
  KEY `fk_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `UserTable` (`user_id`),
  CONSTRAINT `fk_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `VehicleTable` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BookingTable`
--

LOCK TABLES `BookingTable` WRITE;
/*!40000 ALTER TABLE `BookingTable` DISABLE KEYS */;
INSERT INTO `BookingTable` VALUES (53,8,8,5,'Muntinlupa','Pacita','Meeting','2026-07-23','16:30:00','Finished','2026-07-23 08:55:37'),(55,8,10,9,'amkor','amkor p3','go to my dorm','2026-07-23','17:00:00','Finished','2026-07-23 08:57:04'),(56,8,8,5,'Amkor Coop','18th Street Pacita San Pedro Laguna','Drop off Kenneth at 18th Street Pacita San Pedro Laguna, Load Land Cruiser 2024 with gas (full tank), go to P3 to deliver document and finished encoded data.  go back to the dorm to check on Pau. Bring back vehicle to Amkor Coop','2026-07-24','00:00:00','Finished','2026-07-24 04:24:29'),(57,8,11,5,'awd','awd','awd','2026-07-25','13:04:00','Finished','2026-07-24 07:04:15'),(59,8,12,9,'Mabuhay Street Carmona Cavite','University of Perpetual Help System Laguna','Go to Meeting','2026-08-01','07:00:00','Finished','2026-07-26 10:46:07'),(60,8,12,9,'Sample 1','Sample 2','go home','2026-07-29','08:39:00','Ongoing','2026-07-27 02:39:33');
/*!40000 ALTER TABLE `BookingTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DriverTable`
--

DROP TABLE IF EXISTS `DriverTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DriverTable` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `license_no` varchar(255) NOT NULL,
  `expiration_date` date NOT NULL,
  `picture` varchar(255) NOT NULL,
  `availability` tinyint(1) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DriverTable`
--

LOCK TABLES `DriverTable` WRITE;
/*!40000 ALTER TABLE `DriverTable` DISABLE KEYS */;
INSERT INTO `DriverTable` VALUES (5,'John Roa Cruz Diamantee','123','john@gmail.com','N0730182639','2026-07-24','uploadsDriver/1784603009_16195869_239593453163597_6958556087762250480_n.jpg',1,'Active'),(9,'2Kenneth','2Kenneth','sample@gmail.com','12525112313','2026-07-21','uploadsDriver/1784600005_Avanza.jpeg',0,'Active');
/*!40000 ALTER TABLE `DriverTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FinishedTicket`
--

DROP TABLE IF EXISTS `FinishedTicket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FinishedTicket` (
  `finished_id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `pick_up` varchar(255) NOT NULL,
  `drop_off` varchar(255) NOT NULL,
  `beginning` int(255) NOT NULL,
  `ending` int(255) NOT NULL,
  `time_out` time NOT NULL,
  `time_in` time NOT NULL,
  `date_finished` date NOT NULL,
  `rfid_balance` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`finished_id`),
  KEY `finished_ticket_booking_id` (`ticket_id`),
  CONSTRAINT `finished_ticket_booking_id` FOREIGN KEY (`ticket_id`) REFERENCES `BookingTable` (`ticket_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FinishedTicket`
--

LOCK TABLES `FinishedTicket` WRITE;
/*!40000 ALTER TABLE `FinishedTicket` DISABLE KEYS */;
INSERT INTO `FinishedTicket` VALUES (29,55,'amkor','amkor p3',123,321,'19:28:00','07:28:00','2026-07-23',100,10,9,8),(30,56,'Amkor Coop','18th Street Pacita San Pedro Laguna',159,167,'13:26:00','12:00:00','2026-07-24',65,8,5,8),(31,56,'18th Street Pacita San Pedro Laguna','Amkor P3 Santa Rosa',167,173,'02:26:00','13:26:00','2026-07-24',65,8,5,8),(32,56,'Amkor P3 Santa Rosa','Sto. Tomas Petron',173,181,'16:14:00','14:26:00','2026-07-24',40,8,5,8),(33,56,'Sto. Tomas Petron','Amkor Coop',181,192,'17:19:00','16:16:00','2026-07-24',150,8,5,8),(34,57,'Amkor Coop P1 Cupang Muntinlupa','Amkor P3, Techno Park Santa Rosa',20,29,'13:18:00','13:17:00','2026-07-24',0,11,5,8),(37,59,'Mabuhay Carmona Cavite','University of Perpetual Help System Laguna',9123,9127,'16:49:00','16:48:00','2026-07-26',17,12,9,8),(38,59,'University of Perpetual Help System Laguna','18th Street Pacita San Pedro Laguna',9127,91232,'17:53:00','16:52:00','2026-07-26',17,12,9,8);
/*!40000 ALTER TABLE `FinishedTicket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PassengerTable`
--

DROP TABLE IF EXISTS `PassengerTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PassengerTable` (
  `passsenger_id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `passengers` varchar(255) NOT NULL,
  PRIMARY KEY (`passsenger_id`),
  KEY `fk_ticket` (`ticket_id`),
  CONSTRAINT `fk_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `BookingTable` (`ticket_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PassengerTable`
--

LOCK TABLES `PassengerTable` WRITE;
/*!40000 ALTER TABLE `PassengerTable` DISABLE KEYS */;
INSERT INTO `PassengerTable` VALUES (39,53,'Carl'),(40,53,'Kenneth'),(42,55,'ate vicky'),(43,56,'Carl Hernandez'),(44,56,'Paule Kenneth Dela Rosa'),(45,56,'Sir Noelle'),(46,56,'Maam Lyka'),(47,56,'Eliseo Patiño'),(48,59,'Mchail'),(49,59,'Auxi'),(50,60,'kenneth'),(51,60,'marianne');
/*!40000 ALTER TABLE `PassengerTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTable`
--

DROP TABLE IF EXISTS `UserTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserTable` (
  `user_id` int(255) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `account_type` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `picture` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTable`
--

LOCK TABLES `UserTable` WRITE;
/*!40000 ALTER TABLE `UserTable` DISABLE KEYS */;
INSERT INTO `UserTable` VALUES (8,'Kennetha','sample','User','paulekennethd@outlook.com','uploads/1784596029_2x2 (2).jpeg','Active'),(9,'admin','admin123','Admin','paulekennethd@gmail.com','uploads/1784597359_Avanza.jpeg','Active'),(10,'Bugoy','sample','User','carl@gmail.com','uploads/1784613300_brent.jpeg','Disabled');
/*!40000 ALTER TABLE `UserTable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VehicleTable`
--

DROP TABLE IF EXISTS `VehicleTable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `VehicleTable` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `vehicle_model` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `platenumber` varchar(255) NOT NULL,
  `expiration` date NOT NULL,
  `orcr` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `seater` int(15) NOT NULL,
  `rfid_balance` int(11) NOT NULL,
  `availability` tinyint(1) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VehicleTable`
--

LOCK TABLES `VehicleTable` WRITE;
/*!40000 ALTER TABLE `VehicleTable` DISABLE KEYS */;
INSERT INTO `VehicleTable` VALUES (7,'L300','white','DAU0192','2026-07-22','uploadsVehicle/orcr/1783990192_orcr_OrcrSample.jpeg','uploadsVehicle/vehicle/1783990192_vehicle_l300.png',17,300,1,'Enabled'),(8,'Land Cruiser 2024','white','YAU0591','2026-07-27','uploadsVehicle/orcr/1783990387_orcr_OrcrSample.jpeg','uploadsVehicle/vehicle/1783990387_vehicle_landcruiser.webp',7,5000,1,'Enabled'),(9,'Mirage G4 2022','gray','LOA0182','2026-07-11','uploadsVehicle/orcr/1783990478_orcr_OrcrSample.jpeg','uploadsVehicle/vehicle/1783990478_vehicle_mirage.png',5,450,1,'Enabled'),(10,'PCX 160','white','BLB2360','2026-07-11','uploadsVehicle/orcr/1783990651_orcr_OrcrSample.jpeg','uploadsVehicle/vehicle/1783990651_vehicle_pcx.png',2,5000,1,'Enabled'),(11,'Avanza 2018','red','DAH4045','2026-07-17','uploadsVehicle/orcr/1783990895_orcr_OrcrSample.jpeg','uploadsVehicle/vehicle/1783990895_vehicle_avanza.png',7,5000,1,'Enabled'),(12,'Fortuner','white','OAJ0127','2026-08-07','uploadsVehicle/orcr/1783991052_orcr_OrcrSample.jpeg','uploadsVehicle/vehicle/1783991052_vehicle_fortuner.png',7,5000,0,'Enabled'),(15,'Giornno','yellow','DAU0192','2026-07-31','uploadsVehicle/orcr/1784609499_orcr_1002975734-photo-u1301059271.jpeg','uploadsVehicle/vehicle/1784609499_vehicle_avatars-wYh8k7gY5DWXRu7K-v9XKEQ-t240x240.jpg',2,5000,0,'Enabled');
/*!40000 ALTER TABLE `VehicleTable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-28  8:42:47
