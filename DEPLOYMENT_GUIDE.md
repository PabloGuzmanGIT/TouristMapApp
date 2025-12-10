# 🚀 Guía Rápida de Deployment

## 📋 Resumen

Tus datos están en PostgreSQL local. Para deployar en Vercel necesitas:
1. Crear tablas en Supabase
2. Poblar datos en Supabase
3. Deployar en Vercel

---

## 🗄️ Paso 1: Preparar Supabase

### 1.1 Verificar URL correcta

Ve a Supabase > Settings > Database > Connection String

Asegúrate de copiar la URL correcta (Direct connection):
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

⚠️ **Verifica que sea la URL correcta** (el error anterior fue por typo)

### 1.2 Actualizar .env

Edita tu `.env` (NO `.env.local`) temporalmente:

```bash
# Comenta la URL local
# DATABASE_URL="postgresql://postgres:root@localhost:5432/MapActivitiesBusiness?schema=public"

# Usa Supabase
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.CORRECTA_URL.supabase.co:5432/postgres"
```

### 1.3 Crear tablas en Supabase

```bash
npx prisma db push
```

Esto creará todas las tablas (City, Place, User, etc.) en Supabase.

---

## 📊 Paso 2: Poblar Datos en Supabase

Ejecuta los scripts de población:

```bash
# Opción A: Todo de una vez
npm run seed:all

# Opción B: Uno por uno
npm run seed:departments  # Crea ciudades base
npm run seed:cities       # Puebla Lima, Cusco, Arequipa, etc.
npm run seed:ayacucho     # Puebla Ayacucho
npm run seed:admin        # Crea usuario admin
```

---

## 🚀 Paso 3: Deploy en Vercel

### 3.1 Push a GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3.2 Conectar Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio `TouristMapApp`
3. Click "Import"

### 3.3 Configurar Variables de Entorno

En Vercel, agrega estas variables:

```
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.CORRECTA_URL.supabase.co:5432/postgres
NEXT_PUBLIC_MAPTILER_KEY=n3Ig3kuPCQvO75LfszSi
ADMIN_PASSWORD=consantino
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=8RcNWkfMfOvUscSdRDcC1iSZ2JEe6h0bMGJ3bvOffN4=
RESEND_API_KEY=re_54AHrfg1_2uuG9jU3QQE3PyexE9D4gewS
EMAIL_FROM=guzmagp23@gmail.com
```

⚠️ **Importante:** Actualiza `NEXTAUTH_URL` con tu URL real de Vercel después del primer deploy.

### 3.4 Deploy

Click "Deploy" y espera 2-3 minutos.

---

## 🔄 Paso 4: Volver a Desarrollo Local

Después de poblar Supabase, restaura tu `.env`:

```bash
# Vuelve a usar local para desarrollo
DATABASE_URL="postgresql://postgres:root@localhost:5432/MapActivitiesBusiness?schema=public"
```

O mejor aún, **usa Supabase también en desarrollo** para tener el mismo entorno.

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Causa:** URL incorrecta o password incorrecta

**Solución:**
1. Ve a Supabase > Settings > Database
2. Copia la URL exacta (Direct connection)
3. Si olvidaste la password, haz "Reset database password"

### Error: "Table already exists"

**Causa:** Ya ejecutaste `prisma db push` antes

**Solución:** No hay problema, continúa con los seeds

### Error: "City not found" al ejecutar seeds

**Causa:** No ejecutaste `seed:departments` primero

**Solución:**
```bash
npm run seed:departments  # Crea las ciudades base
npm run seed:cities       # Ahora sí puebla los lugares
```

---

## ✅ Checklist

- [ ] URL de Supabase correcta
- [ ] Tablas creadas (`npx prisma db push`)
- [ ] Datos poblados (`npm run seed:all`)
- [ ] Código en GitHub
- [ ] Variables de entorno en Vercel
- [ ] Deploy exitoso
- [ ] App funciona en producción

---

## 💡 Tip: Usar Supabase para TODO

**Recomendación:** Usa Supabase tanto en desarrollo como producción.

**Ventajas:**
- ✅ Mismo entorno en dev y prod
- ✅ Acceso a datos desde cualquier lugar
- ✅ No necesitas PostgreSQL local
- ✅ 500 MB gratis

**Actualiza `.env.local`:**
```bash
DATABASE_URL="postgresql://postgres:TU_PASSWORD@db.CORRECTA_URL.supabase.co:5432/postgres"
```

Y listo, desarrolla y deploya con la misma base de datos.
