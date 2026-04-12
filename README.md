# 🏢 App Timbre QR

Sistema de portero electrónico digital basado en código QR que permite centralizar la comunicación entre visitantes y residentes mediante aplicaciones web y mobile, sin necesidad de hardware tradicional.

---

## 📌 Descripción

Portero QR permite que un visitante escanee un código QR ubicado en la entrada del edificio, seleccione el departamento y notifique su llegada al residente a través de distintos canales (push, email, etc.).

El residente recibe la notificación en su app y puede gestionar cómo quiere ser contactado.

---

## 🧩 Arquitectura del sistema

El sistema está compuesto por tres módulos principales:

### 🌐 Web App (React)
- Acceso de visitantes mediante QR
- Panel de administración

### 📱 App Mobile (Ionic)
- Uso exclusivo para residentes
- Recepción de notificaciones
- Configuración de preferencias

### ⚙️ Backend (Node.js + Express)
- API REST centralizada
- Gestión de usuarios, departamentos y visitas
- Envío de notificaciones

### 🗄️ Base de datos
- Base de datos relacional SQL Server para almacenar usuarios, departamentos, visitas y configuraciones.
---

## 🛠️ Stack tecnológico

- Frontend Web: React
- Mobile: Ionic
- Backend: Node.js + Express
- Base de Datos: SQL Server (SQL)

---

## 📁 Estructura del proyecto (Monorepo)
