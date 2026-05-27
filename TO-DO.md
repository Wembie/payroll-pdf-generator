# FirmaFlow — Roadmap & TO-DO

> Funcionalidades planeadas, ordenadas por impacto. La app corre como web pública y como app de escritorio (Electron). Los ítems marcados aplican a ambas plataformas salvo que se indique lo contrario.

---

## 🔴 Alta prioridad

- [ ] **Persistencia con localStorage**
  Guardar automáticamente personas, precio y configuración de empresa en el navegador.
  Sin esto, todo se pierde al recargar la página.

- [ ] **Importar desde CSV / Excel**
  Cargar una planilla existente para poblar la tabla sin ingresar fila por fila.
  Librería sugerida: `papaparse` (CSV) o `xlsx` (Excel). Funciona vía `<input type="file">` en web.

- [ ] **Exportar / importar nómina como JSON**
  Botón para descargar la nómina actual como `.json` y otro para cargarla de vuelta.
  Reemplaza el concepto de "guardar en disco" — funciona tanto en web como en Electron.

---

## 🟡 Media prioridad

- [ ] **Múltiples categorías de precio**
  Definir varias tarifas (Tipo A, Tipo B, etc.) y asignar una por persona en lugar de un precio global.

- [ ] **Columna de descuentos**
  Campo opcional por fila para deducciones. El valor neto se calcula como `valor - descuento`.

- [ ] **Exportar a Excel**
  Botón adicional para descargar la tabla como archivo `.xlsx`.
  Librería sugerida: `xlsx` (SheetJS).

- [ ] **Búsqueda y filtro en tabla**
  Input para filtrar filas por nombre o cédula. Útil con 50+ registros.

- [ ] **Imprimir directo**
  Botón "Imprimir" que use `window.print()` con estilos de impresión definidos en CSS.

---

## 🟢 Baja prioridad / QoL

- [ ] **Dark mode**
  Toggle de tema oscuro. Tailwind ya soporta `dark:`, solo falta el switch y persistir la preferencia en `localStorage`.

- [ ] **Atajos de teclado**
  | Atajo | Acción |
  |---|---|
  | `Enter` | Agregar persona (cuando el formulario está activo) |
  | `Esc` | Cancelar edición |
  | `Ctrl + P` | Generar PDF |
  | `Ctrl + Z` | Deshacer última eliminación |

- [ ] **Logo de empresa en PDF**
  Permitir subir una imagen (`.png`/`.jpg`) que aparezca en el encabezado del PDF en lugar del círculo "FF".

---

## ✅ Completado

- [x] Formulario con validación de campos
- [x] Tabla dinámica con edición y eliminación
- [x] Total general automático con formato COP
- [x] Constante de precio por paquete (auto-cálculo de valor)
- [x] Separadores de miles en todos los campos numéricos
- [x] Generación de PDF landscape A4 con firma por fila
- [x] Toasts de feedback animados
- [x] Configuración de empresa editable (nombre, NIT, elaborado por)
- [x] Datos de empresa reflejados en encabezado y pie del PDF
- [x] Versión de la app visible en el header (tomada del archivo `VERSION`)
- [x] CI/CD con GitHub Actions (type-check, build, release de instaladores)
- [x] Deploy web automático en GitHub Pages al hacer push a `main`
- [x] Configuración VSCode (F5 para correr en Electron)
- [x] `.gitignore` y `README.md`
