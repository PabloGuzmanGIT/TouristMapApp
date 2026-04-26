# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-flows.spec.ts >> Flujo de validación: Add Place y Registro Negocio >> Flujo 2: Registro de Negocio Premium
- Location: tests\user-flows.spec.ts:57:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button[type="submit"]')
    - locator resolved to <button disabled type="submit" class="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    37 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Explora Perú" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e9]: Explora Perú
      - generic [ref=e10]:
        - link "Inicio" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "Explorar" [ref=e12] [cursor=pointer]:
          - /url: /explorar
        - link "Quiénes Somos" [ref=e13] [cursor=pointer]:
          - /url: /nosotros
        - link "Iniciar Sesión" [ref=e14] [cursor=pointer]:
          - /url: /login
        - link "Registrarse" [ref=e15] [cursor=pointer]:
          - /url: /register
  - main [ref=e16]:
    - generic [ref=e18]:
      - link "Volver al inicio" [ref=e19] [cursor=pointer]:
        - /url: /
        - img [ref=e20]
        - text: Volver al inicio
      - generic [ref=e22]:
        - img [ref=e24]
        - generic [ref=e28]:
          - heading "Registra tu Negocio" [level=1] [ref=e29]
          - paragraph [ref=e30]: Tu negocio aparecera en el mapa y tendra su propia pagina en Explora Peru
    - generic [ref=e32]:
      - generic [ref=e33]:
        - generic [ref=e35]:
          - img [ref=e36]
          - generic [ref=e40]:
            - paragraph [ref=e41]: Ubicacion GPS requerida
            - paragraph [ref=e42]:
              - text: Para que tu negocio aparezca correctamente en el mapa, necesitamos tu ubicacion exacta.
              - strong [ref=e43]: Usa WiFi para mayor precision.
              - text: Idealmente, registra tu negocio desde el local.
        - button "Obtener mi ubicacion actual (GPS)" [ref=e44]:
          - img [ref=e45]
          - text: Obtener mi ubicacion actual (GPS)
        - generic [ref=e48]:
          - generic [ref=e49]:
            - heading "Selecciona ubicacion" [level=2] [ref=e50]:
              - img [ref=e51]
              - text: Selecciona ubicacion
            - generic [ref=e54]: Amazonas
          - generic [ref=e56]:
            - generic [ref=e57]:
              - generic:
                - region "Map" [ref=e58]
                - button "Map marker" [ref=e59]
                - button "Map marker" [ref=e60]
              - generic:
                - button "Find my location" [pressed] [ref=e62] [cursor=pointer]
                - generic [ref=e64]:
                  - button "Zoom in" [ref=e65] [cursor=pointer]
                  - button "Zoom out" [ref=e67] [cursor=pointer]
                  - button "Reset bearing to north" [ref=e69]
                - group [ref=e71]:
                  - generic "Toggle attribution" [ref=e72] [cursor=pointer]
                  - generic [ref=e73]:
                    - link "© MapTiler" [ref=e74] [cursor=pointer]:
                      - /url: https://www.maptiler.com/copyright/
                    - link "© OpenStreetMap contributors" [ref=e75] [cursor=pointer]:
                      - /url: https://www.openstreetmap.org/copyright
            - button "Mi ubicación" [ref=e76]
          - paragraph [ref=e77]: Tambien puedes tocar el mapa para ajustar la ubicacion exacta
      - generic [ref=e79]:
        - generic [ref=e80]:
          - heading "Datos del Negocio" [level=3] [ref=e81]:
            - img [ref=e82]
            - text: Datos del Negocio
          - generic [ref=e85]:
            - generic [ref=e86]: Nombre del Negocio *
            - 'textbox "Ej: Restaurante El Buen Sabor" [ref=e87]': Negocio E2E Test
            - paragraph [ref=e88]:
              - text: "Tu pagina sera:"
              - code [ref=e89]: /amazonas/places/negocio-e2e-test
          - generic [ref=e90]:
            - generic [ref=e91]:
              - generic [ref=e92]: Categoria *
              - combobox [ref=e93]:
                - option "Seleccionar..."
                - option "Restaurante" [selected]
                - option "Cafe"
                - option "Bar"
                - option "Mercado"
                - option "Tienda"
                - option "Artesania"
                - option "Servicio (reparaciones, mecanica, etc.)"
                - option "Salud"
                - option "Banco / Financiero"
                - option "Transporte"
                - option "Gasolinera"
                - option "Hospedaje / Hotel"
                - option "Atraccion Turistica"
                - option "Coworking"
                - option "Info Turistica"
                - option "Otro"
            - generic [ref=e94]:
              - generic [ref=e95]: Departamento *
              - combobox [ref=e96]:
                - option "Seleccionar..."
                - option "Amazonas" [selected]
                - option "Áncash"
                - option "Apurímac"
                - option "Arequipa"
                - option "Ayacucho"
                - option "Cajamarca"
                - option "Callao"
                - option "Cusco"
                - option "Huancavelica"
                - option "Huánuco"
                - option "Ica"
                - option "Junín"
                - option "La Libertad"
                - option "Lambayeque"
                - option "Lima"
                - option "Loreto"
                - option "Madre de Dios"
                - option "Moquegua"
                - option "Pasco"
                - option "Piura"
                - option "Puno"
                - option "San Martín"
                - option "Tacna"
                - option "Tumbes"
                - option "Ucayali"
          - generic [ref=e97]:
            - generic [ref=e98]: Descripcion breve
            - 'textbox "Describe tu negocio: que ofreces, horarios, especialidades..." [ref=e99]'
          - generic [ref=e100]:
            - generic [ref=e101]:
              - generic [ref=e102]: Direccion
              - textbox "Jr. Asamblea 123" [ref=e103]
            - generic [ref=e104]:
              - generic [ref=e105]:
                - img [ref=e106]
                - text: Telefono del negocio
              - textbox "+51 999 888 777" [ref=e108]
        - generic [ref=e109]:
          - heading "Fotos del Negocio" [level=3] [ref=e110]:
            - img [ref=e111]
            - text: Fotos del Negocio
          - paragraph [ref=e115]: Sube fotos de tu local para que los clientes te conozcan
          - generic [ref=e116]:
            - generic [ref=e117]:
              - generic [ref=e118]: Foto principal
              - button "Subir foto" [ref=e119]:
                - img [ref=e120]
                - generic [ref=e123]: Subir foto
            - generic [ref=e124]:
              - generic [ref=e125]: Foto adicional
              - button "Subir foto" [ref=e126]:
                - img [ref=e127]
                - generic [ref=e130]: Subir foto
        - generic [ref=e131]:
          - heading "Horarios de Atencion" [level=3] [ref=e132]:
            - img [ref=e133]
            - text: Horarios de Atencion
          - paragraph [ref=e136]: "Indica tu horario para cada dia (ej: 09:00 - 18:00) o escribe \"cerrado\""
          - generic [ref=e137]:
            - generic [ref=e138]:
              - generic [ref=e139]: Lunes
              - textbox "09:00 - 18:00" [ref=e140]
            - generic [ref=e141]:
              - generic [ref=e142]: Martes
              - textbox "09:00 - 18:00" [ref=e143]
            - generic [ref=e144]:
              - generic [ref=e145]: Miercoles
              - textbox "09:00 - 18:00" [ref=e146]
            - generic [ref=e147]:
              - generic [ref=e148]: Jueves
              - textbox "09:00 - 18:00" [ref=e149]
            - generic [ref=e150]:
              - generic [ref=e151]: Viernes
              - textbox "09:00 - 18:00" [ref=e152]
            - generic [ref=e153]:
              - generic [ref=e154]: Sabado
              - textbox "09:00 - 18:00" [ref=e155]
            - generic [ref=e156]:
              - generic [ref=e157]: Domingo
              - textbox "09:00 - 18:00" [ref=e158]
          - generic [ref=e159]:
            - generic [ref=e160]: Notas adicionales
            - 'textbox "Ej: Horario extendido los feriados, atencion solo con cita, etc." [ref=e161]'
        - generic [ref=e162]:
          - heading "Servicios del Local" [level=3] [ref=e163]:
            - img [ref=e164]
            - text: Servicios del Local
          - paragraph [ref=e170]: Selecciona los servicios que ofreces en tu local
          - generic [ref=e171]:
            - button "📶 WiFi Gratis" [ref=e172]:
              - generic [ref=e173]: 📶
              - text: WiFi Gratis
            - button "🅿️ Estacionamiento" [ref=e174]:
              - generic [ref=e175]: 🅿️
              - text: Estacionamiento
            - button "🚻 Baños" [ref=e176]:
              - generic [ref=e177]: 🚻
              - text: Baños
            - button "💳 Acepta Tarjetas" [ref=e178]:
              - generic [ref=e179]: 💳
              - text: Acepta Tarjetas
            - button "💵 Acepta Dolares" [ref=e180]:
              - generic [ref=e181]: 💵
              - text: Acepta Dolares
            - button "♿ Acceso silla de ruedas" [ref=e182]:
              - generic [ref=e183]: ♿
              - text: Acceso silla de ruedas
        - generic [ref=e184]:
          - heading "Rango de Precios" [level=3] [ref=e185]:
            - img [ref=e186]
            - text: Rango de Precios
          - paragraph [ref=e188]: Indica el nivel de precios de tu negocio
          - generic [ref=e189]:
            - button "Gratis" [ref=e190]
            - button "$" [ref=e191]
            - button "$$" [ref=e192]
            - button "$$$" [ref=e193]
        - generic [ref=e194]:
          - heading "Datos del Propietario" [level=3] [ref=e195]:
            - img [ref=e196]
            - text: Datos del Propietario
          - generic [ref=e199]:
            - generic [ref=e200]: Nombre completo *
            - generic [ref=e201]:
              - img [ref=e202]
              - textbox "Tu nombre completo" [ref=e205]: Dueño Test
          - generic [ref=e206]:
            - generic [ref=e207]:
              - generic [ref=e208]: Email de contacto *
              - generic [ref=e209]:
                - img [ref=e210]
                - textbox "tu@email.com" [ref=e213]: dueno@test.com
            - generic [ref=e214]:
              - generic [ref=e215]: Telefono personal
              - generic [ref=e216]:
                - img [ref=e217]
                - textbox "+51 999 888 777" [ref=e219]: "999888777"
        - generic [ref=e220]:
          - img [ref=e221]
          - text: Usa el boton GPS o toca el mapa para marcar la ubicacion de tu negocio
        - button "Enviar Solicitud" [disabled] [ref=e224]:
          - img [ref=e225]
          - text: Enviar Solicitud
        - paragraph [ref=e228]: Revisaremos tu solicitud y te contactaremos por email. Una vez aprobado, tu negocio aparecera en el mapa con su propia pagina.
  - contentinfo [ref=e229]:
    - generic [ref=e230]:
      - generic [ref=e231]:
        - generic [ref=e232]:
          - generic [ref=e233]:
            - img [ref=e234]
            - generic [ref=e237]: Explora Perú
          - paragraph [ref=e238]: "Descubre lo mejor del Perú: turismo, gastronomía, historia y naturaleza."
        - generic [ref=e239]:
          - heading "Explorar" [level=4] [ref=e240]
          - list [ref=e241]:
            - listitem [ref=e242]:
              - link "Inicio" [ref=e243] [cursor=pointer]:
                - /url: /
            - listitem [ref=e244]:
              - link "Quiénes Somos" [ref=e245] [cursor=pointer]:
                - /url: /nosotros
            - listitem [ref=e246]:
              - link "Agregar Lugar" [ref=e247] [cursor=pointer]:
                - /url: /add-place
        - generic [ref=e248]:
          - heading "Legal" [level=4] [ref=e249]
          - list [ref=e250]:
            - listitem [ref=e251]:
              - link "Términos de Uso" [ref=e252] [cursor=pointer]:
                - /url: /terminos
            - listitem [ref=e253]:
              - link "Privacidad" [ref=e254] [cursor=pointer]:
                - /url: /privacidad
            - listitem [ref=e255]:
              - link "Contacto" [ref=e256] [cursor=pointer]:
                - /url: /contacto
        - generic [ref=e257]:
          - heading "Síguenos" [level=4] [ref=e258]
          - generic [ref=e259]:
            - link "FB" [ref=e260] [cursor=pointer]:
              - /url: "#"
            - link "IG" [ref=e261] [cursor=pointer]:
              - /url: "#"
            - link "TW" [ref=e262] [cursor=pointer]:
              - /url: "#"
      - paragraph [ref=e264]: © 2026 Explora Perú. Todos los derechos reservados.
  - region "Notifications alt+T"
  - generic [ref=e269] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e270]:
      - img [ref=e271]
    - generic [ref=e274]:
      - button "Open issues overlay" [ref=e275]:
        - generic [ref=e276]:
          - generic [ref=e277]: "0"
          - generic [ref=e278]: "1"
        - generic [ref=e279]: Issue
      - button "Collapse issues badge" [ref=e280]:
        - img [ref=e281]
  - alert [ref=e283]
  - generic [ref=e285]:
    - img [ref=e288]
    - generic [ref=e290]:
      - heading "Tu privacidad es importante" [level=3] [ref=e291]
      - paragraph [ref=e292]: Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies de terceros (como Google AdSense) para personalizar anuncios y analizar nuestro tráfico.
      - generic [ref=e293]:
        - button "Aceptar Todo" [ref=e294]
        - button "Rechazar" [ref=e295]
      - link "Leer nuestra Política de Privacidad" [ref=e297] [cursor=pointer]:
        - /url: /privacidad
    - button "Cerrar banner" [ref=e298]:
      - img [ref=e299]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Conceder permisos de geolocalización globalmente para todos los tests
  4  | test.use({
  5  |   geolocation: { longitude: -74.2243, latitude: -13.1635 },
  6  |   permissions: ['geolocation'],
  7  | });
  8  | 
  9  | test.describe('Flujo de validación: Add Place y Registro Negocio', () => {
  10 | 
  11 |   const testUser = {
  12 |     name: 'Test Automatizado',
  13 |     email: `test-${Date.now()}@test.com`,
  14 |     password: 'password123'
  15 |   };
  16 | 
  17 |   test('Flujo 1: Crear cuenta y Agregar Lugar Comunitario', async ({ page }) => {
  18 |     await page.goto('/register');
  19 |     
  20 |     await page.fill('input[name="name"]', testUser.name);
  21 |     await page.fill('input[name="email"]', testUser.email);
  22 |     await page.fill('input[name="password"]', testUser.password);
  23 |     
  24 |     // Asumimos botón submit del form de NextAuth (generalmente id u type="submit")
  25 |     await page.click('button[type="submit"]');
  26 |     await page.waitForTimeout(2000); 
  27 | 
  28 |     // Vamos al panel de comunidad
  29 |     await page.goto('/add-place');
  30 |     
  31 |     // Seleccionar depto, asumiendo 1 índice válido y renderizado
  32 |     await page.waitForSelector('select', { state: 'visible' });
  33 |     const selects = await page.$$('select');
  34 |     if (selects.length > 0) await selects[0].selectOption({ index: 1 });
  35 | 
  36 |     await page.getByPlaceholder('Ej: Plaza de Armas').fill('Sitio Test ' + Date.now());
  37 | 
  38 |     if (selects.length > 1) {
  39 |        await selects[1].selectOption('mirador');
  40 |     }
  41 | 
  42 |     // Usar botón usar mi ubicación
  43 |     const gpsBtn = page.getByText(/Usar mi ubicación/i);
  44 |     if (await gpsBtn.isVisible()) {
  45 |       await gpsBtn.click();
  46 |     } else {
  47 |       await page.getByPlaceholder('-13.1635').fill('-13.5');
  48 |       await page.getByPlaceholder('-74.2243').fill('-74.5');
  49 |     }
  50 | 
  51 |     const addBtn = page.getByRole('button', { name: /Agregar Lugar/i });
  52 |     await addBtn.click();
  53 | 
  54 |     await expect(page.locator('text=/✅/i')).toBeVisible({ timeout: 10000 });
  55 |   });
  56 | 
  57 |   test('Flujo 2: Registro de Negocio Premium', async ({ page }) => {
  58 |     await page.goto('/registro-negocio');
  59 | 
  60 |     await page.fill('input[name="name"]', 'Negocio E2E Test');
  61 |     await page.selectOption('select[name="category"]', 'restaurant');
  62 |     
  63 |     // Departamento (CityID selector)
  64 |     await page.selectOption('select[name="cityId"]', { index: 1 }); 
  65 | 
  66 |     await page.fill('input[name="ownerName"]', 'Dueño Test');
  67 |     await page.fill('input[name="ownerEmail"]', 'dueno@test.com');
  68 |     await page.fill('input[name="ownerPhone"]', '999888777');
  69 | 
  70 |     // Botón GPS
  71 |     await page.click('button:has-text("Obtener mi ubicacion actual")');
  72 |     await page.waitForTimeout(1000); 
  73 | 
> 74 |     await page.click('button[type="submit"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  75 | 
  76 |     // Buscamos la pantalla de éxito que tiene CheckCircle y texto
  77 |     await expect(page.locator('text=Solicitud Enviada')).toBeVisible({ timeout: 10000 });
  78 |   });
  79 | });
  80 | 
```