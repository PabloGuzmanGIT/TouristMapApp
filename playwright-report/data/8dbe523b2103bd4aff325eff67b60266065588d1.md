# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-flows.spec.ts >> Flujo de validación: Add Place y Registro Negocio >> Flujo 1: Crear cuenta y Agregar Lugar Comunitario
- Location: tests\user-flows.spec.ts:17:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="name"]')

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
    - generic [ref=e17]:
      - link "Volver al inicio" [ref=e18] [cursor=pointer]:
        - /url: /
        - img [ref=e19]
        - text: Volver al inicio
      - generic [ref=e21]:
        - generic [ref=e22]:
          - heading "Crear Cuenta" [level=1] [ref=e23]
          - paragraph [ref=e24]: Únete a la comunidad de Explora Perú
        - generic [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]: Nombre Completo
            - generic [ref=e28]:
              - img [ref=e29]
              - textbox "Juan Pérez" [ref=e32]
          - generic [ref=e33]:
            - generic [ref=e34]: Correo Electrónico
            - generic [ref=e35]:
              - img [ref=e36]
              - textbox "tu@email.com" [ref=e39]
          - generic [ref=e40]:
            - generic [ref=e41]: Contraseña
            - generic [ref=e42]:
              - img [ref=e43]
              - textbox "Mínimo 6 caracteres" [ref=e46]
              - button [ref=e47]:
                - img [ref=e48]
          - generic [ref=e51]:
            - generic [ref=e52]: Confirmar Contraseña
            - generic [ref=e53]:
              - img [ref=e54]
              - textbox "Repite tu contraseña" [ref=e57]
              - button [ref=e58]:
                - img [ref=e59]
          - button "Crear Cuenta" [ref=e62]
        - generic [ref=e67]: O continúa con
        - button "Google (Próximamente)" [disabled] [ref=e68]:
          - img [ref=e69]
          - text: Google (Próximamente)
        - paragraph [ref=e74]:
          - text: ¿Ya tienes cuenta?
          - link "Inicia sesión" [ref=e75] [cursor=pointer]:
            - /url: /login
  - contentinfo [ref=e76]:
    - generic [ref=e77]:
      - generic [ref=e78]:
        - generic [ref=e79]:
          - generic [ref=e80]:
            - img [ref=e81]
            - generic [ref=e84]: Explora Perú
          - paragraph [ref=e85]: "Descubre lo mejor del Perú: turismo, gastronomía, historia y naturaleza."
        - generic [ref=e86]:
          - heading "Explorar" [level=4] [ref=e87]
          - list [ref=e88]:
            - listitem [ref=e89]:
              - link "Inicio" [ref=e90] [cursor=pointer]:
                - /url: /
            - listitem [ref=e91]:
              - link "Quiénes Somos" [ref=e92] [cursor=pointer]:
                - /url: /nosotros
            - listitem [ref=e93]:
              - link "Agregar Lugar" [ref=e94] [cursor=pointer]:
                - /url: /add-place
        - generic [ref=e95]:
          - heading "Legal" [level=4] [ref=e96]
          - list [ref=e97]:
            - listitem [ref=e98]:
              - link "Términos de Uso" [ref=e99] [cursor=pointer]:
                - /url: /terminos
            - listitem [ref=e100]:
              - link "Privacidad" [ref=e101] [cursor=pointer]:
                - /url: /privacidad
            - listitem [ref=e102]:
              - link "Contacto" [ref=e103] [cursor=pointer]:
                - /url: /contacto
        - generic [ref=e104]:
          - heading "Síguenos" [level=4] [ref=e105]
          - generic [ref=e106]:
            - link "FB" [ref=e107] [cursor=pointer]:
              - /url: "#"
            - link "IG" [ref=e108] [cursor=pointer]:
              - /url: "#"
            - link "TW" [ref=e109] [cursor=pointer]:
              - /url: "#"
      - paragraph [ref=e111]: © 2026 Explora Perú. Todos los derechos reservados.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e117] [cursor=pointer]:
    - img [ref=e118]
  - alert [ref=e121]
  - generic [ref=e123]:
    - img [ref=e126]
    - generic [ref=e128]:
      - heading "Tu privacidad es importante" [level=3] [ref=e129]
      - paragraph [ref=e130]: Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies de terceros (como Google AdSense) para personalizar anuncios y analizar nuestro tráfico.
      - generic [ref=e131]:
        - button "Aceptar Todo" [ref=e132]
        - button "Rechazar" [ref=e133]
      - link "Leer nuestra Política de Privacidad" [ref=e135] [cursor=pointer]:
        - /url: /privacidad
    - button "Cerrar banner" [ref=e136]:
      - img [ref=e137]
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
> 20 |     await page.fill('input[name="name"]', testUser.name);
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
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
  74 |     await page.click('button[type="submit"]');
  75 | 
  76 |     // Buscamos la pantalla de éxito que tiene CheckCircle y texto
  77 |     await expect(page.locator('text=Solicitud Enviada')).toBeVisible({ timeout: 10000 });
  78 |   });
  79 | });
  80 | 
```