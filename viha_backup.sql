-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: viha
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client_accounts`
--

DROP TABLE IF EXISTS `client_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `client_accounts_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_accounts`
--

LOCK TABLES `client_accounts` WRITE;
/*!40000 ALTER TABLE `client_accounts` DISABLE KEYS */;
INSERT INTO `client_accounts` VALUES (12,13,'naren','25487565987','2026-01-06 10:41:03'),(13,13,'naren','69856564984','2026-01-06 10:41:03');
/*!40000 ALTER TABLE `client_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (6,'sanjiv','98798456485456','2025-12-26 06:18:27'),(8,'vishnu','6381738061','2025-12-29 06:00:51'),(9,'Jem karthik','8952487952','2025-12-29 11:01:59'),(13,'naren','18978528545','2026-01-06 10:40:53');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dinear`
--

DROP TABLE IF EXISTS `dinear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dinear` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `value1` decimal(10,2) DEFAULT NULL,
  `value2` decimal(10,2) DEFAULT NULL,
  `value3` decimal(10,2) DEFAULT NULL,
  `dinear` decimal(10,2) DEFAULT NULL,
  `varavu` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dinear`
--

LOCK TABLES `dinear` WRITE;
/*!40000 ALTER TABLE `dinear` DISABLE KEYS */;
INSERT INTO `dinear` VALUES (14,'2025-12-26',6,2123.00,12231.00,11313.00,41.02,6661106.00),(15,'2026-01-02',7,23.00,23.00,23.00,23.00,24.00);
/*!40000 ALTER TABLE `dinear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_entries`
--

DROP TABLE IF EXISTS `material_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entry_date` date DEFAULT NULL,
  `customer_id` int NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `material` text NOT NULL,
  `pattru` int DEFAULT '0',
  `varavu` int DEFAULT '0',
  `kattai` int DEFAULT '0',
  `saree_count` int DEFAULT '0',
  `coolie_per_saree` int DEFAULT '0',
  `total_coolie` int DEFAULT '0',
  `pay_salary` tinyint(1) DEFAULT '0',
  `salary_paid` int DEFAULT '0',
  `bakki_amount` int DEFAULT '0',
  `owner_account_number` varchar(50) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_entries`
--

LOCK TABLES `material_entries` WRITE;
/*!40000 ALTER TABLE `material_entries` DISABLE KEYS */;
INSERT INTO `material_entries` VALUES (12,'2026-01-03',7,'naren','svd',7800,800,20,4,1400,5600,0,0,0,NULL,NULL,NULL,'2026-01-02 12:58:02'),(18,'2026-01-03',7,'naren','grrbt ',1000,0,25,5,1400,7000,0,0,2800,NULL,NULL,NULL,'2026-01-03 06:08:56'),(24,'2026-01-03',7,'naren','cvb ',0,0,0,0,0,0,0,200,1400,NULL,'45465425456',NULL,'2026-01-03 12:22:48'),(43,'2026-01-05',7,'naren','',0,0,0,0,0,0,0,0,2600,NULL,'45465425456','/uploads/1767598220965.jpg','2026-01-05 07:30:21'),(49,'2026-01-05',7,'naren','',0,0,0,0,0,0,1,100,2500,NULL,'45465425456',NULL,'2026-01-05 12:50:37'),(51,'2026-01-05',8,'vishnu','bgfgbgb ',5000,0,45,9,1400,12600,0,0,0,NULL,'564897214',NULL,'2026-01-05 13:06:54'),(59,'2026-01-06',10,'naren','',0,0,0,0,0,0,1,100,-100,NULL,'32515641145',NULL,'2026-01-06 06:36:10'),(60,'2026-01-06',7,'naren','',0,0,0,0,0,0,1,100,2400,NULL,NULL,NULL,'2026-01-06 07:05:50'),(61,'2026-01-06',7,'naren','',0,0,0,0,0,0,1,100,2300,NULL,'265498456',NULL,'2026-01-06 07:19:11'),(62,'2026-01-06',7,'naren','',0,0,0,0,0,0,1,100,2200,NULL,'56649856',NULL,'2026-01-06 07:19:36'),(63,'2026-01-06',8,'vishnu','',0,0,0,0,0,0,0,0,1400,NULL,NULL,NULL,'2026-01-06 07:20:22');
/*!40000 ALTER TABLE `material_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_entry_images`
--

DROP TABLE IF EXISTS `material_entry_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_entry_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entry_id` int NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_entry` (`entry_id`),
  CONSTRAINT `fk_entry` FOREIGN KEY (`entry_id`) REFERENCES `material_entries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_entry_images`
--

LOCK TABLES `material_entry_images` WRITE;
/*!40000 ALTER TABLE `material_entry_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_entry_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owner_accounts`
--

DROP TABLE IF EXISTS `owner_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `holderName` varchar(255) NOT NULL,
  `accountNumber` varchar(50) NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owner_accounts`
--

LOCK TABLES `owner_accounts` WRITE;
/*!40000 ALTER TABLE `owner_accounts` DISABLE KEYS */;
INSERT INTO `owner_accounts` VALUES (5,'viva','789654215','KYB','2026-01-03 12:09:03','2026-01-03 12:09:03'),(6,'viva','564564134','HDFC','2026-01-03 12:09:25','2026-01-03 12:09:25'),(7,'viva','564645251','IOB','2026-01-03 12:09:45','2026-01-03 12:09:45'),(8,'viva','312341234','b','2026-01-06 10:32:23','2026-01-06 10:32:23');
/*!40000 ALTER TABLE `owner_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productions`
--

DROP TABLE IF EXISTS `productions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entry_date` date NOT NULL,
  `customer_id` int NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `material` text NOT NULL,
  `pattru` int DEFAULT '0',
  `varavu` int DEFAULT '0',
  `kattai` int DEFAULT '0',
  `saree_count` int DEFAULT '0',
  `coolie_per_saree` int DEFAULT '0',
  `total_coolie` int DEFAULT '0',
  `pay_salary` tinyint(1) DEFAULT '0',
  `salary_paid` int DEFAULT '0',
  `bakki_amount` int DEFAULT '0',
  `account_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productions`
--

LOCK TABLES `productions` WRITE;
/*!40000 ALTER TABLE `productions` DISABLE KEYS */;
/*!40000 ALTER TABLE `productions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_code` varchar(50) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `description` text,
  `color_code` varchar(50) DEFAULT NULL,
  `quantity` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_code` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'13255456','saree','ebgnbn','356568','30','2025-12-16 06:42:33'),(3,'2745','cotton','bsnm','2315','0','2025-12-16 06:48:20'),(4,'256156','silkk','fdnhgkm','564564','20','2025-12-16 10:51:51'),(5,'001','jari','asdf','001','10','2025-12-17 06:11:54');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-06 16:45:33
