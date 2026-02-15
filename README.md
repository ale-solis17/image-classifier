# Instalar dependencias

* Si no tienes pnpm instalado, hay que instalarlo

1. Abrir un PowerShell en modo administrador
2. Ejecutar estos comandos:
   ```
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
3. Verificar que se haya instalado correctamente: ```pnpm -v```   
   **Si se instaló correctamente, debe mostrar la versión.**
4. Instalar dependencias: ```pnpm install```

# Ejecutar proyecto

* **¡Hay que tener habilitado el pnpm!**

Ejecutar proyecto development: ```pnpm run dev```

# Estructura del proyecto

| Ruta        | Contenido                                                                | Carpetas importantes dentro | Explicación                                                                                                                    |
|-------------|--------------------------------------------------------------------------|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| /app        | Contiene la mayoría del app (Lógica,API y página principal del Frontend) | /classify /dataset /history | Las carpetas contienen la lógica principal del app, el page.tsx es la página principal del app                                 |
| /components | Componentes de la app (Buttons, Boxes, etc...)                           | /ui                         | Aquí se almacenan todos los componentes                                                                                        |
| /hooks      | Cambios en un componente ya renderizado sin utilizar clases              | N/A                         | N/A                                                                                                                            |
| /src        | Utilización de funciones para el frontend                                | /lib /api                   | Utiliza los fetch para el frontend (El usuario interactua en el frontend y manda a llamar a /lib/api para utilizar el Backend) |
| /styles     | Estilos globales, diseño en Tailwind                                     | globals.css                 | Aquí se almacenan todos los estilos que se utilizan de manera global, si se requiere un estilo específico crear otro CSS       |

> Lo más importante:
>> [Puto el que lo clickea](https://geektyper.com/fallout/)

