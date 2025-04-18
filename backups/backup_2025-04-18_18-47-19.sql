-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_nt
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB-log

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
-- Table structure for table `anuncio`
--

DROP TABLE IF EXISTS `anuncio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `anuncio` (
  `ID_Anuncio` int(10) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(255) DEFAULT NULL,
  `Descricao` varchar(255) DEFAULT NULL,
  `Preco` decimal(6,2) DEFAULT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  `AprovacaoID_aprovacao` int(10) NOT NULL,
  `Tipo_ItemID_Tipo` int(10) NOT NULL,
  `CategoriaID_Categoria` int(11) NOT NULL,
  `Status_AnuncioID_Status_Anuncio` int(11) NOT NULL,
  PRIMARY KEY (`ID_Anuncio`),
  KEY `FKAnuncio623345` (`UtilizadorID_User`),
  KEY `FKAnuncio107882` (`AprovacaoID_aprovacao`),
  KEY `FKAnuncio47220` (`Tipo_ItemID_Tipo`),
  KEY `FKAnuncio617781` (`CategoriaID_Categoria`),
  KEY `FKAnuncio546000` (`Status_AnuncioID_Status_Anuncio`),
  CONSTRAINT `FKAnuncio107882` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`),
  CONSTRAINT `FKAnuncio47220` FOREIGN KEY (`Tipo_ItemID_Tipo`) REFERENCES `tipo_item` (`ID_Tipo`),
  CONSTRAINT `FKAnuncio546000` FOREIGN KEY (`Status_AnuncioID_Status_Anuncio`) REFERENCES `status_anuncio` (`ID_Status_Anuncio`),
  CONSTRAINT `FKAnuncio617781` FOREIGN KEY (`CategoriaID_Categoria`) REFERENCES `categoria` (`ID_Categoria`),
  CONSTRAINT `FKAnuncio623345` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anuncio`
--

LOCK TABLES `anuncio` WRITE;
/*!40000 ALTER TABLE `anuncio` DISABLE KEYS */;
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (1,'teste','teste',100.99,2,19,1,1,1);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (2,'teste2','teste',100.00,2,20,2,2,1);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (3,'portatil','portátil como novo',250.00,2,21,1,1,3);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (4,'bicicleta','como nova',450.00,2,31,1,9,4);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (5,'rato logitech','como novo',30.00,2,32,1,1,3);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (6,'bicicleta','como nova',600.00,2,45,1,9,1);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (7,'airpods','usados duas vezes',75.00,2,47,1,1,4);
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES (8,'apple watch','com algumas marcas de uso',150.00,2,48,1,1,4);
/*!40000 ALTER TABLE `anuncio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aprovacao`
--

DROP TABLE IF EXISTS `aprovacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aprovacao` (
  `ID_aprovacao` int(10) NOT NULL AUTO_INCREMENT,
  `Comentario` varchar(255) DEFAULT NULL,
  `Data_Submissao` timestamp NULL DEFAULT NULL,
  `Data_Aprovacao` timestamp NULL DEFAULT NULL,
  `UtilizadorID_Admin` int(10) NOT NULL,
  `Status_AprovacaoID_Status_Aprovacao` int(11) NOT NULL,
  PRIMARY KEY (`ID_aprovacao`),
  KEY `FKAprovacao495119` (`UtilizadorID_Admin`),
  KEY `FKAprovacao52084` (`Status_AprovacaoID_Status_Aprovacao`),
  CONSTRAINT `FKAprovacao495119` FOREIGN KEY (`UtilizadorID_Admin`) REFERENCES `utilizador` (`ID_User`),
  CONSTRAINT `FKAprovacao52084` FOREIGN KEY (`Status_AprovacaoID_Status_Aprovacao`) REFERENCES `status_aprovacao` (`ID_Status_Aprovacao`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aprovacao`
--

LOCK TABLES `aprovacao` WRITE;
/*!40000 ALTER TABLE `aprovacao` DISABLE KEYS */;
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (1,'Administrador do sistema','2025-04-10 16:49:36','2025-04-14 19:35:20',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (2,'Usuário de teste','2025-04-10 16:49:36','2025-04-14 19:35:24',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (19,'','2025-04-10 22:49:54','2025-04-15 14:07:22',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (20,'','2025-04-10 23:19:45','2025-04-15 14:05:20',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (21,'','2025-04-10 23:24:39','2025-04-15 14:07:10',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (22,NULL,NULL,'2025-04-14 19:35:27',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (23,NULL,NULL,NULL,1,1);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (24,'Nao quero fêmeas aqui.','2025-04-14 19:53:56','2025-04-14 19:53:56',1,3);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (25,NULL,NULL,'2025-04-14 20:16:03',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (31,'nao conforme','2025-04-14 21:59:31','2025-04-14 23:13:57',1,3);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (32,NULL,'2025-04-14 22:14:15','2025-04-15 14:07:19',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (45,NULL,'2025-04-15 00:05:17','2025-04-15 16:06:09',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (47,NULL,'2025-04-15 00:18:25','2025-04-15 14:07:13',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (48,NULL,'2025-04-15 00:59:14',NULL,1,1);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (49,NULL,NULL,NULL,1,1);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (50,NULL,NULL,'2025-04-15 17:57:28',1,2);
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES (51,'nao conforme','2025-04-15 17:57:37','2025-04-15 17:57:37',1,3);
/*!40000 ALTER TABLE `aprovacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avaliacao` (
  `Id_Avaliacao` int(10) NOT NULL AUTO_INCREMENT,
  `Comentario` varchar(255) DEFAULT NULL,
  `Data_Avaliacao` timestamp NULL DEFAULT NULL,
  `NotaID_Nota` int(10) NOT NULL,
  `OrdemID_Produto` int(10) NOT NULL,
  `AprovacaoID_aprovacao` int(10) NOT NULL,
  PRIMARY KEY (`Id_Avaliacao`),
  KEY `FKAvaliacao214094` (`NotaID_Nota`),
  KEY `FKAvaliacao460566` (`AprovacaoID_aprovacao`),
  KEY `FKAvaliacao286296` (`OrdemID_Produto`),
  CONSTRAINT `FKAvaliacao214094` FOREIGN KEY (`NotaID_Nota`) REFERENCES `nota` (`ID_Nota`),
  CONSTRAINT `FKAvaliacao286296` FOREIGN KEY (`OrdemID_Produto`) REFERENCES `compra` (`ID_Compra`),
  CONSTRAINT `FKAvaliacao460566` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartao`
--

DROP TABLE IF EXISTS `cartao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cartao` (
  `ID_Cartao` int(10) NOT NULL AUTO_INCREMENT,
  `Numero` varchar(16) NOT NULL,
  `CVC` int(11) NOT NULL,
  `Data` date NOT NULL,
  PRIMARY KEY (`ID_Cartao`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartao`
--

LOCK TABLES `cartao` WRITE;
/*!40000 ALTER TABLE `cartao` DISABLE KEYS */;
INSERT INTO `cartao` (`ID_Cartao`, `Numero`, `CVC`, `Data`) VALUES (2,'1000200030004000',0,'2025-04-30');
INSERT INTO `cartao` (`ID_Cartao`, `Numero`, `CVC`, `Data`) VALUES (3,'1234123412341234',111,'2025-05-01');
INSERT INTO `cartao` (`ID_Cartao`, `Numero`, `CVC`, `Data`) VALUES (4,'3000400050006000',0,'2025-05-14');
INSERT INTO `cartao` (`ID_Cartao`, `Numero`, `CVC`, `Data`) VALUES (5,'0000111122223333',111,'2025-05-01');
/*!40000 ALTER TABLE `cartao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria` (
  `ID_Categoria` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao_Categoria` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (1,'Informática');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (2,'Móveis');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (3,'Roupas');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (4,'Livros');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (5,'Brinquedos');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (6,'Ferramentas');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (7,'Veículos');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (8,'Imóveis');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (9,'Desporto');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES (10,'Outros');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra`
--

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compra` (
  `ID_Compra` int(10) NOT NULL AUTO_INCREMENT,
  `Data` timestamp NULL DEFAULT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  `AnuncioID_Anuncio` int(10) NOT NULL,
  PRIMARY KEY (`ID_Compra`),
  KEY `FKCompra155813` (`UtilizadorID_User`),
  KEY `FKCompra629584` (`AnuncioID_Anuncio`),
  CONSTRAINT `FKCompra155813` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`),
  CONSTRAINT `FKCompra629584` FOREIGN KEY (`AnuncioID_Anuncio`) REFERENCES `anuncio` (`ID_Anuncio`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra`
--

LOCK TABLES `compra` WRITE;
/*!40000 ALTER TABLE `compra` DISABLE KEYS */;
INSERT INTO `compra` (`ID_Compra`, `Data`, `UtilizadorID_User`, `AnuncioID_Anuncio`) VALUES (3,'2025-04-16 22:44:27',3,5);
INSERT INTO `compra` (`ID_Compra`, `Data`, `UtilizadorID_User`, `AnuncioID_Anuncio`) VALUES (8,'2025-04-18 14:01:43',3,3);
/*!40000 ALTER TABLE `compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compra_reclamacao`
--

DROP TABLE IF EXISTS `compra_reclamacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compra_reclamacao` (
  `CompraID_Compra` int(10) NOT NULL,
  `ReclamacaoID_Reclamacao` int(11) NOT NULL,
  PRIMARY KEY (`CompraID_Compra`,`ReclamacaoID_Reclamacao`),
  KEY `FKCompra_Rec211866` (`ReclamacaoID_Reclamacao`),
  CONSTRAINT `FKCompra_Rec211866` FOREIGN KEY (`ReclamacaoID_Reclamacao`) REFERENCES `reclamacao` (`ID_Reclamacao`),
  CONSTRAINT `FKCompra_Rec509146` FOREIGN KEY (`CompraID_Compra`) REFERENCES `compra` (`ID_Compra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compra_reclamacao`
--

LOCK TABLES `compra_reclamacao` WRITE;
/*!40000 ALTER TABLE `compra_reclamacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `compra_reclamacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagem`
--

DROP TABLE IF EXISTS `imagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `imagem` (
  `ID_Imagem` int(11) NOT NULL AUTO_INCREMENT,
  `Caminho` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Imagem`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagem`
--

LOCK TABLES `imagem` WRITE;
/*!40000 ALTER TABLE `imagem` DISABLE KEYS */;
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (1,'public/perfil/default.png');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (2,'anuncios/1744330785_0_transferir.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (3,'anuncios/1744331079_0_transferir.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (4,'comprovativos/pdfs/user_3_20250414201839.pdf');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (5,'comprovativos/pdfs/user_4_20250414203244.pdf');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (6,'comprovativos/pdfs/user_5_20250414205617.pdf');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (7,'anuncios/4/67fd9354951ec_0.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (8,'anuncios/4/67fd93549764c_1.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (9,'anuncios/4/67fd935498f0f_2.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (10,'anuncios/4/67fd93549aad7_3.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (11,'anuncios/5/67fd96c783272_0.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (12,'anuncios/6/67fdb0ceb98a2_0.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (13,'anuncios/6/67fdb0cec4813_1.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (14,'anuncios/6/67fdb0cec58f7_2.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (15,'anuncios/6/67fdb0cec72ba_3.jpg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (16,'anuncios/7/67fdb3e200bfc_0.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (17,'anuncios/8/67fdbd72e3749_0.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (18,'comprovativos/pdfs/user_6_20250415160606.pdf');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES (19,'comprovativos/pdfs/user_7_20250415185650.pdf');
/*!40000 ALTER TABLE `imagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_imagem`
--

DROP TABLE IF EXISTS `item_imagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_imagem` (
  `ItemID_Item` int(10) NOT NULL,
  `ImagemID_Imagem` int(11) NOT NULL,
  PRIMARY KEY (`ItemID_Item`,`ImagemID_Imagem`),
  KEY `FKItem_Image648731` (`ImagemID_Imagem`),
  CONSTRAINT `FKItem_Image234733` FOREIGN KEY (`ItemID_Item`) REFERENCES `anuncio` (`ID_Anuncio`),
  CONSTRAINT `FKItem_Image648731` FOREIGN KEY (`ImagemID_Imagem`) REFERENCES `imagem` (`ID_Imagem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_imagem`
--

LOCK TABLES `item_imagem` WRITE;
/*!40000 ALTER TABLE `item_imagem` DISABLE KEYS */;
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (2,2);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (3,3);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (4,7);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (4,8);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (4,9);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (4,10);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (5,11);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (6,12);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (6,13);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (6,14);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (6,15);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (7,16);
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES (8,17);
/*!40000 ALTER TABLE `item_imagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (1,'default','{\"uuid\":\"a52caa2c-af71-4407-863a-99cd3a4048b5\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744839725,1744839725);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (2,'default','{\"uuid\":\"ef909682-7233-4ee4-a80c-f6795499380f\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:6;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744839727,1744839727);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (3,'default','{\"uuid\":\"1d584687-f8ef-48e4-9b2e-e246683e6a2c\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744839963,1744839963);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (4,'default','{\"uuid\":\"633188b2-e7e1-4fad-87bd-dd9015f6ef3d\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:8;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744841063,1744841063);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (5,'default','{\"uuid\":\"6d081007-dd0c-434e-96aa-606c06252fa4\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:9;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744841222,1744841222);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (6,'default','{\"uuid\":\"e4f87899-d46d-4605-bf81-08a0d85f90a4\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:10;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744841447,1744841447);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (7,'default','{\"uuid\":\"4d6de967-bf8b-45ca-b242-0b6e1e57ed4d\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:11;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744841836,1744841836);
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (8,'default','{\"uuid\":\"3d54ac98-89ec-4910-8149-572becdd07a5\",\"displayName\":\"App\\\\Events\\\\MensagemEnviada\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:26:\\\"App\\\\Events\\\\MensagemEnviada\\\":1:{s:8:\\\"mensagem\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:19:\\\"App\\\\Models\\\\Mensagem\\\";s:2:\\\"id\\\";i:12;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}',0,NULL,1744841938,1744841938);
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagem`
--

DROP TABLE IF EXISTS `mensagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensagem` (
  `ID_Mensagem` int(10) NOT NULL AUTO_INCREMENT,
  `Conteudo` varchar(255) DEFAULT NULL,
  `Data_mensagem` timestamp NULL DEFAULT NULL,
  `ItemID_Item` int(10) NOT NULL,
  `Status_MensagemID_Status_Mensagem` int(10) NOT NULL,
  PRIMARY KEY (`ID_Mensagem`),
  KEY `FKMensagem481071` (`Status_MensagemID_Status_Mensagem`),
  KEY `FKMensagem252913` (`ItemID_Item`),
  CONSTRAINT `FKMensagem252913` FOREIGN KEY (`ItemID_Item`) REFERENCES `anuncio` (`ID_Anuncio`),
  CONSTRAINT `FKMensagem481071` FOREIGN KEY (`Status_MensagemID_Status_Mensagem`) REFERENCES `status_mensagem` (`ID_Status_Mensagem`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagem`
--

LOCK TABLES `mensagem` WRITE;
/*!40000 ALTER TABLE `mensagem` DISABLE KEYS */;
INSERT INTO `mensagem` (`ID_Mensagem`, `Conteudo`, `Data_mensagem`, `ItemID_Item`, `Status_MensagemID_Status_Mensagem`) VALUES (8,'disponivel?','2025-04-16 21:04:22',5,2);
INSERT INTO `mensagem` (`ID_Mensagem`, `Conteudo`, `Data_mensagem`, `ItemID_Item`, `Status_MensagemID_Status_Mensagem`) VALUES (9,'25 euros','2025-04-16 21:07:02',5,2);
INSERT INTO `mensagem` (`ID_Mensagem`, `Conteudo`, `Data_mensagem`, `ItemID_Item`, `Status_MensagemID_Status_Mensagem`) VALUES (10,'disponivel?','2025-04-16 21:10:47',5,2);
INSERT INTO `mensagem` (`ID_Mensagem`, `Conteudo`, `Data_mensagem`, `ItemID_Item`, `Status_MensagemID_Status_Mensagem`) VALUES (11,'nao','2025-04-16 21:17:16',5,2);
INSERT INTO `mensagem` (`ID_Mensagem`, `Conteudo`, `Data_mensagem`, `ItemID_Item`, `Status_MensagemID_Status_Mensagem`) VALUES (12,'mas  posso vender por 20 euros','2025-04-16 21:18:58',5,2);
/*!40000 ALTER TABLE `mensagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagem_utilizador`
--

DROP TABLE IF EXISTS `mensagem_utilizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensagem_utilizador` (
  `MensagemID_Mensagem` int(10) NOT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  PRIMARY KEY (`MensagemID_Mensagem`,`UtilizadorID_User`),
  KEY `FKMensagem_U307261` (`UtilizadorID_User`),
  CONSTRAINT `FKMensagem_U307261` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`),
  CONSTRAINT `FKMensagem_U481429` FOREIGN KEY (`MensagemID_Mensagem`) REFERENCES `mensagem` (`ID_Mensagem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagem_utilizador`
--

LOCK TABLES `mensagem_utilizador` WRITE;
/*!40000 ALTER TABLE `mensagem_utilizador` DISABLE KEYS */;
INSERT INTO `mensagem_utilizador` (`MensagemID_Mensagem`, `UtilizadorID_User`) VALUES (8,3);
INSERT INTO `mensagem_utilizador` (`MensagemID_Mensagem`, `UtilizadorID_User`) VALUES (9,3);
INSERT INTO `mensagem_utilizador` (`MensagemID_Mensagem`, `UtilizadorID_User`) VALUES (10,3);
INSERT INTO `mensagem_utilizador` (`MensagemID_Mensagem`, `UtilizadorID_User`) VALUES (11,2);
INSERT INTO `mensagem_utilizador` (`MensagemID_Mensagem`, `UtilizadorID_User`) VALUES (12,2);
/*!40000 ALTER TABLE `mensagem_utilizador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4,'2025_04_10_212110_create_personal_access_tokens_table',2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5,'2024_04_16_alter_cartao_numero_type',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `morada`
--

DROP TABLE IF EXISTS `morada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `morada` (
  `ID_Morada` int(10) NOT NULL AUTO_INCREMENT,
  `Rua` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Morada`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `morada`
--

LOCK TABLES `morada` WRITE;
/*!40000 ALTER TABLE `morada` DISABLE KEYS */;
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (1,'Rua de Exemplo, 123');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (2,'Rua das Flores, nº 123');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (3,'Avenida Central, nº 456');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (4,'Travessa do Comércio, nº 789');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (5,'Rua do Sol, nº 101');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (6,'Avenida dos Pioneiros, nº 55');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (7,'Rua da Esperança, nº 99');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (8,'Rua do Mercado, nº 12');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (9,'Rua Bela Vista, nº 222');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (10,'Avenida das Amoreiras, nº 80');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (11,'Rua do Pinhal, nº 35');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (12,'Rua São Jorge, nº 61');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (13,'Travessa da Liberdade, nº 7');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (14,'Avenida das Laranjeiras, nº 300');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (15,'Rua da Juventude, nº 44');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (16,'Rua das Oliveiras, nº 88');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (17,'Rua Padre António Vieira, nº 19');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (18,'Rua do Carmo, nº 250');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (19,'Avenida Atlântica, nº 321');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (20,'Travessa dos Navegantes, nº 5');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (21,'Rua João XXI, nº 65');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (22,'Rua Nova da Estação, nº 110');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (23,'Rua da Paz, nº 18');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (24,'Avenida Beira-Mar, nº 70');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (25,'Rua das Pedras, nº 140');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (26,'Travessa São Francisco, nº 30');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (27,'Rua do Ferro Velho, nº 3');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (28,'Rua dos Lavradores, nº 20');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (29,'Avenida dos Descobrimentos, nº 400');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (30,'Rua Dom Afonso Henriques, nº 77');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (31,'Rua 1º de Maio, nº 88');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES (32,'Rua do Campo Alegre, nº 212');
/*!40000 ALTER TABLE `morada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nota`
--

DROP TABLE IF EXISTS `nota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nota` (
  `ID_Nota` int(10) NOT NULL AUTO_INCREMENT,
  `Descricao_nota` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Nota`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nota`
--

LOCK TABLES `nota` WRITE;
/*!40000 ALTER TABLE `nota` DISABLE KEYS */;
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES (1,'1 Estrela');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES (2,'2 Estrelas');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES (3,'3 Estrelas');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES (4,'4 Estrelas');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES (5,'5 Estrelas');
/*!40000 ALTER TABLE `nota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacao`
--

DROP TABLE IF EXISTS `notificacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificacao` (
  `ID_Notificacao` int(11) NOT NULL AUTO_INCREMENT,
  `Mensagem` varchar(255) DEFAULT NULL,
  `DataNotificacao` timestamp NULL DEFAULT NULL,
  `ReferenciaID` int(11) DEFAULT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  `ReferenciaTipoID_ReferenciaTipo` int(11) NOT NULL,
  `TIpo_notificacaoID_TipoNotificacao` int(11) NOT NULL,
  PRIMARY KEY (`ID_Notificacao`),
  KEY `FKNotificaca913403` (`UtilizadorID_User`),
  KEY `FKNotificaca154395` (`ReferenciaTipoID_ReferenciaTipo`),
  KEY `FKNotificaca714377` (`TIpo_notificacaoID_TipoNotificacao`),
  CONSTRAINT `FKNotificaca154395` FOREIGN KEY (`ReferenciaTipoID_ReferenciaTipo`) REFERENCES `referenciatipo` (`ID_ReferenciaTipo`),
  CONSTRAINT `FKNotificaca714377` FOREIGN KEY (`TIpo_notificacaoID_TipoNotificacao`) REFERENCES `tipo_notificacao` (`ID_TipoNotificacao`),
  CONSTRAINT `FKNotificaca913403` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacao`
--

LOCK TABLES `notificacao` WRITE;
/*!40000 ALTER TABLE `notificacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamento`
--

DROP TABLE IF EXISTS `pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagamento` (
  `ID_Pagamento` int(11) NOT NULL AUTO_INCREMENT,
  `Valor` int(11) DEFAULT NULL,
  `Data` date DEFAULT NULL,
  `CompraID_Compra` int(10) NOT NULL,
  PRIMARY KEY (`ID_Pagamento`),
  KEY `FKPagamento115243` (`CompraID_Compra`),
  CONSTRAINT `FKPagamento115243` FOREIGN KEY (`CompraID_Compra`) REFERENCES `compra` (`ID_Compra`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento`
--

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
INSERT INTO `pagamento` (`ID_Pagamento`, `Valor`, `Data`, `CompraID_Compra`) VALUES (1,25000,'2025-04-18',8);
/*!40000 ALTER TABLE `pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (1,'App\\Models\\Utilizador',1,'auth-token','bbb9f12a54845688425b8f4eb67643b5e2565abf776ef169761b06c1da0b711d','[\"*\"]',NULL,NULL,'2025-04-10 20:32:11','2025-04-10 20:32:11');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (2,'App\\Models\\Utilizador',1,'auth-token','27c1cf58ca49c8486b3fe57912bdd75910a5a342b71bd85212b6f6d3a9764fce','[\"*\"]',NULL,NULL,'2025-04-10 20:33:37','2025-04-10 20:33:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (3,'App\\Models\\Utilizador',1,'auth-token','333db854dacc9c78c41462688b9d5e9edc4d575499b7d654616338cea1878b23','[\"*\"]',NULL,NULL,'2025-04-10 20:57:56','2025-04-10 20:57:56');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (4,'App\\Models\\Utilizador',1,'auth-token','7844cfc8e411b74b4b8996c112d631a1a7693ecd48b57d299cf2096ce9045486','[\"*\"]',NULL,NULL,'2025-04-10 21:00:32','2025-04-10 21:00:32');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (5,'App\\Models\\Utilizador',1,'auth-token','44f61d8822445e7799a8b57c77f278bcc3da9e6e9403275543f0c2abbd487395','[\"*\"]','2025-04-10 21:01:04',NULL,'2025-04-10 21:01:03','2025-04-10 21:01:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (6,'App\\Models\\Utilizador',2,'auth-token','8859078cd6c1cca5831cac22254ed94b061c9c4427c70241d0519c19d1e158b4','[\"*\"]','2025-04-10 21:45:21',NULL,'2025-04-10 21:02:07','2025-04-10 21:45:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (7,'App\\Models\\Utilizador',2,'auth-token','cfbf794a551068d4f414a921aa39ab471724ea13fb1b0fae7693f5f52b9b9db7','[\"*\"]','2025-04-10 22:40:52',NULL,'2025-04-10 21:46:03','2025-04-10 22:40:52');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (8,'App\\Models\\Utilizador',1,'auth-token','470f296d346f253d94e2ecfdac158105f33aa1a00c5a36be80d0e15c83f9a630','[\"*\"]','2025-04-10 22:44:33',NULL,'2025-04-10 22:41:27','2025-04-10 22:44:33');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (9,'App\\Models\\Utilizador',2,'auth-token','e138998f036a27c953091f54211676df0d43dc2385588ded735e5fb7bdbfc9c3','[\"*\"]',NULL,NULL,'2025-04-10 22:44:54','2025-04-10 22:44:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (10,'App\\Models\\Utilizador',2,'auth-token','23bd49bb402bc457c7d4354a75ad5765abf52105629207afdb22ffdb07dc1415','[\"*\"]','2025-04-10 22:57:33',NULL,'2025-04-10 22:46:08','2025-04-10 22:57:33');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (11,'App\\Models\\Utilizador',2,'auth-token','a3f8235edffc969bba8b6c439d8bb609e06139e24be5d9f78860112e67dd0a97','[\"*\"]','2025-04-10 23:01:08',NULL,'2025-04-10 22:49:36','2025-04-10 23:01:08');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (12,'App\\Models\\Utilizador',1,'auth-token','38950e289e767cb57fd4969682ae6a9f9f20dd9ab7365ef5cf0b5cf7eb330730','[\"*\"]',NULL,NULL,'2025-04-10 22:58:13','2025-04-10 22:58:13');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (13,'App\\Models\\Utilizador',1,'auth-token','6856533b2109c38f26ffbb9316ace3a8d9bb75a1360c29587183ff2d385a72fb','[\"*\"]','2025-04-10 23:05:40',NULL,'2025-04-10 22:58:32','2025-04-10 23:05:40');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (14,'App\\Models\\Utilizador',1,'auth-token','12c89d458b7cace497cad8a781237cec3232fdd619efec656ed54ca6645ca1fd','[\"*\"]','2025-04-10 23:01:24',NULL,'2025-04-10 23:01:23','2025-04-10 23:01:24');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (15,'App\\Models\\Utilizador',1,'auth-token','8e660e64e7b55cb3effeb8d61fa08cdbe1ca32365cd151436664c90b712c9673','[\"*\"]','2025-04-10 23:06:35',NULL,'2025-04-10 23:05:58','2025-04-10 23:06:35');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (16,'App\\Models\\Utilizador',2,'auth-token','78b7ec6497f10f1600c8c5b50729b5b82b19c6e99408540acb0066ca140fbd8d','[\"*\"]','2025-04-10 23:06:55',NULL,'2025-04-10 23:06:54','2025-04-10 23:06:55');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (17,'App\\Models\\Utilizador',1,'auth-token','d934ebee24b10966af3be27efc2c3a48999b8898f95d71c8c6682ef8e3b719c2','[\"*\"]',NULL,NULL,'2025-04-10 23:07:49','2025-04-10 23:07:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (18,'App\\Models\\Utilizador',2,'auth-token','df0a5c3336d0a755a6281ed2d14729122befe2bb022379f809840c537ea8c040','[\"*\"]','2025-04-10 23:19:51',NULL,'2025-04-10 23:16:14','2025-04-10 23:19:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (19,'App\\Models\\Utilizador',1,'auth-token','85ba7a01dc29332dfeb0eb56cf34db4cd8fe15836dad651cd749055bfe2eac64','[\"*\"]','2025-04-10 23:20:51',NULL,'2025-04-10 23:20:08','2025-04-10 23:20:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (20,'App\\Models\\Utilizador',2,'auth-token','7c84ca4ee8fa99e8e832b274d77b23600fa1b46ee526deda51d5b807e258d499','[\"*\"]','2025-04-10 23:21:18',NULL,'2025-04-10 23:21:03','2025-04-10 23:21:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (21,'App\\Models\\Utilizador',2,'auth-token','a88cac8cbae18fc5855ff0403785baf08f38465a8cb8c5041bce7904ff329ff9','[\"*\"]','2025-04-10 23:22:22',NULL,'2025-04-10 23:22:21','2025-04-10 23:22:22');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (22,'App\\Models\\Utilizador',2,'auth-token','3d1894582146f7f0628a7d0a05988384d63429d02128e57888a318187cfda5cd','[\"*\"]',NULL,NULL,'2025-04-10 23:23:42','2025-04-10 23:23:42');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (23,'App\\Models\\Utilizador',2,'auth-token','7ebc2e287cefa7b1d7e416ad467e59ab4756757a21c7ed4b61ff2a1abed0b830','[\"*\"]','2025-04-10 23:24:39',NULL,'2025-04-10 23:23:57','2025-04-10 23:24:39');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (24,'App\\Models\\Utilizador',1,'auth-token','deff5ad86deb124abcb725f8b8d79d250be789a129233c4a89c517d336f831d1','[\"*\"]','2025-04-10 23:26:27',NULL,'2025-04-10 23:25:19','2025-04-10 23:26:27');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (25,'App\\Models\\Utilizador',2,'auth-token','304c2db781914b5f925b6222e92633977af1eec2dc9ab9d016c115d8c98a0168','[\"*\"]','2025-04-10 23:44:22',NULL,'2025-04-10 23:26:37','2025-04-10 23:44:22');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (26,'App\\Models\\Utilizador',2,'auth-token','a61e12774ecad1d00c5ef7893ce759e2b11bcc3bd2e951c9e8b28e17eef3fc5d','[\"*\"]','2025-04-10 23:32:59',NULL,'2025-04-10 23:32:14','2025-04-10 23:32:59');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (27,'App\\Models\\Utilizador',2,'auth-token','2ea02497f98290f7b663b1e45c51a1eaf839cf978368af4214d62f6e75ebc10b','[\"*\"]',NULL,NULL,'2025-04-10 23:44:41','2025-04-10 23:44:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (28,'App\\Models\\Utilizador',2,'auth-token','cc3e37b4f8089ebaf4e8b1d83e499f908841ada36978617886d5609b35e4cbb5','[\"*\"]','2025-04-10 23:44:54',NULL,'2025-04-10 23:44:53','2025-04-10 23:44:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (29,'App\\Models\\Utilizador',2,'auth-token','8a219b18867d4605bbe5eafa4ac26d0d86208472fb842ec4c613f3934ec75b1b','[\"*\"]',NULL,NULL,'2025-04-10 23:47:30','2025-04-10 23:47:30');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (30,'App\\Models\\Utilizador',2,'auth-token','9275d79d49d6e5c7f39e99b5a0a2735abedea4d0db754b4107480309117fc11f','[\"*\"]',NULL,NULL,'2025-04-10 23:47:41','2025-04-10 23:47:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (31,'App\\Models\\Utilizador',2,'auth-token','a96ccca96afeb9accd78ed87ef74f52b3fb1973e86a5b4bc6eadb24f349ffaed','[\"*\"]',NULL,NULL,'2025-04-10 23:47:54','2025-04-10 23:47:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (32,'App\\Models\\Utilizador',2,'auth-token','d7177affb6355d4feb4e8ea3f1d1ea70c02e0a2d25cdeb89e961d00bec6d9e38','[\"*\"]','2025-04-14 17:51:51',NULL,'2025-04-13 12:41:14','2025-04-14 17:51:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (33,'App\\Models\\Utilizador',1,'auth-token','3c1d9d0f26f4094934388a14613e6ed6c4b0a8c79416ad3bcbe8b4c21c56b2c6','[\"*\"]','2025-04-14 17:54:00',NULL,'2025-04-14 17:53:57','2025-04-14 17:54:00');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (34,'App\\Models\\Utilizador',1,'auth-token','05c9c3aeebb66ac3a61c66a943d51e5b0b364fa6e3e80622278a5dbdd5f5d6e6','[\"*\"]',NULL,NULL,'2025-04-14 17:54:21','2025-04-14 17:54:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (35,'App\\Models\\Utilizador',1,'auth-token','b7a57d630b6b997f21e415449177ffd2e7e3cef48a6d728d138f8e35841d63a1','[\"*\"]','2025-04-14 17:56:34',NULL,'2025-04-14 17:56:29','2025-04-14 17:56:34');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (36,'App\\Models\\Utilizador',1,'auth-token','732621ff764a5389d664784135dc42158976442576805e514aa74a6549d43e90','[\"*\"]',NULL,NULL,'2025-04-14 17:57:04','2025-04-14 17:57:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (37,'App\\Models\\Utilizador',2,'auth-token','38e1ac044731a04307bdb56afa416c55d5db4dc4b42fa3d30ac74258f075ca1f','[\"*\"]','2025-04-14 17:57:35',NULL,'2025-04-14 17:57:30','2025-04-14 17:57:35');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (38,'App\\Models\\Utilizador',2,'auth-token','ac4ec0701d3a1c88601d58c3c7c77b08df0ff48fcd75fd39f48e1cc82f3bd0f2','[\"*\"]',NULL,NULL,'2025-04-14 17:58:34','2025-04-14 17:58:34');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (39,'App\\Models\\Utilizador',2,'auth-token','8f4edd1e993d97838a74dc96b2373ab483d921512c169476e71116a96f7b1fc8','[\"*\"]',NULL,NULL,'2025-04-14 17:58:48','2025-04-14 17:58:48');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (40,'App\\Models\\Utilizador',1,'auth-token','b2885e41af1cc7ffb4683dd7154ee947c932a1d23d3e35456f07580b66cdfeb0','[\"*\"]','2025-04-14 18:04:51',NULL,'2025-04-14 17:59:38','2025-04-14 18:04:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (41,'App\\Models\\Utilizador',1,'auth-token','b0a7bcd224d291865f9087567172416b24eceacb87694a03f3b9a1d7ecc8e673','[\"*\"]','2025-04-14 18:12:31',NULL,'2025-04-14 18:08:19','2025-04-14 18:12:31');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (42,'App\\Models\\Utilizador',1,'auth-token','c94eac40137e98e04972ec70e1fd0f8b840d24b6cafaa3ef406239b4fce3c176','[\"*\"]',NULL,NULL,'2025-04-14 18:12:49','2025-04-14 18:12:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (43,'App\\Models\\Utilizador',2,'auth-token','960bb2a8518197c4476e6511d707a0023446e300c32e041345bedf813b0f03ec','[\"*\"]','2025-04-14 19:15:28',NULL,'2025-04-14 18:13:15','2025-04-14 19:15:28');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (44,'App\\Models\\Utilizador',1,'auth-token','be7f31aa55e586783cd6d94969a980d75060de5f35674f28e02c7ae1c774de8e','[\"*\"]','2025-04-14 19:16:10',NULL,'2025-04-14 19:16:02','2025-04-14 19:16:10');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (45,'App\\Models\\Utilizador',2,'auth-token','792060ae4151ecaba8ab409a2a39da9aa1b431a0f23645db9c57834cc9a82e40','[\"*\"]','2025-04-14 19:17:04',NULL,'2025-04-14 19:16:44','2025-04-14 19:17:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (46,'App\\Models\\Utilizador',3,'auth-token','cb99bb81d46af9216eef23019f44e169baebcc9bb01c888954c5567da7923119','[\"*\"]','2025-04-14 19:19:16',NULL,'2025-04-14 19:19:12','2025-04-14 19:19:16');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (47,'App\\Models\\Utilizador',3,'auth-token','37e2b56a43c0928bcc589b4d2255c7468fad357202e7e5d9c848558368dd10b8','[\"*\"]','2025-04-14 19:20:09',NULL,'2025-04-14 19:19:56','2025-04-14 19:20:09');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (48,'App\\Models\\Utilizador',1,'auth-token','8500f461a36cae9b56faed9d5fbfafde581f3d08132bc1a0fc9c34575bc11527','[\"*\"]','2025-04-14 19:27:43',NULL,'2025-04-14 19:27:37','2025-04-14 19:27:43');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (49,'App\\Models\\Utilizador',1,'auth-token','5b67f76c7f727a3d59c284f58c0fb7dcdd6563438f5a191401684ae5f571fa0e','[\"*\"]','2025-04-14 19:33:48',NULL,'2025-04-14 19:33:25','2025-04-14 19:33:48');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (50,'App\\Models\\Utilizador',1,'auth-token','5e6b6366e5a87ec54601e9d3f01768f50fcca31909ef8896fe638ce209cdfebe','[\"*\"]','2025-04-14 19:35:37',NULL,'2025-04-14 19:34:08','2025-04-14 19:35:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (51,'App\\Models\\Utilizador',1,'auth-token','fe250efbf6aa81e1adaef1e504def934d7312d78588cbc2d23cf3192f95f39fc','[\"*\"]','2025-04-14 19:36:29',NULL,'2025-04-14 19:36:03','2025-04-14 19:36:29');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (52,'App\\Models\\Utilizador',1,'auth-token','e273761a70c976d2cd13c6cb187c871a7444a7dd35ffd43396c4100a44aedb92','[\"*\"]','2025-04-14 19:55:19',NULL,'2025-04-14 19:37:08','2025-04-14 19:55:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (53,'App\\Models\\Utilizador',1,'auth-token','72a1cd84f22c04aa382193fa3b775192f1c173c9eecd703b69ba3e08eb2c5310','[\"*\"]','2025-04-14 20:08:53',NULL,'2025-04-14 19:56:54','2025-04-14 20:08:53');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (54,'App\\Models\\Utilizador',5,'auth-token','525be813c9b57ced2efc5e08f2f88509fbf4a565d457ab1a67148192eb7829b6','[\"*\"]','2025-04-14 20:09:24',NULL,'2025-04-14 20:09:23','2025-04-14 20:09:24');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (55,'App\\Models\\Utilizador',1,'auth-token','7066694a519efa7d15739bc708c2699359e25cbf103b99290afd87f705a8917c','[\"*\"]','2025-04-14 20:15:04',NULL,'2025-04-14 20:09:59','2025-04-14 20:15:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (56,'App\\Models\\Utilizador',3,'auth-token','f71a93897dd209389826239cd61002431dce7927d3885c1f1f4256efea4391f9','[\"*\"]','2025-04-14 20:15:41',NULL,'2025-04-14 20:15:40','2025-04-14 20:15:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (57,'App\\Models\\Utilizador',1,'auth-token','58165d4a872dbc37a3130691c02d47936101c1c5590647b3f72e91eecdfd2b3e','[\"*\"]','2025-04-14 20:16:03',NULL,'2025-04-14 20:15:57','2025-04-14 20:16:03');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (58,'App\\Models\\Utilizador',5,'auth-token','fc08568a8527c71ce91c9646d5dfd1211844ddde9544494deaff64f958d7ef86','[\"*\"]','2025-04-14 20:18:19',NULL,'2025-04-14 20:16:17','2025-04-14 20:18:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (59,'App\\Models\\Utilizador',1,'auth-token','a1495454f494d50c14d00f3d643fa4770693b6e95a88a8e25ce69b8a2c2b213c','[\"*\"]','2025-04-14 20:19:02',NULL,'2025-04-14 20:18:45','2025-04-14 20:19:02');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (60,'App\\Models\\Utilizador',2,'auth-token','025536179ef897d2f7da07aac6eefdc6d9f0fdf446ce47142f8797146de411db','[\"*\"]','2025-04-14 21:16:29',NULL,'2025-04-14 20:57:45','2025-04-14 21:16:29');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (61,'App\\Models\\Utilizador',2,'auth-token','2d7c1e698a885ef87ca141159afa4166c1dbaa6ef0aa4074155d30a54ed14720','[\"*\"]','2025-04-14 21:59:31',NULL,'2025-04-14 21:56:45','2025-04-14 21:59:31');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (62,'App\\Models\\Utilizador',1,'auth-token','e6f703fff9ca99d93d6e8689bed5ce26e4242e4d33e85fefce7a1aea6a6a2130','[\"*\"]','2025-04-14 22:12:09',NULL,'2025-04-14 21:59:59','2025-04-14 22:12:09');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (63,'App\\Models\\Utilizador',2,'auth-token','ae168fbfc3acfb82153adc8608af859440e89b5c213f47e574eae21f6b940a1a','[\"*\"]','2025-04-14 23:53:06',NULL,'2025-04-14 22:12:49','2025-04-14 23:53:06');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (64,'App\\Models\\Utilizador',1,'auth-token','24562fe38b6d4b259df70a56b022bb3fbcfa97298e7c1bda3f4d4bc0c978f4a5','[\"*\"]','2025-04-14 23:14:21',NULL,'2025-04-14 22:26:15','2025-04-14 23:14:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (65,'App\\Models\\Utilizador',2,'auth-token','a76bf06c925b158c7c641484cd59378a4b6275e5a245556ac02ad045f99a29a7','[\"*\"]','2025-04-15 13:26:33',NULL,'2025-04-14 23:14:49','2025-04-15 13:26:33');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (66,'App\\Models\\Utilizador',2,'auth-token','b2197670e271f8b8aeee8c9b2a8a474c9d6bb01e9b7f9ec73ac3bc1b4d6571bf','[\"*\"]','2025-04-14 23:59:51',NULL,'2025-04-14 23:53:36','2025-04-14 23:59:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (67,'App\\Models\\Utilizador',2,'auth-token','f288462add2f40026ae51c4a9dd0265fc9ebf5ce5cac7bccafa3305d9b31ca67','[\"*\"]','2025-04-15 00:00:35',NULL,'2025-04-15 00:00:11','2025-04-15 00:00:35');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (68,'App\\Models\\Utilizador',2,'auth-token','91081131a60d6f9e3c119ac992a34cdff4469538c83cdfb46d40872d5d3d683d','[\"*\"]','2025-04-15 00:04:03',NULL,'2025-04-15 00:00:49','2025-04-15 00:04:03');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (69,'App\\Models\\Utilizador',2,'auth-token','f153738d0176e0687f3e558dead5c9c8a6ea49055e588731a8fb42dcb464e779','[\"*\"]','2025-04-15 00:05:17',NULL,'2025-04-15 00:04:18','2025-04-15 00:05:17');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (70,'App\\Models\\Utilizador',1,'auth-token','09f234741856f3c4ff189475296d3f6a4a88d14ff20d0fafb9df410ffd461e82','[\"*\"]','2025-04-15 00:12:48',NULL,'2025-04-15 00:05:37','2025-04-15 00:12:48');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (71,'App\\Models\\Utilizador',2,'auth-token','dc76a73b9c0bc65e0a0ec2fd7d38d5638679a473f397055575c78a49310759e9','[\"*\"]','2025-04-15 00:18:25',NULL,'2025-04-15 00:13:03','2025-04-15 00:18:25');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (72,'App\\Models\\Utilizador',1,'auth-token','8518717e6a64eb1dbfab3ac2b0153c8014cebbbdeaa385a9de1bbe064b454ab4','[\"*\"]','2025-04-15 00:56:54',NULL,'2025-04-15 00:18:45','2025-04-15 00:56:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (73,'App\\Models\\Utilizador',2,'auth-token','d995ab6c38c87798abf51e34e3e6c4981ef22e841c84c93b170359f0a0972015','[\"*\"]','2025-04-15 13:49:23',NULL,'2025-04-15 00:57:13','2025-04-15 13:49:23');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (74,'App\\Models\\Utilizador',1,'auth-token','b527ab6f9a02ee833deb53be996966a077218d10a513d580ced374e769502f6e','[\"*\"]','2025-04-15 14:07:23',NULL,'2025-04-15 13:26:56','2025-04-15 14:07:23');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (75,'App\\Models\\Utilizador',1,'auth-token','53c892732d44a92632f98979cf99a4f20e90db55e9e56644a0e1493edcda03ba','[\"*\"]','2025-04-15 17:25:29',NULL,'2025-04-15 13:49:40','2025-04-15 17:25:29');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (76,'App\\Models\\Utilizador',2,'auth-token','ee22b1d5903cde7663e11758fb253e8fe8e3a0702d03ebc41d362648835a74b3','[\"*\"]','2025-04-15 14:34:28',NULL,'2025-04-15 14:07:35','2025-04-15 14:34:28');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (77,'App\\Models\\Utilizador',1,'auth-token','d2e35e982a2a5528d27e924f0544d7b4b084d1a0228992d9f827246f0b8cd93f','[\"*\"]','2025-04-15 15:13:32',NULL,'2025-04-15 15:06:45','2025-04-15 15:13:32');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (78,'App\\Models\\Utilizador',1,'auth-token','8433bf2731f08a7c66a3ad510c2907917b0954dc5fae4854b775b7b6a37453e0','[\"*\"]',NULL,NULL,'2025-04-15 15:21:18','2025-04-15 15:21:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (79,'App\\Models\\Utilizador',1,'auth-token','76c2712b741715f8ea772944eb8daf0e0cf795a225134902e58720b706a6e938','[\"*\"]','2025-04-15 16:09:24',NULL,'2025-04-15 15:21:33','2025-04-15 16:09:24');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (80,'App\\Models\\Utilizador',2,'auth-token','793c8abc84abb7537f8910cd779010d454ec8738c0397e42b939cbb73445ddcc','[\"*\"]','2025-04-15 21:24:56',NULL,'2025-04-15 16:13:44','2025-04-15 21:24:56');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (81,'App\\Models\\Utilizador',2,'auth-token','ec0c11a7eccc8eef97ce65143401652e7a93ae80e6a2f38b5eac37c2c43405d7','[\"*\"]','2025-04-15 17:50:20',NULL,'2025-04-15 17:49:43','2025-04-15 17:50:20');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (82,'App\\Models\\Utilizador',1,'auth-token','067fd5c3f2f63b48184232418c1eca49f39ff32c6cd83b5d9f43ed92678310b5','[\"*\"]','2025-04-15 17:54:09',NULL,'2025-04-15 17:50:47','2025-04-15 17:54:09');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (83,'App\\Models\\Utilizador',1,'auth-token','f4349f92b2ab4bb342ed90b8f4ad387a4bee0ad48dbc9e6cce5e3d7d5bf40780','[\"*\"]','2025-04-15 23:26:07',NULL,'2025-04-15 17:57:04','2025-04-15 23:26:07');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (84,'App\\Models\\Utilizador',1,'auth-token','6b0142531064c4a9d8f1d8a2e647120d83e83f5cc8f6f3146af35c091f67853f','[\"*\"]','2025-04-15 21:44:18',NULL,'2025-04-15 21:39:28','2025-04-15 21:44:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (85,'App\\Models\\Utilizador',2,'auth-token','0736a42132eeb4ff1844bf2fbac1baffce67dd443e3e8d1565093589f223142a','[\"*\"]','2025-04-15 22:45:49',NULL,'2025-04-15 21:44:37','2025-04-15 22:45:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (86,'App\\Models\\Utilizador',1,'auth-token','6b84f7b54fc848cc723e73f64fd5e3c9a9bb9150dead94c9f84a1287b56c6379','[\"*\"]','2025-04-16 23:31:17',NULL,'2025-04-16 09:01:15','2025-04-16 23:31:17');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (87,'App\\Models\\Utilizador',2,'auth-token','11f078024b54818d2b8b32e75135044b439180332d6bfeaab16b323317c1b767','[\"*\"]','2025-04-16 16:10:55',NULL,'2025-04-16 16:05:13','2025-04-16 16:10:55');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (88,'App\\Models\\Utilizador',2,'auth-token','983d8887557eca7339743573a75b45fd4aad7dd7a542cca1f625b318a3bf4ae9','[\"*\"]','2025-04-16 19:19:56',NULL,'2025-04-16 19:19:38','2025-04-16 19:19:56');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (89,'App\\Models\\Utilizador',3,'auth-token','2760fefdaa8163af90f700d5785fdf36ced43f98993815141e2dd64920984303','[\"*\"]','2025-04-16 19:38:41',NULL,'2025-04-16 19:20:32','2025-04-16 19:38:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (90,'App\\Models\\Utilizador',3,'auth-token','df27d5fd4ada9262cbb08b9c1b310c79d2305d1efbdebc4f2d6de5a3b5c88b50','[\"*\"]','2025-04-16 20:25:40',NULL,'2025-04-16 19:50:06','2025-04-16 20:25:40');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (91,'App\\Models\\Utilizador',3,'auth-token','ece2cfe005c844399ef92eda17ff1471f5adf190c76dc108c41f0abda89c7c0b','[\"*\"]','2025-04-16 21:10:48',NULL,'2025-04-16 20:32:11','2025-04-16 21:10:48');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (92,'App\\Models\\Utilizador',2,'auth-token','4d65e5f67d96a408dcbc23a9c6243d66952b6f1a6f88f99f46810434ca3d7cdc','[\"*\"]','2025-04-16 21:18:59',NULL,'2025-04-16 21:11:03','2025-04-16 21:18:59');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (93,'App\\Models\\Utilizador',3,'auth-token','1e1a6dfb91eeb42144367073cb81b580db3db98c587e9e333ac384acdf98f552','[\"*\"]','2025-04-16 21:20:42',NULL,'2025-04-16 21:19:31','2025-04-16 21:20:42');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (94,'App\\Models\\Utilizador',3,'auth-token','8c1b04c3c0c3fba850c0bccf64c1f7fab706dc73d5fc536817c3988d30a75e59','[\"*\"]','2025-04-17 00:23:18',NULL,'2025-04-16 21:21:06','2025-04-17 00:23:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (95,'App\\Models\\Utilizador',3,'auth-token','4ff2b94a06d1c88ce8baddbd2000bb680f51848872692cc7081022368b2a7f65','[\"*\"]','2025-04-17 00:26:04',NULL,'2025-04-16 23:31:27','2025-04-17 00:26:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (96,'App\\Models\\Utilizador',3,'auth-token','21cc80401a8b412f9dd88bf469ba36f03cb0aed25c9caca5c78c2bec573f49e3','[\"*\"]','2025-04-18 10:48:46',NULL,'2025-04-18 08:49:16','2025-04-18 10:48:46');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (98,'App\\Models\\Utilizador',2,'auth-token','1d0e792485266b6785acf10aa3f29cd43e8802350545632c5224fcbb29055f6a','[\"*\"]','2025-04-18 10:55:56',NULL,'2025-04-18 10:55:23','2025-04-18 10:55:56');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (99,'App\\Models\\Utilizador',3,'auth-token','223d7f2b0481992484100dcc3d7f173bb7546dcc6cd14d64bad7e8e58e68b3ab','[\"*\"]','2025-04-18 11:08:43',NULL,'2025-04-18 10:56:17','2025-04-18 11:08:43');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (100,'App\\Models\\Utilizador',3,'auth-token','78b970da14d50179beb7085f110a97032b03110f62803722fc58e9ea4d31f48d','[\"*\"]','2025-04-18 11:13:12',NULL,'2025-04-18 11:12:41','2025-04-18 11:13:12');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (101,'App\\Models\\Utilizador',2,'auth-token','3d6a17be90fbe6fdf1501f080acdde1ca6155dba1aefacb4a4c659e05cfe6967','[\"*\"]','2025-04-18 11:20:21',NULL,'2025-04-18 11:13:24','2025-04-18 11:20:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (102,'App\\Models\\Utilizador',2,'auth-token','22f07f51d4acd5e5c0ff2fc927692196c933e42155192f6950cc4bf0ef0e7432','[\"*\"]','2025-04-18 11:45:29',NULL,'2025-04-18 11:35:52','2025-04-18 11:45:29');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (103,'App\\Models\\Utilizador',3,'auth-token','d00ad1d0d1b78c57579194755d8d76fa88374e57f922da028cc08f2c177092c3','[\"*\"]','2025-04-18 13:21:30',NULL,'2025-04-18 13:21:16','2025-04-18 13:21:30');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (104,'App\\Models\\Utilizador',3,'auth-token','7a59ed095753fddd7d487fea2beeebb1823836392f47d2a2f872e4302ecb4dfb','[\"*\"]','2025-04-18 13:40:02',NULL,'2025-04-18 13:39:49','2025-04-18 13:40:02');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (105,'App\\Models\\Utilizador',3,'auth-token','817f3a9dc06ba8b644cc956e5861362b782001979cf49d8fc1ade0ef649f70ff','[\"*\"]','2025-04-18 14:01:49',NULL,'2025-04-18 13:58:03','2025-04-18 14:01:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (106,'App\\Models\\Utilizador',2,'auth-token','46a150606d8f0b37ff9327dc2f29f2d492b24ecd660388903e742cc03a691fd5','[\"*\"]','2025-04-18 14:02:34',NULL,'2025-04-18 14:02:12','2025-04-18 14:02:34');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (107,'App\\Models\\Utilizador',3,'auth-token','b05245935060864fb957ab34ba2a6581f9a763987d119e9fa7c85f89e756e7ef','[\"*\"]','2025-04-18 14:10:37',NULL,'2025-04-18 14:03:43','2025-04-18 14:10:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES (108,'App\\Models\\Utilizador',3,'auth-token','c0936b3492f908ef3d14f922cf9a53204e7d56a9c030c2331f44f42b801090aa','[\"*\"]','2025-04-18 14:44:23',NULL,'2025-04-18 14:15:52','2025-04-18 14:44:23');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamacao`
--

DROP TABLE IF EXISTS `reclamacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reclamacao` (
  `ID_Reclamacao` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(255) DEFAULT NULL,
  `DataReclamacao` timestamp NULL DEFAULT NULL,
  `AprovacaoID_aprovacao` int(10) NOT NULL,
  `Status_ReclamacaoID_Status_Reclamacao` int(11) NOT NULL,
  PRIMARY KEY (`ID_Reclamacao`),
  KEY `FKReclamacao876623` (`AprovacaoID_aprovacao`),
  KEY `FKReclamacao606601` (`Status_ReclamacaoID_Status_Reclamacao`),
  CONSTRAINT `FKReclamacao606601` FOREIGN KEY (`Status_ReclamacaoID_Status_Reclamacao`) REFERENCES `status_reclamacao` (`ID_Status_Reclamacao`),
  CONSTRAINT `FKReclamacao876623` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamacao`
--

LOCK TABLES `reclamacao` WRITE;
/*!40000 ALTER TABLE `reclamacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `reclamacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referenciatipo`
--

DROP TABLE IF EXISTS `referenciatipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `referenciatipo` (
  `ID_ReferenciaTipo` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_ReferenciaTipo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referenciatipo`
--

LOCK TABLES `referenciatipo` WRITE;
/*!40000 ALTER TABLE `referenciatipo` DISABLE KEYS */;
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (2,'Utilizador');
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (3,'Mensagem');
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (4,'Anuncio');
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (5,'Avaliacao');
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (6,'Compra');
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (7,'Troca');
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES (8,'Reclamacao');
/*!40000 ALTER TABLE `referenciatipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('7gswsucQ0opzgkzANlKZarKn15QWlCaTKpQwweCQ',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Windsurf/1.97.0 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidFNBMTJZcG1sVXk5N2Q0ejJ3amR1UFdjRktxbExvMjJyS0NUakRHaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8/dnNjb2RlQnJvd3NlclJlcUlkPTE3NDQzMTUwNTgxMzciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1744315069);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('9eixJiXaXF6RApTne3yFYvKE0CxhiyAsi5P3DFbf',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Windsurf/1.97.0 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1F6T0k5cWI3UHNpYzFGWWZhbzdBTXJmUG91ejRNenN5dGV6QnlJcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8/dnNjb2RlQnJvd3NlclJlcUlkPTE3NDQzMTU1NDAxMDYiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1744315547);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('SMd3en6bjCleb8eUI5L1hsQJEka0NX5UhlKJcxUa',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Windsurf/1.97.0 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnJqdWF5M1VXOWNiQ0gzYjd6aGE3WHlLNTNKV21uSEp2TkdvYnZyMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8/dnNjb2RlQnJvd3NlclJlcUlkPTE3NDQzMTUzMTY0NjEiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1744315317);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_anuncio`
--

DROP TABLE IF EXISTS `status_anuncio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_anuncio` (
  `ID_Status_Anuncio` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao_status_anuncio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Status_Anuncio`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_anuncio`
--

LOCK TABLES `status_anuncio` WRITE;
/*!40000 ALTER TABLE `status_anuncio` DISABLE KEYS */;
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES (1,'Ativo');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES (2,'Inativo');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES (3,'Vendido');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES (4,'Pendente');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES (7,'Rejeitado');
/*!40000 ALTER TABLE `status_anuncio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_aprovacao`
--

DROP TABLE IF EXISTS `status_aprovacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_aprovacao` (
  `ID_Status_Aprovacao` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao_Status_aprovacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Status_Aprovacao`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_aprovacao`
--

LOCK TABLES `status_aprovacao` WRITE;
/*!40000 ALTER TABLE `status_aprovacao` DISABLE KEYS */;
INSERT INTO `status_aprovacao` (`ID_Status_Aprovacao`, `Descricao_Status_aprovacao`) VALUES (1,'Pendente');
INSERT INTO `status_aprovacao` (`ID_Status_Aprovacao`, `Descricao_Status_aprovacao`) VALUES (2,'Aprovado');
INSERT INTO `status_aprovacao` (`ID_Status_Aprovacao`, `Descricao_Status_aprovacao`) VALUES (3,'Rejeitado');
/*!40000 ALTER TABLE `status_aprovacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_mensagem`
--

DROP TABLE IF EXISTS `status_mensagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_mensagem` (
  `ID_Status_Mensagem` int(10) NOT NULL AUTO_INCREMENT,
  `Descricao_status_mensagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Status_Mensagem`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_mensagem`
--

LOCK TABLES `status_mensagem` WRITE;
/*!40000 ALTER TABLE `status_mensagem` DISABLE KEYS */;
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES (1,'Não Lida');
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES (2,'Lida');
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES (3,'Enviada');
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES (5,'Arquivada');
/*!40000 ALTER TABLE `status_mensagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_reclamacao`
--

DROP TABLE IF EXISTS `status_reclamacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_reclamacao` (
  `ID_Status_Reclamacao` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao_status_reclamacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Status_Reclamacao`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_reclamacao`
--

LOCK TABLES `status_reclamacao` WRITE;
/*!40000 ALTER TABLE `status_reclamacao` DISABLE KEYS */;
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES (1,'Pendente');
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES (3,'Resolvida');
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES (4,'Rejeitada');
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES (5,'Recebida');
/*!40000 ALTER TABLE `status_reclamacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_troca`
--

DROP TABLE IF EXISTS `status_troca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_troca` (
  `ID_Status_Troca` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao_status_troca` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Status_Troca`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_troca`
--

LOCK TABLES `status_troca` WRITE;
/*!40000 ALTER TABLE `status_troca` DISABLE KEYS */;
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (1,'Pendente');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (2,'Aceita');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (3,'Rejeitada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (4,'Cancelada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (5,'Solicitada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (6,'Aceita');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (7,'Recusada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES (8,'Concluída');
/*!40000 ALTER TABLE `status_troca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_utilizador`
--

DROP TABLE IF EXISTS `status_utilizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_utilizador` (
  `ID_status_utilizador` int(10) NOT NULL AUTO_INCREMENT,
  `Descricao_status_utilizador` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_status_utilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_utilizador`
--

LOCK TABLES `status_utilizador` WRITE;
/*!40000 ALTER TABLE `status_utilizador` DISABLE KEYS */;
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES (1,'Pendente');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES (2,'Ativo');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES (3,'Inativo');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES (4,'Bloqueado');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES (5,'Banido');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES (8,'Rejeitado');
/*!40000 ALTER TABLE `status_utilizador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_item`
--

DROP TABLE IF EXISTS `tipo_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_item` (
  `ID_Tipo` int(10) NOT NULL AUTO_INCREMENT,
  `Descricao_TipoItem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_Tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_item`
--

LOCK TABLES `tipo_item` WRITE;
/*!40000 ALTER TABLE `tipo_item` DISABLE KEYS */;
INSERT INTO `tipo_item` (`ID_Tipo`, `Descricao_TipoItem`) VALUES (1,'Produto');
INSERT INTO `tipo_item` (`ID_Tipo`, `Descricao_TipoItem`) VALUES (2,'Serviço');
INSERT INTO `tipo_item` (`ID_Tipo`, `Descricao_TipoItem`) VALUES (3,'Doação');
/*!40000 ALTER TABLE `tipo_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_notificacao`
--

DROP TABLE IF EXISTS `tipo_notificacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_notificacao` (
  `ID_TipoNotificacao` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_TipoNotificacao`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_notificacao`
--

LOCK TABLES `tipo_notificacao` WRITE;
/*!40000 ALTER TABLE `tipo_notificacao` DISABLE KEYS */;
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (3,'Redefinição de Senha');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (4,'Registo de Utilizador');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (5,'Mensagem');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (6,'Redefinição de Senha');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (7,'Avaliação');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (8,'Compra');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (9,'Troca');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (10,'Anúncio Pendente');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (11,'Anúncio Aprovado');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (12,'Anúncio Rejeitado');
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES (13,'Promoção');
/*!40000 ALTER TABLE `tipo_notificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipouser`
--

DROP TABLE IF EXISTS `tipouser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipouser` (
  `ID_TipoUser` int(11) NOT NULL AUTO_INCREMENT,
  `Descrição_TipoUtilizador` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_TipoUser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipouser`
--

LOCK TABLES `tipouser` WRITE;
/*!40000 ALTER TABLE `tipouser` DISABLE KEYS */;
INSERT INTO `tipouser` (`ID_TipoUser`, `Descrição_TipoUtilizador`) VALUES (1,'Administrador');
INSERT INTO `tipouser` (`ID_TipoUser`, `Descrição_TipoUtilizador`) VALUES (2,'Utilizador Normal');
/*!40000 ALTER TABLE `tipouser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `troca`
--

DROP TABLE IF EXISTS `troca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `troca` (
  `ID_Troca` int(11) NOT NULL AUTO_INCREMENT,
  `DataTroca` timestamp NULL DEFAULT NULL,
  `ItemID_ItemOferecido` int(10) NOT NULL,
  `ItemID_Solicitado` int(10) NOT NULL,
  `Status_TrocaID_Status_Troca` int(11) NOT NULL,
  PRIMARY KEY (`ID_Troca`),
  KEY `FKTroca415305` (`Status_TrocaID_Status_Troca`),
  KEY `FKTroca249283` (`ItemID_ItemOferecido`),
  KEY `FKTroca815193` (`ItemID_Solicitado`),
  CONSTRAINT `FKTroca249283` FOREIGN KEY (`ItemID_ItemOferecido`) REFERENCES `anuncio` (`ID_Anuncio`),
  CONSTRAINT `FKTroca415305` FOREIGN KEY (`Status_TrocaID_Status_Troca`) REFERENCES `status_troca` (`ID_Status_Troca`),
  CONSTRAINT `FKTroca815193` FOREIGN KEY (`ItemID_Solicitado`) REFERENCES `anuncio` (`ID_Anuncio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `troca`
--

LOCK TABLES `troca` WRITE;
/*!40000 ALTER TABLE `troca` DISABLE KEYS */;
/*!40000 ALTER TABLE `troca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES (1,'Test User','test@example.com','2025-04-10 15:33:40','$2y$12$PG/pLm16ggCxYAA05cH3n.anVSVbyDq1BTugBq0gL7Dw7C4k.Lqwq','evGpZ0UTKy','2025-04-10 15:33:41','2025-04-10 15:33:41');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizador`
--

DROP TABLE IF EXISTS `utilizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilizador` (
  `ID_User` int(10) NOT NULL AUTO_INCREMENT,
  `User_Name` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Data_Nascimento` date NOT NULL,
  `Password` varchar(255) NOT NULL,
  `CC` int(10) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MoradaID_Morada` int(10) NOT NULL,
  `AprovacaoID_aprovacao` int(10) DEFAULT NULL,
  `cartaoID_Cartao` int(10) DEFAULT NULL,
  `TipoUserID_TipoUser` int(11) NOT NULL,
  `ImagemID_Imagem` int(11) NOT NULL,
  `Status_UtilizadorID_status_utilizador` int(10) NOT NULL,
  PRIMARY KEY (`ID_User`),
  KEY `FKUtilizador680017` (`MoradaID_Morada`),
  KEY `FKUtilizador462334` (`AprovacaoID_aprovacao`),
  KEY `FKUtilizador373700` (`cartaoID_Cartao`),
  KEY `FKUtilizador979318` (`TipoUserID_TipoUser`),
  KEY `FKUtilizador772568` (`ImagemID_Imagem`),
  KEY `FKUtilizador244028` (`Status_UtilizadorID_status_utilizador`),
  CONSTRAINT `FKUtilizador244028` FOREIGN KEY (`Status_UtilizadorID_status_utilizador`) REFERENCES `status_utilizador` (`ID_status_utilizador`),
  CONSTRAINT `FKUtilizador373700` FOREIGN KEY (`cartaoID_Cartao`) REFERENCES `cartao` (`ID_Cartao`),
  CONSTRAINT `FKUtilizador462334` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`),
  CONSTRAINT `FKUtilizador680017` FOREIGN KEY (`MoradaID_Morada`) REFERENCES `morada` (`ID_Morada`),
  CONSTRAINT `FKUtilizador772568` FOREIGN KEY (`ImagemID_Imagem`) REFERENCES `imagem` (`ID_Imagem`),
  CONSTRAINT `FKUtilizador979318` FOREIGN KEY (`TipoUserID_TipoUser`) REFERENCES `tipouser` (`ID_TipoUser`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizador`
--

LOCK TABLES `utilizador` WRITE;
/*!40000 ALTER TABLE `utilizador` DISABLE KEYS */;
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (1,'admin','Administrador','1990-01-01','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',12345678,'admin@example.com',1,1,NULL,1,1,2);
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (2,'user','Usuário Normal','1995-05-05','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',87654321,'user@example.com',2,2,NULL,2,1,2);
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (3,'VitorLeite','Vitor','1999-10-01','$2y$12$F4RUEOD4RAh4lRjvvhe2GeTHn9Jbfrit29D9nNb4jhDopLOE22heG',212233333,'vitor@example.com',15,22,5,2,4,2);
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (4,'JoanaBabe','Joana','2001-05-29','$2y$12$qkiovJb2MBGnrlWBPTMti.eiRRZShJwzfuQYUW6roQMbqoSAmZogq',45345346,'joana@example.com',1,24,NULL,2,5,8);
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (5,'vilastheboy','Vilas','2003-01-07','$2y$12$O6s6K9ioXISMkN127QNJUeJra1MDyYT4ZW8kBnO9AEb36WnyNKloe',34354363,'vilas@example.com',3,51,NULL,2,6,8);
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (6,'jose pereira','jose','2007-07-18','$2y$12$tqYSBQcJPGuGk5IT4SHRPOAxQJhh9UwWd5Dm8q/hcKgZmH7DjbXDq',10203040,'pereira@email.com',20,49,NULL,2,18,1);
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES (7,'arturmatos','artur','2004-02-10','$2y$12$tGCqhR98ur1km84p0pgJ0.bTpvG1WHjSq0A5OuS.jiKSIeFW7vAJu',20304050,'amatos@email.com',30,50,NULL,2,19,2);
/*!40000 ALTER TABLE `utilizador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'db_nt'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-18 17:47:21
