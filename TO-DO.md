# FirmaFlow — Roadmap & TO-DO

> Funcionalidades planeadas, ordenadas por impacto. Marcar con `[x]` al completar.

---

## 🔴 Alta prioridad

- [ ] **Persistencia de datos** (`electron-store`)
  Guardar automáticamente personas, precio por paquete y configuración al cerrar la app.
  Sin esto, todo se pierde al reiniciar.

- [ ] **Guardar y cargar nóminas**
  Crear nóminas con nombre, guardarlas localmente y reabrirlas en cualquier momento.
  Útil para manejar múltiples períodos o clientes.

- [ ] **Importar desde CSV / Excel**
  Cargar una planilla existente para poblar la tabla sin ingresar fila por fila.
  Librería sugerida: `xlsx` o `papaparse`.

- [ ] **Configuración de empresa**
  Nombre de empresa, NIT y logo que aparezcan en el header del PDF generado.
  Reemplaza los valores estáticos actuales.

---

## 🟡 Media prioridad

- [ ] **Historial de nóminas**
  Listado de nóminas generadas anteriormente con fecha, total y opción de reabrir o re-exportar PDF.

- [ ] **Múltiples categorías de precio**
  Definir varias tarifas (Tipo A, Tipo B, etc.) y asignar una por persona en lugar de un precio global.

- [ ] **Columna de descuentos**
  Campo opcional por fila para deducciones. El valor neto se calcula como `valor - descuento`.

- [ ] **Exportar a Excel**
  Botón adicional para descargar la tabla como archivo `.xlsx`.
  Librería sugerida: `xlsx` (SheetJS).

- [ ] **Imprimir directo**
  Botón "Imprimir" que use `win.webContents.print()` sin necesidad de abrir el PDF primero.

---

## 🟢 Baja prioridad / QoL

- [ ] **Búsqueda y filtro en tabla**
  Input para filtrar filas por nombre o cédula. Útil con 50+ registros.

- [ ] **Dark mode**
  Toggle de tema oscuro. Tailwind ya soporta `dark:`, solo falta el switch y persistir la preferencia.

- [ ] **Auto-backup JSON**
  Guardar snapshot de los datos cada cierto tiempo en disco como respaldo adicional.

- [ ] **Atajos de teclado**
  | Atajo | Acción |
  |---|---|
  | `Enter` | Agregar persona (cuando el formulario está activo) |
  | `Esc` | Cancelar edición |
  | `Ctrl + P` | Generar PDF |
  | `Ctrl + Z` | Deshacer última eliminación |

---

## ✅ Completado

- [x] Formulario con validación de campos
- [x] Tabla dinámica con edición y eliminación
- [x] Total general automático con formato COP
- [x] Constante de precio por paquete (auto-cálculo de valor)
- [x] Generación de PDF landscape A4 con firma por fila
- [x] Toasts de feedback animados
- [x] Configuración VSCode (F5 para correr)
- [x] `.gitignore` y `README.md`
