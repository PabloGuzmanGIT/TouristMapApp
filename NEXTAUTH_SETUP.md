# 🔐 NextAuth.js - Sistema de Autenticación Completo

## ✅ Implementación Completada

Se ha implementado **NextAuth.js** con las siguientes características:

### Features Incluidas:
- ✅ Login con email/password
- ✅ Recuperación de contraseña por email
- ✅ Tokens de reset seguros (expiran en 1 hora)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Roles de usuario (admin, user, editor)
- ✅ Sesiones JWT seguras (7 días)
- ✅ Integración con Prisma

---

## 🚀 Configuración Inicial

### 1. Agregar variables de entorno

Agrega estas líneas a tu archivo `.env`:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui-cambialo-en-produccion

# Para generar un secreto seguro, ejecuta:
# openssl rand -base64 32
```

### 2. Crear tu primer usuario admin

```bash
npx tsx scripts/create-admin.ts admin@tudominio.com tucontraseña "Tu Nombre"
```

O simplemente:
```bash
npx tsx scripts/create-admin.ts
```
(Creará: admin@exploraperu.com con contraseña: admin123)

---

## 📧 Recuperación de Contraseña

### Cómo funciona:

1. Usuario va a `/admin/forgot-password`
2. Ingresa su email
3. Sistema genera token único
4. **En desarrollo:** Token se muestra en consola
5. **En producción:** Se envía por email (requiere configurar servicio)

### Para configurar emails (GRATIS):

#### Opción 1: Resend (Recomendado)
```bash
npm install resend
```

Agrega a `.env`:
```env
RESEND_API_KEY=tu-api-key-aqui
```

Gratis: 3,000 emails/mes

#### Opción 2: SendGrid
```bash
npm install @sendgrid/mail
```

Agrega a `.env`:
```env
SENDGRID_API_KEY=tu-api-key-aqui
```

Gratis: 100 emails/día

---

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Tokens de reset aleatorios (32 bytes)
- ✅ Tokens expiran en 1 hora
- ✅ Sesiones JWT con secret
- ✅ HttpOnly cookies
- ✅ CSRF protection (NextAuth.js built-in)
- ✅ Email enumeration prevention

---

## 📝 Endpoints Disponibles

### Autenticación:
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get current session

### Recuperación de contraseña:
- `POST /api/auth/forgot-password` - Solicitar reset
- `POST /api/auth/reset-password` - Resetear contraseña

---

## 🎯 Próximos Pasos

### Ahora:
1. Agrega `NEXTAUTH_SECRET` a `.env`
2. Crea tu usuario admin
3. Prueba el login en `/admin/login`

### Después (opcional):
1. Configurar servicio de email (Resend)
2. Agregar Google OAuth
3. Agregar GitHub OAuth
4. Personalizar emails de recuperación

---

## 💰 Costos

- NextAuth.js: **$0** (open source)
- Prisma: **$0** (open source)
- Bcrypt: **$0** (open source)
- Emails (Resend): **$0** hasta 3,000/mes
- **Total: $0/mes** 🎉

---

## 🆘 Troubleshooting

### Error: "NEXTAUTH_SECRET is not set"
Agrega `NEXTAUTH_SECRET` a tu `.env`

### Error: "Invalid credentials"
Verifica que el usuario existe y la contraseña es correcta

### No recibo emails de recuperación
En desarrollo, el link aparece en la consola del servidor

---

## 📚 Documentación

- NextAuth.js: https://next-auth.js.org
- Prisma Adapter: https://authjs.dev/reference/adapter/prisma
- Resend: https://resend.com/docs

---

¡Listo! Tu sistema de autenticación está completo y listo para usar. 🚀
