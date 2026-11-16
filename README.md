# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Módulo de gestión de ingredientes

Este módulo permite administrar los ingredientes asociados a las recetas del Recetario Caucano. Fue desarrollado utilizando React y se comunica con el backend mediante solicitudes HTTP a la API REST.

### Funcionalidades

- **Listar:** consultar los ingredientes registrados.
- **Crear:** registrar nuevos ingredientes y asociarlos a una receta.
- **Consultar recetas:** seleccionar la receta a la que pertenece cada ingrediente.
- **Editar:** modificar la información de un ingrediente existente.
- **Eliminar:** eliminar ingredientes registrados.

### Información de los ingredientes

Cada ingrediente maneja los siguientes campos:

| Campo | Descripción |
|---|---|
| nombre | Nombre del ingrediente. |
| cantidad | Cantidad requerida. |
| unidad_medida | Unidad de medida utilizada. |
| receta | Receta a la que pertenece. |
| es_opcional | Indica si el ingrediente es opcional. |

### Comunicación con el backend

El módulo utiliza los siguientes endpoints:

- `GET /api/ingredientes/`: consultar ingredientes.
- `POST /api/ingredientes/`: registrar un ingrediente.
- `PUT /api/ingredientes/{id}/`: actualizar un ingrediente.
- `DELETE /api/ingredientes/{id}/`: eliminar un ingrediente.
- `GET /api/recetas/`: consultar las recetas disponibles.

### Ejecución del frontend

Para iniciar el proyecto, ejecutar:

```bash
npm install
npm run dev
```

La aplicación se comunica con el backend Django mediante la dirección configurada en `src/services/api.js`.