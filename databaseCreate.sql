-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: b1bs9cbwndpesy7uwuqw
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

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
-- Table structure for table `actividades_complementarias`
--

DROP TABLE IF EXISTS `actividades_complementarias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades_complementarias` (
  `id` int NOT NULL,
  `alumno_id` varchar(20) NOT NULL,
  `nombre_actividad` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `actividades_complementarias_ibfk_1` (`alumno_id`),
  CONSTRAINT `actividades_complementarias_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `administrativos`
--

DROP TABLE IF EXISTS `administrativos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrativos` (
  `id` varchar(20) NOT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `puesto` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `administrativos_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id` varchar(20) NOT NULL,
  `carrera_id` varchar(20) NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `semestre` varchar(2) DEFAULT NULL,
  `especialidad_id` int DEFAULT NULL,
  `estatus` enum('activo','activo con especiales','baja temporal','baja definitiva','egresado') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`id`),
  KEY `alumnos_ibfk_2` (`carrera_id`),
  KEY `fk_alumno_especialidad` (`especialidad_id`),
  CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `alumnos_ibfk_2` FOREIGN KEY (`carrera_id`) REFERENCES `carreras` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_alumno_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `anuncios`
--

DROP TABLE IF EXISTS `anuncios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anuncios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_publicacion` datetime DEFAULT NULL,
  `visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `aspirantes`
--

DROP TABLE IF EXISTS `aspirantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspirantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `carrera_id` varchar(20) NOT NULL,
  `fecha_solicitud` datetime DEFAULT NULL,
  `estado` enum('enviada','en_revision','aceptado','rechazado') NOT NULL DEFAULT 'enviada',
  PRIMARY KEY (`id`),
  KEY `fk_aspirantes_carrera` (`carrera_id`),
  CONSTRAINT `aspirantes_ibfk_1` FOREIGN KEY (`carrera_id`) REFERENCES `carreras` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `avance_reticular`
--

DROP TABLE IF EXISTS `avance_reticular`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avance_reticular` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_id` varchar(20) NOT NULL,
  `materia_id` varchar(20) NOT NULL,
  `estado` enum('no_permitida','seleccionable','en_curso','acreditada','reprobada') NOT NULL,
  `oportunidad` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unico_avance` (`alumno_id`,`materia_id`),
  KEY `avance_reticular_ibfk_2` (`materia_id`),
  CONSTRAINT `avance_reticular_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`),
  CONSTRAINT `avance_reticular_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carga_academica`
--

DROP TABLE IF EXISTS `carga_academica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carga_academica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_id` varchar(20) NOT NULL,
  `grupo_id` varchar(10) NOT NULL,
  `materia_id` varchar(20) NOT NULL,
  `estado` enum('seleccionada','liberada','finalizada') NOT NULL,
  `fecha_seleccion` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alumno_id` (`alumno_id`,`materia_id`),
  KEY `carga_academica_ibfk_2` (`grupo_id`),
  KEY `carga_academica_ibfk_3` (`materia_id`),
  CONSTRAINT `carga_academica_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`),
  CONSTRAINT `carga_academica_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`),
  CONSTRAINT `carga_academica_ibfk_3` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carreras`
--

DROP TABLE IF EXISTS `carreras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carreras` (
  `id` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cursos_contenido`
--

DROP TABLE IF EXISTS `cursos_contenido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos_contenido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_id` varchar(10) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `tipo_contenido` enum('archivo','enlace_web','texto_plano') NOT NULL,
  `ruta_archivo_o_url` varchar(255) DEFAULT NULL,
  `fecha_publicacion` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contenido_grupo` (`grupo_id`),
  CONSTRAINT `fk_contenido_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `docentes`
--

DROP TABLE IF EXISTS `docentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `docentes` (
  `id` varchar(20) NOT NULL,
  `cedula_profesional` varchar(30) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `docentes_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entregas_tareas`
--

DROP TABLE IF EXISTS `entregas_tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entregas_tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tarea_id` int NOT NULL,
  `alumno_id` varchar(20) NOT NULL,
  `fecha_entrega` timestamp NULL DEFAULT NULL,
  `ruta_archivo` varchar(255) DEFAULT NULL,
  `texto_respuesta` text,
  `calificacion_obtenida` decimal(5,2) DEFAULT NULL,
  `comentario_docente` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unica_entrega_idx` (`tarea_id`,`alumno_id`),
  KEY `fk_entregas_alumno` (`alumno_id`),
  CONSTRAINT `fk_entregas_alumno` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_entregas_tarea` FOREIGN KEY (`tarea_id`) REFERENCES `tareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carrera_id` varchar(20) NOT NULL,
  `clave` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_clave_unica_por_carrera` (`carrera_id`,`clave`),
  CONSTRAINT `fk_especialidad_carrera` FOREIGN KEY (`carrera_id`) REFERENCES `carreras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fechas_seleccion`
--

DROP TABLE IF EXISTS `fechas_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fechas_seleccion` (
  `alumno_id` varchar(20) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  PRIMARY KEY (`alumno_id`),
  CONSTRAINT `fechas_seleccion_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos` (
  `id` varchar(10) NOT NULL,
  `id_materia` varchar(20) NOT NULL,
  `id_docente` varchar(20) NOT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `salon_id` int DEFAULT NULL,
  `semestre` int DEFAULT NULL,
  `cupo` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `grupos_ibfk_1` (`id_materia`),
  KEY `grupos_ibfk_2` (`id_docente`),
  KEY `grupos_ibfk_3` (`salon_id`),
  CONSTRAINT `grupos_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id`),
  CONSTRAINT `grupos_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `grupos_ibfk_3` FOREIGN KEY (`salon_id`) REFERENCES `salones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id` int NOT NULL,
  `alumno_id` varchar(20) NOT NULL,
  `grupo_id` varchar(10) NOT NULL,
  `fecha_inscripcion` date NOT NULL,
  `periodo` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alumno_id_2` (`alumno_id`,`grupo_id`),
  KEY `inscripciones_ibfk_2` (`grupo_id`),
  CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`),
  CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kardex`
--

DROP TABLE IF EXISTS `kardex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kardex` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_id` varchar(20) NOT NULL,
  `materia_id` varchar(20) NOT NULL,
  `calificacion` int NOT NULL,
  `oportunidad` enum('O1','O2','O3') NOT NULL,
  `periodo` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kardex_ibfk_1` (`alumno_id`),
  KEY `kardex_ibfk_2` (`materia_id`),
  CONSTRAINT `kardex_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`),
  CONSTRAINT `kardex_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kardex_temporal`
--

DROP TABLE IF EXISTS `kardex_temporal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kardex_temporal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_id` varchar(20) NOT NULL,
  `grupo_id` varchar(10) NOT NULL,
  `materia_id` varchar(20) NOT NULL,
  `calificacion` int DEFAULT NULL,
  `estado` enum('sin_capturar','no_asentada','asentada') DEFAULT NULL,
  `oportunidad` enum('O1','O2','O3') DEFAULT NULL,
  `periodo` varchar(30) NOT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alumno_id` (`alumno_id`,`grupo_id`),
  KEY `kardex_temporal_ibfk_2` (`grupo_id`),
  KEY `kardex_temporal_ibfk_3` (`materia_id`),
  CONSTRAINT `kardex_temporal_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`),
  CONSTRAINT `kardex_temporal_ibfk_2` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`),
  CONSTRAINT `kardex_temporal_ibfk_3` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias` (
  `id` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `creditos` varchar(2) DEFAULT NULL,
  `semestre` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `materias_por_carrera`
--

DROP TABLE IF EXISTS `materias_por_carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias_por_carrera` (
  `carrera_id` varchar(20) NOT NULL,
  `materia_id` varchar(20) NOT NULL,
  `semestre` int NOT NULL,
  PRIMARY KEY (`carrera_id`,`materia_id`),
  KEY `materias_por_carrera_ibfk_2` (`materia_id`),
  CONSTRAINT `materias_por_carrera_ibfk_1` FOREIGN KEY (`carrera_id`) REFERENCES `carreras` (`id`),
  CONSTRAINT `materias_por_carrera_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `materias_por_especialidad`
--

DROP TABLE IF EXISTS `materias_por_especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias_por_especialidad` (
  `especialidad_id` int NOT NULL,
  `materia_id` varchar(20) NOT NULL,
  PRIMARY KEY (`especialidad_id`,`materia_id`),
  KEY `fk_mpe_materia` (`materia_id`),
  CONSTRAINT `fk_mpe_especialidad` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_mpe_materia` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_id` varchar(20) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `referencia_pago` varchar(50) DEFAULT NULL,
  `metodo_pago` enum('ventanilla','online') NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`),
  KEY `pagos_ibfk_1` (`alumno_id`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prerrequisitos`
--

DROP TABLE IF EXISTS `prerrequisitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prerrequisitos` (
  `materia_id` varchar(20) NOT NULL,
  `prerequisito_id` varchar(20) NOT NULL,
  PRIMARY KEY (`materia_id`,`prerequisito_id`),
  KEY `prerrequisitos_ibfk_2` (`prerequisito_id`),
  CONSTRAINT `prerrequisitos_ibfk_1` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `prerrequisitos_ibfk_2` FOREIGN KEY (`prerequisito_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reinscripcion_config`
--

DROP TABLE IF EXISTS `reinscripcion_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reinscripcion_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `costo` decimal(10,2) NOT NULL,
  `mensaje_info` text,
  `visible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salones`
--

DROP TABLE IF EXISTS `salones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salones` (
  `id` int NOT NULL,
  `clave` varchar(10) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `capacidad` int NOT NULL,
  `tipo` enum('Aula','Laboratorio','Auditorio','Sala de Juntas') NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  UNIQUE KEY `clave` (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_id` varchar(10) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `instrucciones` text NOT NULL,
  `fecha_publicacion` timestamp NULL DEFAULT NULL,
  `fecha_entrega` datetime NOT NULL,
  `valor_puntos` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tareas_grupo` (`grupo_id`),
  CONSTRAINT `fk_tareas_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `grupos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` varchar(20) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `nombre_completo` varchar(100) DEFAULT NULL,
  `rol` enum('alumno','docente','administrativo','aspirante') NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `numero_control` varchar(20) DEFAULT NULL,
  `estado` enum('activo','no activo','bloqueado') NOT NULL DEFAULT 'activo',
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_UNIQUE` (`usuario`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `usuario_2` (`usuario`),
  UNIQUE KEY `usuario_3` (`usuario`),
  UNIQUE KEY `usuario_4` (`usuario`),
  UNIQUE KEY `usuario_5` (`usuario`),
  UNIQUE KEY `usuario_6` (`usuario`),
  UNIQUE KEY `usuario_7` (`usuario`),
  UNIQUE KEY `usuario_8` (`usuario`),
  UNIQUE KEY `usuario_9` (`usuario`),
  UNIQUE KEY `usuario_10` (`usuario`),
  UNIQUE KEY `usuario_11` (`usuario`),
  UNIQUE KEY `usuario_12` (`usuario`),
  UNIQUE KEY `usuario_13` (`usuario`),
  UNIQUE KEY `usuario_14` (`usuario`),
  UNIQUE KEY `usuario_15` (`usuario`),
  UNIQUE KEY `usuario_16` (`usuario`),
  UNIQUE KEY `usuario_17` (`usuario`),
  UNIQUE KEY `usuario_18` (`usuario`),
  UNIQUE KEY `usuario_19` (`usuario`),
  UNIQUE KEY `usuario_20` (`usuario`),
  UNIQUE KEY `usuario_21` (`usuario`),
  UNIQUE KEY `usuario_22` (`usuario`),
  UNIQUE KEY `usuario_23` (`usuario`),
  UNIQUE KEY `usuario_24` (`usuario`),
  UNIQUE KEY `usuario_25` (`usuario`),
  UNIQUE KEY `usuario_26` (`usuario`),
  UNIQUE KEY `usuario_27` (`usuario`),
  UNIQUE KEY `usuario_28` (`usuario`),
  UNIQUE KEY `usuario_29` (`usuario`),
  UNIQUE KEY `usuario_30` (`usuario`),
  UNIQUE KEY `usuario_31` (`usuario`),
  UNIQUE KEY `numero_control` (`numero_control`),
  UNIQUE KEY `numero_control_2` (`numero_control`),
  UNIQUE KEY `numero_control_3` (`numero_control`),
  UNIQUE KEY `numero_control_4` (`numero_control`),
  UNIQUE KEY `numero_control_5` (`numero_control`),
  UNIQUE KEY `numero_control_6` (`numero_control`),
  UNIQUE KEY `numero_control_7` (`numero_control`),
  UNIQUE KEY `numero_control_8` (`numero_control`),
  UNIQUE KEY `numero_control_9` (`numero_control`),
  UNIQUE KEY `numero_control_10` (`numero_control`),
  UNIQUE KEY `numero_control_11` (`numero_control`),
  UNIQUE KEY `numero_control_12` (`numero_control`),
  UNIQUE KEY `numero_control_13` (`numero_control`),
  UNIQUE KEY `numero_control_14` (`numero_control`),
  UNIQUE KEY `numero_control_15` (`numero_control`),
  UNIQUE KEY `numero_control_16` (`numero_control`),
  UNIQUE KEY `numero_control_17` (`numero_control`),
  UNIQUE KEY `numero_control_18` (`numero_control`),
  UNIQUE KEY `numero_control_19` (`numero_control`),
  UNIQUE KEY `numero_control_20` (`numero_control`),
  UNIQUE KEY `numero_control_21` (`numero_control`),
  UNIQUE KEY `numero_control_22` (`numero_control`),
  UNIQUE KEY `numero_control_23` (`numero_control`),
  UNIQUE KEY `numero_control_24` (`numero_control`),
  UNIQUE KEY `numero_control_25` (`numero_control`),
  UNIQUE KEY `numero_control_26` (`numero_control`),
  UNIQUE KEY `numero_control_27` (`numero_control`),
  UNIQUE KEY `numero_control_28` (`numero_control`),
  UNIQUE KEY `numero_control_29` (`numero_control`),
  UNIQUE KEY `numero_control_30` (`numero_control`),
  UNIQUE KEY `numero_control_31` (`numero_control`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-15 18:20:43
