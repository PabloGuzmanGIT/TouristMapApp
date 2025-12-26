# 🖼️ Configuración de Cloudinary para Carga de Imágenes

## Paso 1: Crear Cuenta en Cloudinary

1. Ve a https://cloudinary.com/users/register_free
2. Crea una cuenta gratuita (puedes usar Google/GitHub)
3. Una vez dentro del dashboard, anota tu **Cloud Name** (aparece en la esquina superior izquierda)

## Paso 2: Configurar Upload Preset

1. En el dashboard de Cloudinary, haz clic en el ícono de **Settings** (⚙️) en la esquina inferior izquierda
2. Ve a la pestaña **Upload**
3. Scroll hacia abajo hasta la sección **Upload presets**
4. Haz clic en **Add upload preset**
5. Configura lo siguiente:
   - **Preset name**: `tourism-map-places`
   - **Signing Mode**: Selecciona **Unsigned**
   - **Folder**: `tourism-map/places`
   - En la sección **Media Analysis and AI**:
     - **Allowed formats**: `jpg,png,webp`
   - En la sección **Upload Manipulations**:
     - **Max file size**: `5000000` (5MB)
6. Haz clic en **Save**

## Paso 3: Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env.local` (si no existe)
2. Agrega las siguientes variables:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tourism-map-places
```

**Reemplaza `tu-cloud-name-aqui`** con el Cloud Name que anotaste en el Paso 1.

## Paso 4: Probar la Funcionalidad

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a http://localhost:3000/add-place

3. Intenta subir una imagen:
   - Haz clic en el botón "Subir Imagen"
   - Selecciona una imagen desde tu PC
   - Verifica que aparece el preview
   - Completa el formulario y crea el lugar
   - Ve a la página del lugar y verifica que la imagen se muestra

## Notas Importantes

- ✅ Las imágenes se suben directamente a Cloudinary desde el navegador
- ✅ No necesitas crear endpoints de API para subir archivos
- ✅ Las validaciones (tamaño, formato) se manejan automáticamente
- ✅ Las URLs de las imágenes son públicas y permanentes
- ✅ Plan gratuito incluye 25GB de almacenamiento y 25GB de ancho de banda/mes

## Troubleshooting

### Error: "Upload preset not found"
- Verifica que el nombre del preset sea exactamente `tourism-map-places`
- Asegúrate de que el preset esté configurado como **Unsigned**

### Error: "Invalid cloud name"
- Verifica que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` esté correctamente configurado en `.env.local`
- Reinicia el servidor después de cambiar variables de entorno

### Las imágenes no se muestran
- Verifica que las URLs de Cloudinary sean públicas
- Revisa la consola del navegador para ver errores
