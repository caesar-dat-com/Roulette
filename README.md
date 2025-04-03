# 🎰 Roulette Virtual Casino Microservices 🎲

## 👀 Overview

¡Bienvenido al **Roulette Virtual Casino**! Este proyecto es una demostración de un sistema basado en microservicios para un casino virtual centrado en la **ruleta**.  
La idea es simular un entorno de juego donde los usuarios pueden apostar, jugar a la ruleta y obtener resultados, mientras se registran transacciones, se aplican bonificaciones y se generan estadísticas. Cada funcionalidad se implementa en un microservicio independiente para facilitar la escalabilidad y el mantenimiento. 🚀

---

## 🎯 Objetivo del Proyecto

- **Microservicios independientes:** Cada servicio maneja una responsabilidad específica (usuarios, ruleta, bonificaciones, transacciones, estadísticas y eventos).  
- **API REST:** Los microservicios se comunican a través de endpoints REST, permitiendo la integración con clientes como Postman o una interfaz web.  
- **Entorno de casino virtual:** Permite registrar usuarios, realizar apuestas en la ruleta y ver resultados, bonificaciones y estadísticas.  
- **Preparación para el futuro:** Base sólida para integrar un API Gateway, bases de datos, autenticación avanzada, y mucho más. 💪

---
## 🧠 Identificación del Problema

Actualmente, muchas plataformas de simulación de apuestas carecen de estructuras modulares que permitan escalar funcionalidades, medir resultados estadísticos en tiempo real o personalizar eventos y recompensas. Esta ausencia de flexibilidad limita la capacidad de adaptación a nuevos juegos, reglas o segmentos de usuarios.

### 🧩 Necesidades detectadas:
- Simular un entorno de apuestas seguro y sin dinero real.
- Gestionar distintos tipos de usuarios con roles específicos.
- Visualizar estadísticas del sistema para análisis de resultados.
- Aplicar bonificaciones y eventos promocionales programables.
- Contar con una arquitectura mantenible, escalable y desacoplada.


## 🛠️ Características Actuales

### 👤 Users (Puerto 3001)
- **Funcionalidad:**  
  - Creación, consulta, actualización y validación de usuarios.
- **Datos manejados:**  
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@mail.com",
    "alias": "JohnTheGambler",
    "password": "12345",
    "balance": 100
  }
  ```

### 🎡 Roulette (Puerto 3002)
- **Funcionalidad:**  
  - Inicia partidas de ruleta, ejecuta giros y genera resultados aleatorios (0 a 36).  
- **Datos manejados:**  
  ```json
  {
    "id": 1,
    "userId": 1,
    "betAmount": 50,
    "result": 23,
    "timestamp": "2025-04-01T10:00:00Z"
  }
  ```

### 🎁 Bonuses (Puerto 3003)
- **Funcionalidad:**  
  - Gestión de bonificaciones como giros gratis o multiplicadores.
- **Datos manejados:**  
  ```json
  {
    "id": 1,
    "type": "DoubleWin",
    "description": "Doubles your next win",
    "effect": "x2",
    "conditions": "User must have played at least 3 times today"
  }
  ```

### 💰 Transactions (Puerto 3004)
- **Funcionalidad:**  
  - Registra transacciones de apuestas y ganancias, asociadas a usuarios y partidas.
- **Datos manejados:**  
  ```json
  {
    "id": 1,
    "userId": 1,
    "amount": 50,
    "type": "bet",  // o "win"
    "rouletteId": 10,
    "timestamp": "2025-04-01T10:00:00Z"
  }
  ```

### 📊 Statistics (Puerto 3005)
- **Funcionalidad:**  
  - Ofrece datos estadísticos globales y por usuario (número de partidas, dinero apostado, etc.).
- **Datos manejados:**  
  ```json
  {
    "totalUsers": 100,
    "totalGamesPlayed": 500,
    "totalMoneyBet": 10000,
    "totalMoneyWon": 6000
  }
  ```

### 🎉 Events (Puerto 3006)
- **Funcionalidad:**  
  - Gestiona eventos especiales, como "Double Hour" (donde las ganancias se duplican).
- **Datos manejados:**  
  ```json
  {
    "id": 1,
    "name": "Double Hour",
    "description": "All wins are doubled between 10:00 and 11:00",
    "startTime": "2025-04-01T10:00:00Z",
    "endTime": "2025-04-01T11:00:00Z",
    "active": true
  }
  ```


👥 Comportamiento del Sistema por Tipo de Usuario
El sistema está diseñado para dos tipos de usuarios: Jugador y Administrador.
Cada uno interactúa con la aplicación de manera diferente, utilizando los microservicios según sus permisos y necesidades.

🧑‍🎲 Usuario: Jugador
Este es el usuario común que interactúa con la aplicación para divertirse, participar en rondas de ruleta y aprovechar bonificaciones.

🧩 Historias de usuario (Jugador):
“Como jugador, quiero registrarme para poder acceder a la ruleta virtual y recibir bonificaciones.”

“Como jugador, quiero jugar una partida de ruleta para obtener recompensas.”

“Como jugador, quiero ver mis estadísticas de juego para saber cuántas veces he ganado.”

🧪 Acciones posibles:
Acción	Microservicio	Endpoint sugerido
Registrarse	Users	POST /usuarios
Consultar datos propios	Users	GET /usuarios/:id
Apostar en la ruleta	Roulette	POST /apostar
Ver resultados	Roulette	GET /resultados
Reclamar bonificaciones	Bonificaciones	GET /bonificaciones/:id
Ver eventos actuales	Eventos	GET /eventos
Ver estadísticas globales	Estadísticas	GET /estadisticas
🛡️ Usuario: Administrador
El administrador es responsable de la gestión del sistema, visualización completa de resultados, creación de eventos y supervisión de usuarios.

🧩 Historias de usuario (Admin):
“Como administrador, quiero ver todos los usuarios registrados para hacer seguimiento de su actividad.”

“Como administrador, quiero crear eventos promocionales para atraer más jugadores.”

“Como administrador, quiero consultar estadísticas generales para analizar tendencias.”

🧪 Acciones posibles:
Acción	Microservicio	Endpoint sugerido
Ver todos los usuarios	Users	GET /usuarios
Crear/editar eventos	Eventos	POST /eventos
Crear/editar bonificaciones	Bonificaciones	POST /bonificaciones
Consultar estadísticas globales	Estadísticas	GET /estadisticas
🔁 Flujo básico (Jugador)
🔐 Se registra desde el microservicio Users.

🎲 Realiza apuestas llamando a Roulette.

🎁 Reclama recompensas en Bonificaciones.

📊 Consulta sus avances en Estadísticas.
---

## 📂 Estructura del Proyecto

La estructura del repositorio se organiza en carpetas separadas para cada microservicio dentro de la carpeta `Services`, y la base de datos de cada microservicio se encuentra en la carpeta `BD postgres`

```
Roulette/
│
├── Services/
│   ├── bonuses/
│   │   ├── index.js
│   │   └── package.json
│   ├── events/
│   │   ├── index.js
│   │   └── package.json
│   ├── roulette/
│   │   ├── index.js
│   │   └── package.json
│   ├── statistics/
│   │   ├── index.js
│   │   └── package.json
│   ├── transactions/
│   │   ├── index.js
│   │   └── package.json
│   └── users/
│       ├── index.js
│       └── package.json
│
├── BD postgres/
│   ├── BDonificaciones.sql
│   ├── BDestadisticas.sql
│   ├── BDeventos.sql
│   ├── BDroulette.sql
│   └── BDusers.sql
│
├── README.md
└── Roulette_Microservices.postman_collection.json

Cada carpeta contiene su propio código y dependencias (usando Node.js + Express). Además, se incluye una colección de Postman para facilitar las pruebas de cada endpoint. 📋

---

🚀 Cómo Poner en Marcha el Proyecto
🧰 Requisitos Previos
Node.js instalado 💻
PostgreSQL instalado y corriendo (recomendado v13+) 🐘
pgAdmin (opcional, para cargar las bases de datos de forma visual)
Git para clonar el repositorio 🐙
Postman para probar las APIs 📲

### Pasos de Instalación y Ejecución

1. **Clonar el Repositorio:**

   ```bash
   git clone https://github.com/caesar-dat-com/Roulette.git
   ```

2. **Desde cada base, abre la opción "Query Tool" y ejecuta el archivo .sql correspondiente, que se encuentra en la carpeta BD postgres/.**

- Opción B - vía terminal de PostgreSQL:

psql -U postgres -d Users -f "BD postgres/BDusers.sql"
psql -U postgres -d Roulette -f "BD postgres/BDroulette.sql"
psql -U postgres -d Bonificaciones -f "BD postgres/BDbonificaciones.sql"
psql -U postgres -d Estadisticas -f "BD postgres/BDestadisticas.sql"
psql -U postgres -d Eventos -f "BD postgres/BDeventos.sql"

3. Configurar la Conexión a la Base de Datos
Dentro de cada carpeta de microservicio, cree un archivo .env con su configuración PostgreSQL:

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=tu_contraseña
PG_DATABASE=NombreBaseDeDatosCorrespondiente

4. **Instalar Dependencias en Cada Microservicio:**

   Por cada carpeta de microservicio (por ejemplo, `Services/users`):

   ```bash
   cd Services/users
   npm install
   ```

   Repite el proceso para: `roulette`, `bonuses`, `transactions`, `statistics` y `events`.

5. **Ejecutar Cada Microservicio:**

   Abre una terminal separada para cada servicio y ejecuta:

   ```bash
   node index.js
   ```

   Verifica en cada terminal que aparezcan mensajes como:
   - **"Users microservice running on port 3001"**
   - **"Roulette microservice running on port 3002"**
   - **"Transactions microservice running on port 3004"**, etc. ✅

6. **Importar la Colección de Postman:**

   - Abre Postman.
   - Haz clic en **"Import"** y selecciona el archivo `Roulette_Microservices.postman_collection.json`.
   - Verifica que aparezcan las carpetas correspondientes a cada microservicio (Users, Roulette, Bonuses, Transactions, Statistics, Events).

7. **Probar los Endpoints:**

   - Selecciona cada solicitud en Postman y haz clic en **"Send"** para probar los endpoints.  
   - Por ejemplo, para **crear un usuario**, usa la solicitud "Create User" con el Body adecuado y revisa la respuesta.
   - Repite el proceso para todos los microservicios.

---

## 🔮 Futuras Mejoras

- **Integración entre microservicios:**  
  Conectar los servicios (por ejemplo, que Roulette valide el usuario mediante el microservicio de Users) para un flujo completo.
- **Persistencia de Datos:**  
  Integrar una base de datos para almacenar usuarios, transacciones y demás datos de forma persistente.
- **API Gateway:**  
  Desarrollar un API Gateway para centralizar y proteger las peticiones.
- **Autenticación y Seguridad:**  
  Mejorar la seguridad con autenticación y autorización avanzada.
- **Monitorización y Logging:**  
  Agregar herramientas para monitorear el rendimiento y los logs de cada microservicio.

