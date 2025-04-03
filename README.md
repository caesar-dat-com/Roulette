# 🎰 Roulette Virtual Casino Microservices 🎲

## 👀 Overview

¡Bienvenido al **Roulette Virtual Casino**! Este proyecto es una demostración de un sistema basado en microservicios para un casino virtual centrado en la **ruleta**.  
La idea es simular un entorno de juego donde los usuarios pueden apostar, jugar a la ruleta y obtener resultados, mientras se registran transacciones, se aplican bonificaciones y se generan estadísticas. Cada funcionalidad se implementa en un microservicio independiente para facilitar la escalabilidad y el mantenimiento. 🚀

---

## 🎯 Objetivo del Proyecto

- **Microservicios independientes:**  
  Cada servicio maneja una responsabilidad específica (usuarios, ruleta, bonificaciones, transacciones, estadísticas y eventos).  
- **API REST:**  
  Los microservicios se comunican a través de endpoints REST, permitiendo la integración con clientes como Postman o una interfaz web.  
- **Entorno de casino virtual:**  
  Permite registrar usuarios, realizar apuestas en la ruleta y ver resultados, bonificaciones y estadísticas.  
- **Preparación para el futuro:**  
  Base sólida para integrar un API Gateway, bases de datos, autenticación avanzada, y mucho más. 💪

---

## 🧠 Identificación del Problema

Muchas plataformas de simulación de apuestas carecen de estructuras modulares que permitan:
- Escalar funcionalidades.
- Medir resultados estadísticos en tiempo real.
- Personalizar eventos y recompensas.

Esta ausencia de flexibilidad limita la capacidad de adaptación a nuevos juegos, reglas o segmentos de usuarios.

### 🧩 Necesidades Detectadas

- Simular un entorno de apuestas seguro y sin dinero real.
- Gestionar distintos tipos de usuarios con roles específicos.
- Visualizar estadísticas del sistema para análisis de resultados.
- Aplicar bonificaciones y eventos promocionales programables.
- Contar con una arquitectura mantenible, escalable y desacoplada.

---

## 🛠️ Características Actuales

### 👤 Users (Puerto 3001)
- **Funcionalidad:**  
  Creación, consulta, actualización y validación de usuarios.
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
  Inicia partidas de ruleta, ejecuta giros y genera resultados aleatorios (0 a 36).  
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
  Gestión de bonificaciones como giros gratis o multiplicadores.
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
  Registra transacciones de apuestas y ganancias, asociadas a usuarios y partidas.
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
  Ofrece datos estadísticos globales y por usuario (número de partidas, dinero apostado, etc.).
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
  Gestiona eventos especiales, como "Double Hour" (donde las ganancias se duplican).
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

---

## 👥 Comportamiento del Sistema por Tipo de Usuario

### 🧑‍🎲 Usuario: Jugador
- **Historias de usuario:**
  - "Como jugador, quiero registrarme para poder acceder a la ruleta virtual y recibir bonificaciones."
  - "Como jugador, quiero jugar una partida de ruleta para obtener recompensas."
  - "Como jugador, quiero ver mis estadísticas de juego para saber cuántas veces he ganado."
- **Acciones posibles:**
  - **Registrarse:** Users → `POST /usuarios`
  - **Consultar datos propios:** Users → `GET /usuarios/:id`
  - **Apostar en la ruleta:** Roulette → `POST /apostar`
  - **Ver resultados:** Roulette → `GET /resultados`
  - **Reclamar bonificaciones:** Bonuses → `GET /bonificaciones/:id`
  - **Ver eventos actuales:** Events → `GET /eventos`
  - **Ver estadísticas globales:** Statistics → `GET /estadisticas`

### 🛡️ Usuario: Administrador
- **Historias de usuario:**
  - "Como administrador, quiero ver todos los usuarios registrados para hacer seguimiento de su actividad."
  - "Como administrador, quiero crear eventos promocionales para atraer más jugadores."
  - "Como administrador, quiero consultar estadísticas generales para analizar tendencias."
- **Acciones posibles:**
  - **Ver todos los usuarios:** Users → `GET /usuarios`
  - **Crear/editar eventos:** Events → `POST /eventos`
  - **Crear/editar bonificaciones:** Bonuses → `POST /bonificaciones`
  - **Consultar estadísticas globales:** Statistics → `GET /estadisticas`

---

## 📂 Estructura del Proyecto

El repositorio está organizado de la siguiente manera:

```
Roulette/
│
├── Services/                         ← Microservicios Backend (Node.js)
│   ├── bonuses/
│   │   ├── index.js                  (Puerto 3003)
│   │   ├── package.json
│   │   └── package-lock.json
│   ├── events/
│   │   ├── index.js                  (Puerto 3006)
│   │   ├── package.json
│   │   └── package-lock.json
│   ├── roulette/
│   │   ├── index.js                  (Puerto 3002)
│   │   ├── package.json
│   │   └── package-lock.json
│   ├── statistics/
│   │   ├── index.js                  (Puerto 3005)
│   │   ├── package.json
│   │   └── package-lock.json
│   ├── transactions/
│   │   ├── index.js                  (Puerto 3004)
│   │   ├── package.json
│   │   └── package-lock.json
│   └── users/
│       ├── index.js                  (Puerto 3001)
│       ├── package.json
│       └── package-lock.json
│
├── BD postgres/                      ← Scripts SQL para bases de datos
│   ├── BDbonificaciones.sql
│   ├── BDestadisticas.sql
│   ├── BDeventos.sql
│   ├── BDroulette.sql
│   └── BDusers.sql
│
├── postman/                          ← Colección de Postman para probar las APIs
│   └── Roulette_Microservices.postman_collection.json
│
├── roulette-frontend/                ← Frontend del proyecto (React)
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── App.css
│       ├── App.js                  ← Configuración de rutas con React Router
│       ├── App.test.js
│       ├── index.css
│       ├── index.js                ← Punto de entrada del frontend
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       ├── components/             ← Componentes reutilizables
│       │   └── ExampleComponent.js ← Ejemplo de consumo de API (Users)
│       ├── pages/                  ← Páginas principales
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Dashboard.js
│       │   ├── RouletteGame.js
│       │   └── Stats.js
│       └── services/               ← Configuración de APIs para cada microservicio
│           ├── usersApi.js         (Puerto 3001)
│           ├── rouletteApi.js      (Puerto 3002)
│           ├── bonusesApi.js       (Puerto 3003)
│           ├── transactionsApi.js  (Puerto 3004)
│           ├── statisticsApi.js    (Puerto 3005)
│           └── eventsApi.js        (Puerto 3006)
│
└── README.md                         ← Este archivo de documentación
```

**diagrama de comunicacion entre microservicios**

Estadísticas
├── Consulta a Roulette → Historial de partidas
├── Consulta a Users → Datos del jugador
├── Consulta a Bonificaciones → Uso de bonos
└── Consulta a Eventos → Participación en eventos

Roulette
├── Verifica en Users → Identidad del jugador
└── Consulta en Bonificaciones → Bonificación activa

Eventos
└── Consulta en Users → Confirmar usuario participante

Bonificaciones
└── Asigna a Users → Registro de bonificaciones otorgadas

---

## 🚀 Cómo Poner en Marcha el Proyecto

### 🧰 Requisitos Previos

- **Node.js** instalado.
- **PostgreSQL** instalado y corriendo (recomendado v13+).
- **pgAdmin** (opcional, para gestionar bases de datos).
- **Git** para clonar el repositorio.
- **Postman** para probar las APIs.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/caesar-dat-com/Roulette.git
```

### 2. Configurar las Bases de Datos

Desde cada base, abra la opción "Query Tool" en pgAdmin y ejecute el archivo SQL correspondiente (ubicados en la carpeta `BD postgres/`):

- BDusers.sql
- BDroulette.sql
- BDbonificaciones.sql
- BDestadisticas.sql
- BDeventos.sql

**Opción B: vía terminal de PostgreSQL**

```bash
psql -U postgres -d Users -f "BD postgres/BDusers.sql"
psql -U postgres -d Roulette -f "BD postgres/BDroulette.sql"
psql -U postgres -d Bonificaciones -f "BD postgres/BDbonificaciones.sql"
psql -U postgres -d Estadisticas -f "BD postgres/BDestadisticas.sql"
psql -U postgres -d Eventos -f "BD postgres/BDeventos.sql"
```

### 3. Configurar la Conexión a la Base de Datos en Cada Microservicio

Dentro de cada carpeta de microservicio (por ejemplo, `Services/users`), cree un archivo `.env` con la siguiente configuración (ajuste los valores según corresponda):

```
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=tu_contraseña
PG_DATABASE=NombreBaseDeDatosCorrespondiente
```

### 4. Instalar Dependencias y Ejecutar los Microservicios

Para cada microservicio (ubicados en `Roulette/Services/`):

1. Navegue a la carpeta del microservicio:
   ```bash
   cd Roulette/Services/users
   ```
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Inicie el microservicio:
   ```bash
   node index.js
   ```
   *(O use `npm start` si está configurado en `package.json`)*

Repita el proceso para los microservicios:
- **users** (Puerto 3001)
- **roulette** (Puerto 3002)
- **bonuses** (Puerto 3003)
- **transactions** (Puerto 3004)
- **statistics** (Puerto 3005)
- **events** (Puerto 3006)

Verifique que cada microservicio muestre mensajes indicando que está corriendo en su puerto correspondiente.

### 5. Iniciar el Frontend

El frontend se encuentra en la carpeta `Roulette/roulette-frontend`.

1. Navegue a la carpeta del frontend:
   ```bash
   cd Roulette/roulette-frontend
   ```
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Inicie el servidor de desarrollo:
   ```bash
   npm start
   ```
   Esto abrirá la aplicación en `http://localhost:3000`.

### 6. Importar la Colección de Postman

- Abra Postman.
- Haga clic en **"Import"** y seleccione el archivo `Roulette_Microservices.postman_collection.json` (ubicado en la carpeta `postman/`).
- Verifique que aparezcan las carpetas correspondientes a cada microservicio (Users, Roulette, Bonuses, Transactions, Statistics, Events).

### 7. Probar los Endpoints

Utilice Postman para enviar peticiones a cada microservicio y verificar que las respuestas sean las esperadas. Por ejemplo, para crear un usuario, utilice la solicitud `POST /usuarios` con el cuerpo adecuado.


---

## 🔮 Futuras Mejoras

- **Integración entre microservicios:**  
  Conectar servicios (por ejemplo, que Roulette valide el usuario mediante el microservicio de Users) para lograr un flujo completo.
- **Persistencia de Datos:**  
  Integrar una base de datos robusta para almacenar usuarios, transacciones y otros datos.
- **API Gateway:**  
  Desarrollar un API Gateway para centralizar y proteger las peticiones.
- **Autenticación y Seguridad:**  
  Mejorar la seguridad con autenticación y autorización avanzada (por ejemplo, JWT).
- **Monitorización y Logging:**  
  Agregar herramientas para monitorear el rendimiento y registrar logs de cada microservicio.

---

## Conclusión

Este proyecto demuestra una arquitectura basada en microservicios para un casino virtual de ruleta, donde:
- Cada microservicio (Users, Roulette, Bonuses, Transactions, Statistics, Events) se ejecuta de forma independiente en su puerto asignado.
- El frontend, desarrollado en React, se conecta a estos microservicios a través de Axios.
- Se han proporcionado scripts SQL y una colección de Postman para facilitar las pruebas.

Siga los pasos anteriores para instalar y ejecutar el proyecto, y disfrute de su **Roulette Virtual Casino Microservices**.

---

¡Happy hacking!
