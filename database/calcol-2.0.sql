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
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Completos','completos'),(2,'Hamburguesas','hamburguesa'),(3,'Churrascos','churrasco'),(4,'Yaroas','yaroa'),(5,'Promos','promo');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

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
  KEY `fk_detalle_pedido` (`pedido_id`),
  KEY `fk_detalle_producto` (`producto_id`),
  CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedidos`
--

LOCK TABLES `detalle_pedidos` WRITE;
/*!40000 ALTER TABLE `detalle_pedidos` DISABLE KEYS */;
INSERT INTO `detalle_pedidos` VALUES (1,1,7,2,2500,''),(2,3,2,1,1700,''),(3,4,3,1,1700,''),(4,4,1,1,1700,''),(5,5,1,1,1700,''),(6,5,1,1,1700,''),(7,5,1,1,1700,''),(8,6,1,1,1700,''),(9,7,1,1,1700,''),(10,7,2,1,1700,''),(11,7,1,1,1700,'');
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
  `pedido_id` int DEFAULT NULL,
  `tipo` enum('entrada','salida') NOT NULL,
  `cantidad` int NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inventario_pedido` (`pedido_id`),
  KEY `idx_inventario_producto` (`producto_id`),
  CONSTRAINT `fk_inventario_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_inventario_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,7,NULL,'salida',2,'Pedido #1','2026-04-28 02:13:50'),(2,2,NULL,'salida',1,'Pedido #3','2026-04-28 21:03:04'),(3,3,NULL,'salida',1,'Pedido #4','2026-04-29 01:54:04'),(4,1,NULL,'salida',1,'Pedido #4','2026-04-29 01:54:04'),(5,1,NULL,'salida',1,'Pedido #5','2026-04-30 02:12:43'),(6,1,NULL,'salida',1,'Pedido #5','2026-04-30 02:12:43'),(7,1,NULL,'salida',1,'Pedido #5','2026-04-30 02:12:43'),(8,1,NULL,'entrada',55,'Stock inicial migrado','2026-04-30 14:26:07'),(9,2,NULL,'entrada',76,'Stock inicial migrado','2026-04-30 14:26:07'),(10,3,NULL,'entrada',91,'Stock inicial migrado','2026-04-30 14:26:07'),(11,4,NULL,'entrada',99,'Stock inicial migrado','2026-04-30 14:26:07'),(12,5,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(13,6,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(14,7,NULL,'entrada',99,'Stock inicial migrado','2026-04-30 14:26:07'),(15,8,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(16,9,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(17,10,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(18,11,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(19,12,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(20,13,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(21,14,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(22,15,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(23,16,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(24,17,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(25,18,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(26,19,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(27,20,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(28,21,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(29,22,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(30,23,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(31,24,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(32,25,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(33,26,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(34,27,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(35,28,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(36,29,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(37,30,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(38,31,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(39,32,NULL,'entrada',100,'Stock inicial migrado','2026-04-30 14:26:07'),(71,1,6,'salida',1,'Pedido #6','2026-05-01 21:42:39'),(72,1,7,'salida',1,'Pedido #7','2026-05-02 07:14:40'),(73,2,7,'salida',1,'Pedido #7','2026-05-02 07:14:40'),(74,1,7,'salida',1,'Pedido #7','2026-05-02 07:14:40');
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
  `estado` enum('pendiente','en_proceso','listo','entregado','cancelado') DEFAULT 'pendiente',
  `cubiertos` tinyint(1) DEFAULT '0',
  `salsa` tinyint(1) DEFAULT '0',
  `metodo_pago` enum('efectivo','tarjeta') NOT NULL DEFAULT 'efectivo',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pedidos_estado` (`estado`),
  KEY `idx_pedidos_usuario_fecha` (`usuario_id`,`creado_en`),
  CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,'San Pablo 8648, Cerro Navia','',5000,2000,7000,'pendiente',1,1,'efectivo','2026-04-28 02:13:50',NULL),(3,1,'San Pablo 8648, Pudahuel','',1700,2000,3700,'pendiente',0,0,'efectivo','2026-04-28 21:03:04',NULL),(4,1,'San Pablo 8648, Pudahuel','',3400,2000,5400,'pendiente',0,0,'efectivo','2026-04-29 01:54:04',NULL),(5,1,'San Pablo 111, Pudahuel','',5100,2000,7100,'pendiente',1,1,'efectivo','2026-04-30 02:12:43',NULL),(6,1,'San Pablo 8648, Lo Prado','',1700,2000,3700,'pendiente',0,0,'efectivo','2026-05-01 21:42:39','2026-05-01 21:42:39'),(7,1,'San Pablo 8648, Pudahuel','',5100,2000,7100,'pendiente',0,0,'efectivo','2026-05-02 07:14:40','2026-05-02 07:14:40');
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
  `categoria_id` int NOT NULL DEFAULT '1',
  `imagen` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_productos_categoria_disponible` (`categoria_id`,`disponible`),
  CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Completo','Pan bueno, salchichón, tomate, palta y torta mayo casera.',1700,1,'completo-pequeño.png',1,'2026-04-15 21:09:15',NULL),(2,'Completo XL','Pan bueno, salchichón, palta-Chimichurri y torta mayo casera.',1700,1,'completo-pequeño.png',1,'2026-04-15 21:09:15',NULL),(3,'Italiano','Pan suave, salchicha, tomate fresco, palta y harta mayo casera.',1700,1,'completo-italino-pequeño.png',1,'2026-04-15 21:09:15',NULL),(4,'Italiano XL','Pan suave, salchicha, tomate fresco, palta y harta mayo casera.',1700,1,'completo-italino-pequeño.png',1,'2026-04-15 21:09:15',NULL),(5,'As Queso','Pan, vienesa, salchicha y queso derretido.',1700,1,'completo-As-pequeño.png',1,'2026-04-15 21:09:15',NULL),(6,'As Queso XL','Pan, vienesa, salchicha y queso derretido.',1700,1,'completo-As-pequeño.png',1,'2026-04-15 21:09:15',NULL),(7,'Italiano','Pan, carne jugosa, tomate, palta y mayo casera.',2500,3,'churrasco-italiano.webp',1,'2026-04-15 21:09:15',NULL),(8,'Chacarero','Pan, carne jugosa, porotos verdes, ají verde y tomate.',2500,3,'chacarero.jpg',1,'2026-04-15 21:09:15',NULL),(9,'Barros Luco','Pan, carne jugosa y queso fundido.',2500,3,'barro luco.webp',1,'2026-04-28 21:12:05',NULL),(10,'Churrasco a lo Pobre','Pan, carne jugosa, huevo frito, cebolla frita y papas fritas.',2500,3,'a lo pobre.jpg',1,'2026-04-28 21:12:05',NULL),(11,'Barros Jarpa','Pan, jamón cocido y queso fundido.',2500,3,'barros jarpa.webp',1,'2026-04-28 21:12:05',NULL),(12,'Completo Churrasco','Pan, carne jugosa, tomate, chucrut y mayo casera.',2500,3,'completo.jpeg',1,'2026-04-28 21:12:05',NULL),(13,'Cheeseburger','Pan de hamburguesa, carne de res y queso fundido.',2500,2,'Cheeseburger.png',1,'2026-04-28 21:12:05',NULL),(14,'Bacon Burger','Carne de res, tocino crujiente, queso cheddar, lechuga, tomate y salsas.',2500,2,'Bacon-Burger.png',1,'2026-04-28 21:12:05',NULL),(15,'Hamburguesa BBQ','Carne de res, salsa BBQ, queso cheddar, tocino, cebolla y tomate.',2500,2,'Hamburguesa-BBQ.png',1,'2026-04-28 21:12:05',NULL),(16,'Hamburguesa Suiza','Carne de res, champiñones salteados, queso suizo, cebolla y salsas.',2500,2,'Hamburguesa Suiza.jpg',1,'2026-04-28 21:12:05',NULL),(17,'Hawaiana','Carne de res, jamón, piña, queso cheddar, lechuga y salsa.',2500,2,'Hamburguesa Hawaiana.jpg',1,'2026-04-28 21:12:05',NULL),(18,'Stacker','Tres carnes de res, queso cheddar, lechuga, tomate, cebolla y salsas.',2500,2,'Hamburguesa Stacker.webp',1,'2026-04-28 21:12:05',NULL),(19,'Yaroa de pollo','Papas fritas, pollo desmenuzado, queso y mayonesa/ketchup.',2500,4,'Yaroa-pollo.avif',1,'2026-04-28 21:12:05',NULL),(20,'Yaroa de carne molida','Papas fritas, carne molida, queso y mayonesa/ketchup.',2500,4,'yaroa-carne-molida.jpg',1,'2026-04-28 21:12:05',NULL),(21,'Yaroa mixta','Papas fritas, pollo y carne, queso y salsas.',2500,4,'yaroa-mixta.jpeg',1,'2026-04-28 21:12:05',NULL),(22,'Yaroa de longaniza','Papas fritas, longaniza, queso y salsas.',2500,4,'yaroa-longaniza.jpg',1,'2026-04-28 21:12:05',NULL),(23,'Yaroa de res y tocino','Papas fritas, carne de res, tocino, queso y salsas.',2500,4,'yaroa-res-tocino.png',1,'2026-04-28 21:12:05',NULL),(24,'Yaroa vegetariana','Papas fritas, vegetales salteados, queso y salsas.',2500,4,'yaroa-vegetariana.png',1,'2026-04-28 21:12:05',NULL),(25,'Combo Yaroa Full','Yaroa de pollo + bebida + postre',3200,5,'Yaroa-pollo.avif',1,'2026-04-28 21:12:24',NULL),(26,'Combo Burger Caliente','Bacon Burger + papas fritas + bebida',3800,5,'Bacon Burger.jpg',1,'2026-04-28 21:12:24',NULL),(27,'Combo Doble Completo','2 completos + bebida familiar',3400,5,'completo-completo-pequeño.png',1,'2026-04-28 21:12:24',NULL),(28,'Combo Burger Familiar','2 BBQ Burger + papas + 2 bebidas',5600,5,'Hamburguesa BBQ.webp',1,'2026-04-28 21:12:24',NULL),(29,'Yaroa Carne Especial','Yaroa de carne molida + bebida',2900,5,'yaroa-carne-molida.jpg',1,'2026-04-28 21:12:24',NULL),(30,'Italiano Combo','Italiano XL + bebida + postre',2850,5,'completo-italiano-peque.png',1,'2026-04-28 21:12:24',NULL),(31,'Yaroa Mixta Combo','Yaroa mixta + bebida',2800,5,'yaroa-mixta.jpeg',1,'2026-04-28 21:12:24',NULL),(32,'Stacker Combo','Stacker triple + papas + bebida',4900,5,'Hamburguesa Stacker.webp',1,'2026-04-28 21:12:24',NULL);
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
  `usuario_id` int NOT NULL,
  `token` varchar(64) NOT NULL,
  `expiracion` datetime NOT NULL,
  `usado` tinyint(1) DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `fk_recuperacion_usuario` (`usuario_id`),
  CONSTRAINT `fk_recuperacion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperacion_password`
--

LOCK TABLES `recuperacion_password` WRITE;
/*!40000 ALTER TABLE `recuperacion_password` DISABLE KEYS */;
INSERT INTO `recuperacion_password` VALUES (1,1,'423c362a7ca31e8d61b0be0f5a625c42f58033c523371814974dc287e37f6d08','2026-04-28 05:15:00',1,'2026-04-28 02:15:00');
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
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Greudy Inoa','greudyinoa29@gmail.com','$2y$10$mftwUa7.RCuR3gtPjTGxD.K655uGMxFut3c99C4i3zmEvsalBmJuq','+56911111111','cliente','2026-04-28 02:07:29',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_stock_actual`
--

DROP TABLE IF EXISTS `v_stock_actual`;
/*!50001 DROP VIEW IF EXISTS `v_stock_actual`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_stock_actual` AS SELECT 
 1 AS `producto_id`,
 1 AS `stock`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_stock_actual`
--

/*!50001 DROP VIEW IF EXISTS `v_stock_actual`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_stock_actual` AS select `inventario`.`producto_id` AS `producto_id`,sum((case when (`inventario`.`tipo` = 'entrada') then `inventario`.`cantidad` else -(`inventario`.`cantidad`) end)) AS `stock` from `inventario` group by `inventario`.`producto_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 21:18:52
