-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: calcol
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `detalle_pedidos`
--

DROP TABLE IF EXISTS `detalle_pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` int NOT NULL,
  `nota` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedidos`
--

LOCK TABLES `detalle_pedidos` WRITE;
/*!40000 ALTER TABLE `detalle_pedidos` DISABLE KEYS */;
INSERT INTO `detalle_pedidos` VALUES (1,1,7,2,2500,''),(2,3,2,1,1700,'');
/*!40000 ALTER TABLE `detalle_pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `cantidad` int NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,7,'salida',2,'Pedido #1','2026-04-28 02:13:50'),(2,2,'salida',1,'Pedido #3','2026-04-28 21:03:04');
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `instrucciones` text,
  `subtotal` int NOT NULL,
  `envio` int DEFAULT '2000',
  `total` int NOT NULL,
  `estado` enum('pendiente','en_proceso','listo','entregado') DEFAULT 'pendiente',
  `cubiertos` tinyint(1) DEFAULT '0',
  `salsa` tinyint(1) DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,'San Pablo 8648, Cerro Navia','',5000,2000,7000,'pendiente',1,1,'2026-04-28 02:13:50'),(3,1,'San Pablo 8648, Pudahuel','',1700,2000,3700,'pendiente',0,0,'2026-04-28 21:03:04');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio` int NOT NULL,
  `categoria` enum('completos','hamburguesa','churrasco','yaroa','promo') NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stock` int DEFAULT '100',
  `agotado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Completo','Pan bueno, salchichón, tomate, palta y torta mayo casera.',1700,'completos','completo-pequeño.png',1,'2026-04-15 21:09:15',55,0),(2,'Completo XL','Pan bueno, salchichón, palta-Chimichurri y torta mayo casera.',1700,'completos','completo-pequeño.png',1,'2026-04-15 21:09:15',75,0),(3,'Italiano','Pan suave, salchicha, tomate fresco, palta y harta mayo casera.',1700,'completos','completo-italino-pequeño.png',1,'2026-04-15 21:09:15',91,0),(4,'Italiano XL','Pan suave, salchicha, tomate fresco, palta y harta mayo casera.',1700,'completos','completo-italino-pequeño.png',1,'2026-04-15 21:09:15',99,0),(5,'As Queso','Pan, vienesa, salchicha y queso derretido.',1700,'completos','completo-As-pequeño.png',1,'2026-04-15 21:09:15',100,0),(6,'As Queso XL','Pan, vienesa, salchicha y queso derretido.',1700,'completos','completo-As-pequeño.png',1,'2026-04-15 21:09:15',100,0),(7,'Italiano','Pan, carne jugosa, tomate, palta y mayo casera.',2500,'churrasco','churrasco-italiano.webp',1,'2026-04-15 21:09:15',97,0),(8,'Chacarero','Pan, carne jugosa, porotos verdes, ají verde y tomate.',2500,'churrasco','chacarero.jpg',1,'2026-04-15 21:09:15',100,0),(9,'Barros Luco','Pan, carne jugosa y queso fundido.',2500,'churrasco','barro luco.webp',1,'2026-04-28 21:12:05',100,0),(10,'Churrasco a lo Pobre','Pan, carne jugosa, huevo frito, cebolla frita y papas fritas.',2500,'churrasco','a lo pobre.jpg',1,'2026-04-28 21:12:05',100,0),(11,'Barros Jarpa','Pan, jamón cocido y queso fundido.',2500,'churrasco','barros jarpa.webp',1,'2026-04-28 21:12:05',100,0),(12,'Completo Churrasco','Pan, carne jugosa, tomate, chucrut y mayo casera.',2500,'churrasco','completo.jpeg',1,'2026-04-28 21:12:05',100,0),(13,'Cheeseburger','Pan de hamburguesa, carne de res y queso fundido.',2500,'hamburguesa','Cheeseburger.png',1,'2026-04-28 21:12:05',100,0),(14,'Bacon Burger','Carne de res, tocino crujiente, queso cheddar, lechuga, tomate y salsas.',2500,'hamburguesa','Bacon-Burger.png',1,'2026-04-28 21:12:05',100,0),(15,'Hamburguesa BBQ','Carne de res, salsa BBQ, queso cheddar, tocino, cebolla y tomate.',2500,'hamburguesa','Hamburguesa-BBQ.png',1,'2026-04-28 21:12:05',100,0),(16,'Hamburguesa Suiza','Carne de res, champiñones salteados, queso suizo, cebolla y salsas.',2500,'hamburguesa','Hamburguesa Suiza.jpg',1,'2026-04-28 21:12:05',100,0),(17,'Hawaiana','Carne de res, jamón, piña, queso cheddar, lechuga y salsa.',2500,'hamburguesa','Hamburguesa Hawaiana.jpg',1,'2026-04-28 21:12:05',100,0),(18,'Stacker','Tres carnes de res, queso cheddar, lechuga, tomate, cebolla y salsas.',2500,'hamburguesa','Hamburguesa Stacker.webp',1,'2026-04-28 21:12:05',100,0),(19,'Yaroa de pollo','Papas fritas, pollo desmenuzado, queso y mayonesa/ketchup.',2500,'yaroa','Yaroa-pollo.avif',1,'2026-04-28 21:12:05',100,0),(20,'Yaroa de carne molida','Papas fritas, carne molida, queso y mayonesa/ketchup.',2500,'yaroa','yaroa-carne-molida.jpg',1,'2026-04-28 21:12:05',100,0),(21,'Yaroa mixta','Papas fritas, pollo y carne, queso y salsas.',2500,'yaroa','yaroa-mixta.jpeg',1,'2026-04-28 21:12:05',100,0),(22,'Yaroa de longaniza','Papas fritas, longaniza, queso y salsas.',2500,'yaroa','yaroa-longaniza.jpg',1,'2026-04-28 21:12:05',100,0),(23,'Yaroa de res y tocino','Papas fritas, carne de res, tocino, queso y salsas.',2500,'yaroa','yaroa-res-tocino.png',1,'2026-04-28 21:12:05',100,0),(24,'Yaroa vegetariana','Papas fritas, vegetales salteados, queso y salsas.',2500,'yaroa','yaroa-vegetariana.png',1,'2026-04-28 21:12:05',100,0),(25,'Combo Yaroa Full','Yaroa de pollo + bebida + postre',3200,'promo','Yaroa-pollo.avif',1,'2026-04-28 21:12:24',100,0),(26,'Combo Burger Caliente','Bacon Burger + papas fritas + bebida',3800,'promo','Bacon Burger.jpg',1,'2026-04-28 21:12:24',100,0),(27,'Combo Doble Completo','2 completos + bebida familiar',3400,'promo','completo-completo-pequeño.png',1,'2026-04-28 21:12:24',100,0),(28,'Combo Burger Familiar','2 BBQ Burger + papas + 2 bebidas',5600,'promo','Hamburguesa BBQ.webp',1,'2026-04-28 21:12:24',100,0),(29,'Yaroa Carne Especial','Yaroa de carne molida + bebida',2900,'promo','yaroa-carne-molida.jpg',1,'2026-04-28 21:12:24',100,0),(30,'Italiano Combo','Italiano XL + bebida + postre',2850,'promo','completo-italiano-peque.png',1,'2026-04-28 21:12:24',100,0),(31,'Yaroa Mixta Combo','Yaroa mixta + bebida',2800,'promo','yaroa-mixta.jpeg',1,'2026-04-28 21:12:24',100,0),(32,'Stacker Combo','Stacker triple + papas + bebida',4900,'promo','Hamburguesa Stacker.webp',1,'2026-04-28 21:12:24',100,0);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recuperacion_password`
--

DROP TABLE IF EXISTS `recuperacion_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recuperacion_password` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expiracion` datetime NOT NULL,
  `usado` tinyint(1) DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperacion_password`
--

LOCK TABLES `recuperacion_password` WRITE;
/*!40000 ALTER TABLE `recuperacion_password` DISABLE KEYS */;
INSERT INTO `recuperacion_password` VALUES (1,'greudyinoa29@gmail.com','423c362a7ca31e8d61b0be0f5a625c42f58033c523371814974dc287e37f6d08','2026-04-28 05:15:00',1,'2026-04-28 02:15:00');
/*!40000 ALTER TABLE `recuperacion_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('admin','cliente') DEFAULT 'cliente',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Greudy Inoa','greudyinoa29@gmail.com','$2y$10$mftwUa7.RCuR3gtPjTGxD.K655uGMxFut3c99C4i3zmEvsalBmJuq','+56911111111','cliente','2026-04-28 02:07:29');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28 17:52:08
