# Deuda Técnica — TouristMapApp

## 🔴 Alta Prioridad

### 1. Integración Culqi (Pasarela de Pagos)
- **Estado**: Pendiente
- **Descripción**: Reemplazar los botones de WhatsApp por un checkout real con [Culqi](https://culqi.com)
- **Alcance**:
  - Modelo `Booking` en Prisma (tour, hospedaje, ticket, evento)
  - Página `/checkout` con formulario + integración CulqiJS
  - API `/api/checkout` para procesar pagos
  - Webhook `/api/checkout/webhook` para confirmación async
  - Página `/checkout/success` con confirmación
  - Soporte: tarjetas (Visa/MC/Amex), Yape, PagoEfectivo
- **Diseño**: Ver `booking_system_design.md` en artifacts
- **Requisitos previos**: Crear cuenta Culqi, obtener API keys test
- **Archivos afectados**: `BookingModal.tsx` (se reemplaza), `TourCarousel.tsx`, `HospedajeSection.tsx`, `AgendaSection.tsx`

---

## 🟡 Media Prioridad

### 2. Admin CRUD para nuevo contenido
- Páginas admin para gestionar Tours, Eventos, Videos, Research
- Formularios de creación/edición con validación
- Tabla con filtros, búsqueda y paginación

### 3. CSV/Excel Import
- Upload de archivos para bulk-insert de tours, eventos, etc.
- Validación de datos antes de insertar

### 4. Email de Confirmación
- Integración con Resend o SendGrid
- Templates para confirmación de reserva/compra

---

## 🟢 Baja Prioridad

### 5. Prisma Migrate (migración formal)
- Actualmente se usa `prisma db push` (sin historial de migraciones)
- Migrar a `prisma migrate dev` con historial completo antes de producción

### 6. Imágenes reales
- Reemplazar Unsplash placeholders por fotos reales de Ayacucho/Vilcashuamán
- Subir a Cloudinary u otro CDN
