# FirmaFlow

Generador de nóminas y comprobantes PDF — aplicación desktop local construida con Electron, React, TailwindCSS y TypeScript.

## Stack

| Tecnología | Rol |
|---|---|
| Electron 28 | Shell desktop |
| React 18 + Vite | UI |
| TailwindCSS 3 | Estilos |
| TypeScript | Tipado estricto |
| jsPDF + autoTable | Generación de PDF |

## Inicio rápido

```bash
npm install
npm run dev
```

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Dev mode (Vite + Electron concurrentes) |
| `npm run build` | Build de producción + empaquetado |
| `npm run preview` | Preview del build web |

## F5 en VSCode

1. Abrir proyecto en VSCode
2. Presionar **F5** — seleccionar **"FirmaFlow: Dev"**
3. Vite arranca en background, Electron compila y lanza automáticamente

Para debug full (main + renderer):
- Seleccionar el compound **"FirmaFlow: Full Debug"**

## Funcionalidades

- Agregar personas con nombre, cédula, fechas, paquetes y valor
- Tabla dinámica con edición y eliminación inline
- Totales automáticos con formato monetario COP
- Validación de formulario con errores en tiempo real
- Generación PDF landscape A4 con:
  - Header corporativo con gradiente indigo
  - Tabla autoTable con líneas de firma manual por fila
  - Barra de total general
  - Footer: *Elaborado por: Valeria Peña* + fecha + línea de firma
- Toasts animados de feedback

## Estructura

```
electron/
  main.ts          # Proceso principal, carga dev o prod según NODE_ENV
  preload.ts       # Context bridge seguro
src/
  components/
    Header.tsx         # Logo + badge de estado
    PersonForm.tsx     # Formulario con validación
    PayrollTable.tsx   # Tabla dinámica + botón PDF
    ToastContainer.tsx # Notificaciones animadas
  hooks/
    usePayroll.ts      # Estado centralizado: CRUD, validación, toasts
  types/index.ts       # Person, FormData, Toast
  utils/
    formatters.ts      # COP currency, fechas, IDs
    pdfGenerator.ts    # jsPDF landscape A4
.vscode/
  launch.json          # F5 → FirmaFlow: Dev
  tasks.json           # Vite bg task + compile electron ts
  settings.json        # Tailwind IntelliSense, formatter
  extensions.json      # Extensiones recomendadas
```

## Build de producción

```bash
npm run build
```

Genera instalador en `release/` — NSIS en Windows, DMG en macOS, AppImage en Linux.

---

Elaborado para uso empresarial interno.
