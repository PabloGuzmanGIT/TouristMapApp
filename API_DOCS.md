# API Documentation

## Swagger/OpenAPI

La aplicación Tourism Map incluye documentación completa de la API usando Swagger/OpenAPI.

### Acceder a la Documentación

Una vez que el servidor de desarrollo esté corriendo:

```bash
npm run dev
```

Visita: **http://localhost:3000/api-docs**

### Endpoints Documentados

#### **Places API**
- `POST /api/places` - Crear un nuevo lugar
  - Requiere: citySlug, name, category, lat, lng
  - Opcional: areaSlug, slug, featured, short, images, bookingUrl, website, phone, address

#### **Areas API**
- `GET /api/areas?city={citySlug}` - Obtener áreas de una ciudad
  - Parámetro requerido: `city` (slug de la ciudad)

### Especificación OpenAPI

La especificación completa en formato JSON está disponible en:
- **http://localhost:3000/api/swagger**

### Probar la API

Puedes probar los endpoints directamente desde la interfaz de Swagger:

1. Ve a http://localhost:3000/api-docs
2. Expande el endpoint que quieres probar
3. Click en "Try it out"
4. Completa los parámetros requeridos
5. Click en "Execute"

### Ejemplo de Request

**Crear un nuevo lugar:**

```bash
curl -X POST http://localhost:3000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "citySlug": "ayacucho",
    "name": "Mi Restaurante",
    "category": "restaurant",
    "lat": -13.1635,
    "lng": -74.2243,
    "short": "Deliciosa comida local",
    "featured": true
  }'
```

**Obtener áreas:**

```bash
curl http://localhost:3000/api/areas?city=ayacucho
```

### Categorías Disponibles

- **Gastronomía**: restaurant, cafe, bar, market
- **Turismo**: turistico, historico, museo, iglesia, plaza_parque, centro_cultural
- **Naturaleza**: naturaleza, mirador, sendero, cascada_laguna
- **Tiendas**: tienda, artesania
- **Servicios**: servicio, salud, banco, policia, municipalidad, transporte
- **Otros**: infoturismo, cowork, gasolinera, alojamiento, instagrameable, random

### Estructura del Proyecto

```
src/
├── lib/
│   └── swagger.ts          # Configuración de Swagger
├── app/
│   ├── api/
│   │   ├── swagger/
│   │   │   └── route.ts    # Endpoint de especificación
│   │   ├── places/ 
│   │   │   └── route.ts    # API de lugares (documentada)
│   │   └── areas/
│   │       └── route.ts    # API de áreas (documentada)
│   └── api-docs/
│       └── page.tsx        # UI de Swagger
```

### Personalización

Para agregar más documentación a otros endpoints:

1. Abre el archivo de ruta (ej: `src/app/api/tu-endpoint/route.ts`)
2. Agrega un comentario JSDoc con la anotación `@swagger`:

```typescript
/**
 * @swagger
 * /api/tu-endpoint:
 *   get:
 *     summary: Descripción breve
 *     description: Descripción detallada
 *     tags:
 *       - TuTag
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
export async function GET() {
  // tu código
}
```

3. La documentación se actualizará automáticamente

### Notas

- La documentación se genera automáticamente desde los comentarios JSDoc
- Los esquemas están definidos en `src/lib/swagger.ts`
- Swagger UI se carga dinámicamente en el cliente para evitar problemas de SSR
