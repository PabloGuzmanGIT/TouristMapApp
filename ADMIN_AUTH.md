# 🔐 Sistema de Autenticación Admin

## Configuración

### 1. Agregar contraseña en `.env`

Agrega esta línea a tu archivo `.env`:

```env
ADMIN_PASSWORD=tu_contraseña_segura_aqui
```

**Por defecto:** Si no configuras `ADMIN_PASSWORD`, la contraseña será `admin123`

### 2. Acceso al Panel Admin

1. Ve a: `http://localhost:3000/admin/login`
2. Ingresa la contraseña configurada
3. Serás redirigido al panel de administración

### 3. Rutas Protegidas

Las siguientes rutas requieren autenticación:
- `/admin/places` - Lista de lugares
- `/admin/places/[id]/edit` - Editar lugar

### 4. Botón "Editar"

El botón "Editar" en las páginas públicas de lugares solo aparece cuando:
- Estás autenticado como administrador
- Tienes una sesión activa

### 5. Cerrar Sesión

- Click en "Salir" en el navbar (cuando estés autenticado)
- O simplemente cierra el navegador (la sesión expira en 7 días)

## Seguridad

⚠️ **IMPORTANTE para Producción:**

1. **Cambia la contraseña por defecto** en `.env`
2. Usa una contraseña fuerte (mínimo 12 caracteres)
3. Considera implementar NextAuth.js para autenticación más robusta
4. Habilita HTTPS en producción

## Próximos Pasos (Opcional)

Para mayor seguridad, considera:
- Implementar NextAuth.js con Google/GitHub OAuth
- Agregar roles de usuario (admin, editor, viewer)
- Implementar rate limiting en el login
- Agregar 2FA (autenticación de dos factores)
