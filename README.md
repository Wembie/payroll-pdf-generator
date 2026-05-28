# FirmaFlow

Generador de nóminas y comprobantes PDF — aplicación desktop/web construida con Electron, React, TailwindCSS y TypeScript.

## Stack

| Tecnología | Rol |
|---|---|
| Electron 28 | Shell desktop |
| React 18 + Vite | UI |
| TailwindCSS 3 | Estilos + dark mode |
| TypeScript | Tipado estricto |
| jsPDF + autoTable | Generación de PDF |
| papaparse | Importar CSV |
| xlsx (SheetJS) | Importar / exportar Excel |

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
| `npm run build:web` | Build solo web (sin Electron) |
| `npm run preview` | Preview del build web |
| `npm run type-check` | Verificar tipos sin compilar |

## F5 en VSCode

1. Abrir proyecto en VSCode
2. Presionar **F5** — seleccionar **"FirmaFlow: Dev"**
3. Vite arranca en background, Electron compila y lanza automáticamente

Para debug full (main + renderer): seleccionar el compound **"FirmaFlow: Full Debug"**

## Funcionalidades

- Agregar / editar / eliminar personas con nombre, cédula, fechas, paquetes y valor
- Constante de precio por paquete — calcula valor automáticamente al ingresar paquetes
- Datos de empresa (nombre, NIT, elaborado por) configurables desde la UI
- Tabla dinámica con totales automáticos en formato COP
- Validación de formulario con errores en tiempo real
- Generación de PDF landscape A4 con:
  - Header corporativo con gradiente indigo
  - Tabla autoTable con línea de firma por fila
  - Footer con elaborado por + fecha + línea de firma
- **Importar** planilla desde `.csv` o `.xlsx` / `.xls`
- **Exportar** datos a `.csv` o `.xlsx` con un clic
- **Modo oscuro / claro** — persiste en `localStorage`, detecta preferencia del sistema en el primer uso
- Diseño responsivo (mobile + desktop)
- Toasts animados de feedback

## Importar desde CSV o Excel

En la tabla de nómina, usar el botón **Importar** → seleccionar archivo `.csv`, `.xlsx` o `.xls`.

El parser detecta columnas automáticamente por nombre (sin importar mayúsculas ni tildes):

| Campo | Nombres aceptados en la columna |
|---|---|
| Nombre | `nombre`, `name`, `empleado`, `trabajador` |
| Cédula | `cedula`, `documento`, `cc`, `identificacion` |
| Fecha inicio | `inicio`, `startdate`, `fechainicio`, `fechadeinicio` |
| Fecha final | `fin`, `final`, `enddate`, `fechafinal` |
| Paquetes | `paquetes`, `packages`, `totalpaquetes`, `cantidad` |
| Valor | `valor`, `value`, `pago`, `total`, `monto` |

Formatos de fecha aceptados: `DD/MM/YYYY`, `DD-MM-YYYY`, `DD.MM.YYYY`, `YYYY-MM-DD`.

Ver [`examples/nomina-ejemplo.csv`](examples/nomina-ejemplo.csv) como referencia.

## Estructura

```
electron/
  main.ts               # Proceso principal, carga dev o prod según NODE_ENV
  preload.ts            # Context bridge seguro
src/
  components/
    Header.tsx          # Logo + badge + botón settings
    PersonForm.tsx      # Formulario con validación
    PayrollTable.tsx    # Tabla + importar + exportar + generar PDF
    Settings.tsx        # Panel de configuración (tema claro/oscuro)
    ToastContainer.tsx  # Notificaciones animadas
  hooks/
    usePayroll.ts       # Estado centralizado: CRUD, importar, toasts
    useTheme.ts         # Tema claro/oscuro con persistencia
  types/index.ts        # Person, FormData, CompanyConfig, Toast
  utils/
    formatters.ts       # COP currency, fechas, IDs
    pdfGenerator.ts     # jsPDF landscape A4
    importPeople.ts     # Parser CSV/Excel → Person[]
    exportPeople.ts     # Person[] → descarga CSV/Excel
examples/
  nomina-ejemplo.csv    # Plantilla de importación de referencia
.vscode/
  launch.json           # F5 → FirmaFlow: Dev
  tasks.json            # Vite bg task + compile electron ts
  settings.json         # Tailwind IntelliSense, formatter
  extensions.json       # Extensiones recomendadas
```

## Build de producción

```bash
npm run build
```

Genera instalador en `release/` — NSIS en Windows, DMG en macOS, AppImage en Linux.

---

Elaborado para uso empresarial interno.
