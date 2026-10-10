<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Site Survey Telecom Pro — Guía de Despliegue Universal

Aplicación integral para auditorías de telecomunicaciones (Site Surveys), cálculo de alimentadores DC, diagramas de distribución de caseta técnica y generación de reportes técnicos oficiales PDF de 6 páginas con Nokia y Tigo.

Compatible con **cualquier servidor** (Linux, Windows Server, macOS, Docker, Nginx, Apache, Cloud Run, Render, Railway, VPS o servidor local).

---

## 🚀 Métodos de Despliegue

### Opción 1: Despliegue Universal con Docker (Recomendado)
Funciona de forma idéntica en cualquier servidor (Ubuntu, Debian, CentOS, RHEL, Windows, AWS, Google Cloud, DigitalOcean):

```bash
# 1. Construir la imagen de producción
docker build -t site-survey-telecom .

# 2. Iniciar el contenedor en el puerto deseado (ej: puerto 3000 u 80)
docker run -d --name site-survey -p 3000:3000 -e GEMINI_API_KEY="tu_api_key_opcional" --restart always site-survey-telecom
```

Acceda inmediatamente en `http://ip-de-su-servidor:3000`.

---

### Opción 2: Servidor Node.js (VPS, Linux, Windows, macOS)

**Requisitos:** Node.js 18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional)
cp .env.example .env
# Edite .env con su GEMINI_API_KEY si desea el asistente de normas RETIE en vivo

# 3. Compilar los activos estáticos optimizados
npm run build

# 4. Iniciar el servidor en producción
npm start
```

#### Para mantener el proceso activo siempre (PM2 en Linux/VPS):
```bash
npm install -g pm2
pm2 start server.ts --name "site-survey-app" --interpreter node
pm2 save
pm2 startup
```

---

### Opción 3: Detrás de un Proxy Inverso (Nginx)
El proyecto incluye un archivo `nginx.conf` listo para usar:
1. Copie `nginx.conf` a `/etc/nginx/sites-available/site-survey.conf`.
2. Habilite el sitio con `ln -s /etc/nginx/sites-available/site-survey.conf /etc/nginx/sites-enabled/`.
3. Reinicie Nginx con `sudo systemctl restart nginx`.

---

### Opción 4: Servidor Web Estático (Apache / cPanel / IIS)
Si desea alojar únicamente el frontend sin Node.js:
1. Ejecute `npm run build`.
2. Suba el contenido de la carpeta `/dist` a su carpeta pública (`public_html` o `www`).
3. El archivo `.htaccess` ya está incluido en `/public` y se copia automáticamente a `/dist`, asegurando que la navegación SPA funcione sin errores 404 al recargar páginas.

---

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto HTTP en el que escucha el servidor | `3000` |
| `HOST` | Interfaz de red de enlace | `0.0.0.0` (todas las interfaces) |
| `GEMINI_API_KEY` | Clave API de Google AI para el Asistente Técnico y búsqueda en vivo | Opcional (el resto de la app funciona 100% sin clave) |
| `NODE_ENV` | Entorno de ejecución (`production` / `development`) | `production` |

---

## 🩺 Verificación de Salud (Health Checks)
Ideal para balanceadores de carga, Kubernetes y Docker:
- `GET /health` → Devuelve `{ status: 'healthy', uptime: ..., timestamp: ... }`
- `GET /api/health` → Devuelve estado detallado del servidor y diagnóstico de clave API.

