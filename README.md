# 🌱 Image Classifier – Frontend

# Integrantes del proyecto

* Josué Rojas
* Alejandro Solis

# Descripción del proyecto

* El frontend corresponde a una aplicación web desarrollada con Next.js que permite al usuario cargar imágenes para ser analizadas mediante inteligencia artificial. La interfaz se comunica con una API REST encargada de procesar la imagen y devolver la clasificación obtenida.

# Resumen teórico
* Las aplicaciones modernas utilizan arquitecturas desacopladas donde la interfaz de usuario consume servicios mediante APIs REST. Esto permite integrar modelos de inteligencia artificial sin afectar la experiencia del usuario.
Next.js facilita la creación de interfaces reactivas y eficientes mediante renderizado híbrido.

# Tecnologías utilizadas

* Next.js 16
* React
* TypeScript
* TailwindCSS
* PNPM
* Fetch API

# Diseño

* Usuario → Interfaz Web → API NextJS → Backend FastAPI → Modelo IA

# Funciones principales:

* Carga de imágenes
* Envío mediante FormData
* Visualización de resultados
* Comunicación asincrónica con backend

# Obstáculos encontrados

* Configuración de variables de entorno.
* Integración entre Next.js y FastAPI.
* Manejo correcto de solicitudes multipart/form-data.
* Ajuste de CORS entre servicios locales.

# Conclusiones

* La integración entre Next.js y FastAPI demuestra cómo la inteligencia artificial puede incorporarse en aplicaciones web modernas manteniendo separación de responsabilidades y escalabilidad.

# Instrucciones para ejecutar

* Instalar dependencias:

```pnpm install```

* Crear archivo:

```.env.local```

* Contenido:

```NEXT_PUBLIC_API_URL=http://localhost:8000```

* Ejecutar: **¡Hay que tener habilitado el pnpm!**

```pnpm run dev```

* Abrir:

# http://localhost:3000
