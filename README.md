# Frontend Project - Next.js

Este proyecto es una aplicación frontend desarrollada utilizando **Next.js**. El objetivo principal es implementar una interfaz moderna y funcional para la gestión de proyectos, tareas y usuarios.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │       ├── loading.tsx
│   │   │       ├── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   ├── loading.tsx
│   │   │   ├── page.tsx
│   │   ├── users/
│   │       ├── loading.tsx
│   │       ├── page.tsx
│   ├── login/
│       └── page.tsx
├── components/
│   ├── app-sidebar.tsx
│   ├── auth-provider.tsx
│   ├── comment-dialog.tsx
│   ├── header.tsx
│   ├── notifications-dropdown.tsx
│   ├── project-dialog.tsx
│   ├── task-card.tsx
│   ├── task-dialog.tsx
│   ├── theme-provider.tsx
│   ├── user-dialog.tsx
│   ├── user-options-dropdown.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── public/
│   ├── inlaze-logo.png
│   ├── inlaze-ze-logo.png
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── services/
│   ├── api.ts
│   ├── auth-service.ts
│   ├── comment-service.ts
│   ├── index.ts
│   ├── notification-service.ts
│   ├── project-service.ts
│   ├── task-service.ts
│   └── user-service.ts
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Principales Archivos y Carpetas

- **`app/`**: Contiene las páginas y layouts de la aplicación.
- **`components/`**: Componentes reutilizables para la interfaz de usuario.
- **`hooks/`**: Hooks personalizados para lógica específica.
- **`lib/`**: Utilidades y funciones auxiliares.
- **`services/`**: Servicios para manejar la lógica de negocio y comunicación con APIs.
- **`styles/`**: Archivos CSS para estilos globales.
- **`public/`**: Archivos estáticos como imágenes.
- **`tailwind.config.ts`**: Configuración de Tailwind CSS.
- **`next.config.mjs`**: Configuración de Next.js.

## Lógica y Funcionamiento

La aplicación implementa un sistema de gestión de proyectos, tareas y usuarios. A continuación, se describe la lógica principal:

1. **Gestión de Proyectos**:
   - Los proyectos se gestionan desde la página `/dashboard/projects`.
   - Los datos de los proyectos se obtienen utilizando `project-service.ts`.

2. **Gestión de Tareas**:
   - Las tareas se gestionan desde la página `/dashboard/tasks`.
   - Los datos de las tareas se obtienen utilizando `task-service.ts`.

3. **Gestión de Usuarios**:
   - Los usuarios se gestionan desde la página `/dashboard/users`.
   - Los datos de los usuarios se obtienen utilizando `user-service.ts`.

4. **Autenticación**:
   - La autenticación se maneja utilizando el componente `auth-provider.tsx`.

5. **Estilos**:
   - Los estilos globales están definidos en `app/globals.css`.

## Despliegue

### Entorno de Desarrollo

Para ejecutar el proyecto en un entorno de desarrollo, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/snzxvss/frontend-inlaze-prueba.git
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   pnpm run dev
   ```

4. Abre tu navegador en `http://localhost:3000` para ver la aplicación.

### Entorno de Producción

Para desplegar el proyecto en un entorno de producción:

1. Genera los archivos estáticos:
   ```bash
   pnpm run build
   ```

2. Los archivos generados estarán en la carpeta `.next/`. Puedes servir esta carpeta utilizando cualquier servidor web estático, como Nginx o Apache.

3. Configura tu servidor para servir los archivos desde la carpeta `.next/`.

## URL del Repositorio

El código fuente del proyecto está disponible en el siguiente repositorio de GitHub:

[https://github.com/snzxvss/frontend-inlaze-prueba](https://github.com/snzxvss/frontend-inlaze-prueba)

---

Desarrollado por **Camilo Sanz**.
