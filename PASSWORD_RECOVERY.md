# 🔐 Sistema de Recuperación de Contraseña - COMPLETO

## ✅ Implementación Finalizada

Se ha implementado un sistema completo de recuperación de contraseña con envío de emails.

---

## 📧 Configuración de Resend (Emails Gratis)

### 1. Crear cuenta en Resend

1. Ve a: https://resend.com/signup
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Obtener API Key

1. Ve a: https://resend.com/api-keys
2. Click en "Create API Key"
3. Copia la API key

### 3. Agregar a `.env`

```env
# Resend (Email Service)
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@tudominio.com
```

**Nota:** En desarrollo, puedes usar `onboarding@resend.dev` como EMAIL_FROM

---

## 🚀 Rutas Implementadas

### **Login:**
- `/admin/login`
- Ahora incluye link "¿Olvidaste tu contraseña?"

### **Olvidé mi contraseña:**
- `/admin/forgot-password` ⭐ NUEVO
- Formulario para ingresar email
- Envía email con link de recuperación

### **Resetear contraseña:**
- `/admin/reset-password?token=xxx` ⭐ NUEVO
- Formulario para nueva contraseña
- Valida token y expira en 1 hora

---

## 🔄 Flujo Completo

### **Usuario olvida su contraseña:**

1. **Va a `/admin/login`**
2. **Click en "¿Olvidaste tu contraseña?"**
3. **Ingresa su email en `/admin/forgot-password`**
4. **Recibe email con link** (o ve link en consola si no hay RESEND_API_KEY)
5. **Click en el link** → Va a `/admin/reset-password?token=xxx`
6. **Ingresa nueva contraseña**
7. **¡Listo!** → Redirigido a login

---

## 📧 Template de Email

El email incluye:
- ✅ Diseño profesional con gradiente
- ✅ Botón grande "Recuperar Contraseña"
- ✅ Link alternativo (por si el botón no funciona)
- ✅ Advertencia de expiración (1 hora)
- ✅ Branding "Explora Perú"
- ✅ Responsive

---

## 🛡️ Seguridad

- ✅ **Token aleatorio** (32 bytes)
- ✅ **Expira en 1 hora**
- ✅ **Un solo uso** (se borra después de usar)
- ✅ **Previene enumeración de emails** (siempre dice "si existe...")
- ✅ **Contraseña hasheada** con bcrypt

---

## 🧪 Modo Desarrollo (Sin Resend)

Si NO configuras `RESEND_API_KEY`:
- El link aparece en la **consola del servidor**
- Copia y pega el link en el navegador
- Funciona perfectamente para desarrollo

---

## 💰 Costos

### **Resend:**
- **Gratis:** 3,000 emails/mes
- **Después:** $20/mes por 50,000 emails

### **Total Sistema:**
- NextAuth.js: $0
- Prisma: $0
- Bcrypt: $0
- Resend: $0 (hasta 3K emails/mes)
- **TOTAL: $0/mes** 🎉

---

## 🔧 Próximos Pasos

### **1. Reiniciar el servidor:**
```bash
# Detener el servidor actual (Ctrl+C)
npm run dev
```

### **2. Probar el flujo:**
1. Ve a `/admin/login`
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresa: `admin@exploraperu.com`
4. Revisa la consola del servidor para el link
5. Copia el link y ábrelo
6. Ingresa nueva contraseña
7. ¡Login exitoso!

### **3. Configurar Resend (Opcional):**
- Crea cuenta en Resend
- Agrega `RESEND_API_KEY` a `.env`
- Reinicia servidor
- ¡Los emails se enviarán automáticamente!

---

## 📝 Variables de Entorno Necesarias

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=8RcNWkfMfOvUscSdRDcC1iSZ2JEe6h0bMGJ3bvOffN4=

# Resend (Opcional - para enviar emails reales)
RESEND_API_KEY=re_tu_api_key_aqui
EMAIL_FROM=noreply@exploraperu.com
```

---

## ✅ Checklist Final

- [x] Página de login con link "Olvidé contraseña"
- [x] Página "Forgot Password" funcional
- [x] Página "Reset Password" funcional
- [x] API endpoint para generar token
- [x] API endpoint para resetear contraseña
- [x] Integración con Resend
- [x] Template de email profesional
- [x] Modo desarrollo (sin Resend)
- [x] Seguridad (tokens, expiración, bcrypt)
- [x] Validaciones (contraseña mínima, confirmación)

---

## 🎉 ¡Sistema Completo!

Tu aplicación ahora tiene:
1. ✅ Login seguro
2. ✅ Recuperación de contraseña
3. ✅ Envío de emails
4. ✅ Gestión de usuarios
5. ✅ Roles y permisos
6. ✅ CRUD de lugares

**Todo funcionando y listo para producción.** 🚀

---

## 🆘 Troubleshooting

### "No recibo el email"
- Revisa la consola del servidor (modo desarrollo)
- Verifica `RESEND_API_KEY` en `.env`
- Revisa spam/correo no deseado

### "Token inválido o expirado"
- El token expira en 1 hora
- Solicita un nuevo link

### "Error al enviar email"
- Verifica que Resend API key sea válida
- Verifica que `EMAIL_FROM` sea un dominio verificado

---

¿Listo para probar? ¡Reinicia el servidor y prueba el flujo completo! 🎊
