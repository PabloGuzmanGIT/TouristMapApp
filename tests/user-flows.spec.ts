import { test, expect } from '@playwright/test';

// Conceder permisos de geolocalización globalmente para todos los tests
test.use({
  geolocation: { longitude: -74.2243, latitude: -13.1635 },
  permissions: ['geolocation'],
});

test.describe('Flujo de validación: Add Place y Registro Negocio (Fase 2)', () => {

  const testUser = {
    name: 'Test Viajero',
    email: `viajero-${Date.now()}@test.com`,
    password: 'password123'
  };

  const businessUser = {
    name: 'Dueño Negocio',
    email: `dueno-${Date.now()}@test.com`,
    password: 'password123'
  };

  test('Flujo 1: Crear cuenta como Viajero y Agregar Lugar Comunitario', async ({ page }) => {
    // 1. Ir a la nueva pantalla de selección de rol
    await page.goto('/register');
    
    // 2. Elegir opción "Soy Viajero"
    await page.click('text=Soy Viajero / Turista');

    // 3. Llenar el formulario de registro
    await page.fill('input[type="text"]', testUser.name); // Asume que el primero es nombre
    await page.fill('input[type="email"]', testUser.email);
    const passwordInputs = await page.$$('input[type="password"]');
    await passwordInputs[0].fill(testUser.password);
    await passwordInputs[1].fill(testUser.password);
    
    await page.click('button[type="submit"]');

    // 4. Esperar redirección al login
    await page.waitForURL(/\/login/);
    await expect(page.locator('text=Cuenta creada exitosamente')).toBeVisible({ timeout: 10000 });

    // 5. Iniciar sesión
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // 6. Vamos al panel de comunidad
    await page.goto('/add-place');
    
    // Completar el formulario de Agregar Lugar...
    await page.waitForSelector('select', { state: 'visible' });
    const selects = await page.$$('select');
    if (selects.length > 0) await selects[0].selectOption({ index: 1 });

    await page.getByPlaceholder('Ej: Plaza de Armas').fill('Sitio Test ' + Date.now());

    if (selects.length > 1) {
       await selects[1].selectOption('mirador');
    }

    // Usar botón usar mi ubicación
    const gpsBtn = page.getByText(/Usar mi ubicación/i);
    if (await gpsBtn.isVisible()) {
      await gpsBtn.click();
    } else {
      await page.getByPlaceholder('-13.1635').fill('-13.5');
      await page.getByPlaceholder('-74.2243').fill('-74.5');
    }

    const addBtn = page.getByRole('button', { name: /Agregar Lugar/i });
    await addBtn.click();

    await expect(page.locator('text=/✅/i')).toBeVisible({ timeout: 10000 });
  });

  test('Flujo 2: Registro de Negocio (Protegido)', async ({ page }) => {
    // 1. Un usuario intenta registrar un negocio directamente sin cuenta
    await page.goto('/registro-negocio');

    // 2. Debe ver la pantalla que pide iniciar sesión o crear cuenta
    await expect(page.locator('text=Inicia sesión para continuar')).toBeVisible();

    // 3. Hace clic en "Crear Cuenta" (lo lleva a /register/form?callbackUrl=...)
    await page.click('text=Crear Cuenta');

    // 4. Llena el formulario de registro
    await page.fill('input[type="text"]', businessUser.name);
    await page.fill('input[type="email"]', businessUser.email);
    const passwordInputs = await page.$$('input[type="password"]');
    await passwordInputs[0].fill(businessUser.password);
    await passwordInputs[1].fill(businessUser.password);
    
    await page.click('button[type="submit"]');

    // 5. Es redirigido al login, con el callbackUrl intacto
    await page.waitForURL(/\/login/);
    await expect(page.locator('text=Cuenta creada exitosamente')).toBeVisible({ timeout: 10000 });

    // 6. Inicia sesión
    await page.fill('input[type="email"]', businessUser.email);
    await page.fill('input[type="password"]', businessUser.password);
    await page.click('button[type="submit"]');

    // 7. Es redirigido automáticamente de vuelta a /registro-negocio
    await page.waitForURL(/\/registro-negocio/);
    
    // Verifica que los datos del usuario se pre-llenaron (o al menos que está el form visible)
    await expect(page.locator('h1:has-text("Registra tu Negocio")')).toBeVisible();

    // Opcional: Llenar el formulario de registro de negocio
    await page.fill('input[name="name"]', 'Negocio E2E Test');
    await page.selectOption('select[name="category"]', 'restaurant');
    
    // Departamento (CityID selector)
    await page.selectOption('select[name="cityId"]', { index: 1 }); 

    // Los datos del owner ya deberían estar prellenados, pero los sobrescribimos por si acaso
    await page.fill('input[name="ownerName"]', 'Dueño Test');
    await page.fill('input[name="ownerEmail"]', 'dueno@test.com');
    await page.fill('input[name="ownerPhone"]', '999888777');

    // Botón GPS
    await page.click('button:has-text("Obtener mi ubicacion actual")');
    await page.waitForTimeout(1000); 

    await page.click('button[type="submit"]');

    // Buscamos la pantalla de éxito que tiene CheckCircle y texto
    await expect(page.locator('text=Solicitud Enviada')).toBeVisible({ timeout: 15000 });

    // 8. Navegar al dashboard del negocio
    await page.goto('/mis-negocios');
    await expect(page.locator('h1:has-text("Mis Negocios")')).toBeVisible();
    
    // Verificar que el negocio aparece en la lista
    await expect(page.locator('h3:has-text("Negocio E2E Test")')).toBeVisible();
    
    // Verificar que el estado indique "En revisión" (isVerified es false por defecto)
    await expect(page.locator('text=En revisión')).toBeVisible();
  });
});
