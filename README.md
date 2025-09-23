# CHAFATEC - Plataforma de Gestión Académica 🔒

Repositorio para el proyecto de la materia de Desarrollo Seguro de Software.

## 📝 Descripción del Proyecto

**CHAFATEC** es una plataforma web diseñada para la gestión de actividades académicas y administrativas de una institución educativa. Ofrece portales personalizados para distintos tipos de usuarios, como alumnos, personal administrativo/docente y aspirantes, garantizando un acceso seguro y diferenciado a las funcionalidades correspondientes.

---

## 🚀 Avance Actual

### Funcionalidades Implementadas
*   **Autenticación y Autorización:**
    *   [X] Módulo de Login con selección de rol (Alumno, Personal, Aspirante).
    *   [X] Módulo de Registro para nuevos usuarios (aspirantes).
    *   [X] Uso de JSON Web Tokens (JWT) para gestionar sesiones seguras.
    *   [X] Hashing de contraseñas en la base de datos con `bcrypt`.
    *   [X] Guardas de rutas en el frontend (`RoleGuard`) para proteger el acceso basado en el rol del usuario.
*   **Interfaz de Usuario:**
    *   [X] Página de inicio de sesión con diseño responsivo.
    *   [X] Formularios reactivos con validaciones básicas en el frontend.
    *   [X] Selector de tema (claro/oscuro).
*   **Backend:**
    *   [X] API REST con endpoints para registro (`/register`) y login (`/login`).
    *   [X] Conexión segura a la base de datos MySQL utilizando Sequelize.

### Tareas Pendientes
*   [ ] **Desarrollar Dashboards:**
    *   [ ] Crear el panel de control para `alumnos`.
    *   [ ] Crear el panel de control para `docentes` y `administrativos`.
*   [ ] **Mejorar Seguridad:**
    *   [ ] Implementar validación de entradas del lado del servidor (backend) para todos los endpoints.
    *   [ ] Añadir más reglas de validación robustas en los formularios del frontend.
*   [ ] **Alinear Roles:**
    *   [ ] Sincronizar el rol de registro en el backend (actualmente 'cliente') con el flujo de 'aspirante' del frontend.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:**
    *   Angular
    *   TypeScript
*   **Backend:**
    *   Node.js
    *   Express
    *   Sequelize (ORM)
    *   JSON Web Tokens (JWT)
    *   Bcrypt.js
*   **Base de Datos:**
    *   MySQL

---

## 🏃 Cómo Ejecutar el Proyecto

1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/PepeCharlesxb/AplicacionDesarrolloSeguro.git
    ```
2.  Navegar a la carpeta del proyecto:
    ```bash
    cd AplicacionDesarrolloSeguro
    ```
3.  Instalar dependencias en **ambas** carpetas (`frontend` y `backend`):
    ```bash
    # En la carpeta /backend
    cd backend
    npm install
    
    # En la carpeta /frontend
    cd ../frontend
    npm install
    ```
4.  Configurar las variables de entorno en el backend (crear un archivo `.env` si no existe).
5.  Ejecutar la aplicación (se necesitan dos terminales):
    ```bash
    # En una terminal, dentro de la carpeta /backend
    npm start 
    # o 'nodemon app.js' si tienes nodemon instalado
    
    # En otra terminal, dentro de la carpeta /frontend
    ng serve -o
    ```

!Logo de CHAFATEC