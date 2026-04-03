# Image Classifier - Frontend

# Integrantes del proyecto

* Josué Rojas
* Alejandro Solis

# Descripción del proyecto

* El proyecto corresponde a una aplicación web desarrollada con Next.js que permite al usuario cargar imágenes para ser analizadas mediante inteligencia artificial. La interfaz consume un backend externo para clasificar imágenes y mantiene el historial y el dataset de demostración en el navegador.

# Resumen teórico
* Las aplicaciones modernas utilizan arquitecturas desacopladas donde la interfaz de usuario consume servicios mediante APIs REST. Esto permite integrar modelos de inteligencia artificial sin mezclar la lógica visual con la lógica de procesamiento.
Next.js facilita la creación de interfaces reactivas y eficientes para este tipo de experiencias.

# Tecnologías utilizadas

* Next.js 16
* React
* TypeScript
* TailwindCSS
* PNPM
* Fetch API
* localStorage

# Diseño

* Usuario -> Interfaz Web -> Backend de clasificación

# Funciones principales:

* Carga de imágenes
* Envío mediante FormData
* Visualización de resultados
* Comunicación asincrónica con backend
* Historial local persistido en navegador
* Dataset de demostración gestionado en navegador

# Obstáculos encontrados

* Configuración de variables de entorno.
* Manejo correcto de solicitudes multipart/form-data.
* Ajuste de CORS entre frontend y backend externo.

# Conclusiones

* Mantener el proyecto como frontend puro simplifica su estructura y deja más clara la responsabilidad de cada capa.

# Instrucciones para ejecutar

* Instalar dependencias:

```pnpm install```

* Crear archivo:

```.env.local```

* Contenido:

```NEXT_PUBLIC_API_URL=http://localhost:8000```

* Ejecutar: **Hay que tener habilitado pnpm**

```pnpm run dev```

* Abrir:

# http://localhost:3000
