<div align="center">
  <!-- Reemplaza la URL con el logo de tu proyecto -->
  <img src="/frontend/public/assets/CHAFATEC.png" alt="Logo de CHAFATEC" width="150">
  <h1>CHAFATEC - Plataforma de Gestión Académica</h1>
  <p><i>Un proyecto de Cuchipu Entertainment </i></p>
   <img src="/frontend/public/assets/default-profile.png" alt="Logo Cuchipu" width="100">
  <p>
    Una plataforma web segura para la gestión académica y administrativa, desarrollada con Angular y Node.js.
  </p>

  <!-- Badges de Tecnologías -->
  <p>
    <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">    
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize">
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  </p>
</div>

Repositorio para el proyecto de la materia de Desarrollo Seguro de Software.

---

## 📜 Descripción

**CHAFATEC** es una aplicación web diseñada para centralizar y simplificar la gestión de actividades académicas. Proporciona portales personalizados para **alumnos**, **personal (docente/administrativo)** y **aspirantes**, garantizando un acceso seguro y diferenciado a las funcionalidades que cada rol necesita.

---

## ✨ Características Implementadas

### 🔐 Seguridad y Autenticación
-   **Login por Roles**: Sistema de inicio de sesión que diferencia entre Alumno, Personal y Aspirante.
-   **Registro de Aspirantes**: Flujo de creación de cuentas para nuevos usuarios.
-   **Sesiones con JWT**: Uso de JSON Web Tokens para una gestión de sesiones segura y stateless.
-   **Hashing de Contraseñas**: Almacenamiento seguro de credenciales usando `bcrypt`.
-   **Rutas Protegidas**: Implementación de `RoleGuard` en Angular para proteger el acceso a las vistas según el rol del usuario.

### 🎨 Interfaz de Usuario
-   **Diseño Responsivo**: Interfaz de login adaptable a diferentes tamaños de pantalla.
-   **Formularios Reactivos**: Uso de formularios de Angular con validaciones en tiempo real.
-   **Selector de Tema**: Opción para cambiar entre modo claro y oscuro.

### ⚙️ Backend
-   **API RESTful**: Endpoints para registro (`/register`) y login (`/login`).
-   **Conexión Segura a BD**: Uso de Sequelize para interactuar de forma segura con la base de datos MySQL.

---

## 📋 Roadmap

-   **🖥️ Desarrollo de Dashboards**:
    -   [x] Crear el panel de control para `alumnos`.
    -   [x] Crear el panel de control para `personal` (docentes y administrativos).
-   **🛡️ Mejoras de Seguridad**:
    -   [x] Implementar validación de entradas en el **backend** para todos los endpoints.
    -   [x] Añadir reglas de validación más robustas en los formularios del **frontend**.
-   **🔄 Sincronización de Roles**:
    -   [x] Alinear el rol de registro en el backend con el flujo de 'aspirante'.

---

## 🚀 Guía de Inicio Rápido

### Prerrequisitos
-   Node.js (v18 o superior)
-   Angular CLI (`npm install -g @angular/cli`)
-   Una instancia de MySQL en ejecución.

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```sh
    git clone https://github.com/PepeCharlesxb/AplicacionDesarrolloSeguro.git
    cd AplicacionDesarrolloSeguro
    ```

2.  **Instala las dependencias del Backend:**
    ```sh
    cd backend
    npm install
    ```

3.  **Instala las dependencias del Frontend:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Configura las variables de entorno del Backend:**
    -   Navega a la carpeta `backend`.
    -   Crea un archivo `.env` a partir del ejemplo `.env.example` (si existe) o créalo desde cero.
    -   Añade las credenciales de tu base de datos:
        ```env
        DB_NAME=tu_base_de_datos
        DB_USER=tu_usuario
        DB_PASSWORD=tu_contraseña
        DB_HOST=localhost
        JWT_SECRET=tu_secreto_para_jwt
        ```

5.  **Ejecuta la aplicación (requiere 2 terminales):**

    -   **Terminal 1 (Backend):**
        ```sh
        # Desde la carpeta /backend
        npm start
        ```

    -   **Terminal 2 (Frontend):**
        ```sh
        # Desde la carpeta /frontend
        ng serve -o
        ```

¡La aplicación debería abrirse automáticamente en `http://localhost:4200`!

---

## 👨‍💻 Colaboradores

-   **Carlos P.M.** - _Desarrollo Full-Stack_

---
