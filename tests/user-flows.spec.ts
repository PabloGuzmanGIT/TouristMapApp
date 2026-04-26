import { test, expect } from '@playwright/test';

// Conceder permisos de geolocalización globalmente para todos los tests
test.use({
  geolocation: { longitude: -74.2243, latitude: -13.1635 },
  permissions: ['geolocation'],
});

test.describe('Flujo de validación: Add Place y Registro Negocio', () => {

  const testUser = {
    name: 'Test Automatizado',
    email: `test-${Date.now()}@test.com`,
    password: 'password123'
  };

  test('Flujo 1: Crear cuenta y Agregar Lugar Comunitario', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    // Asumimos botón submit del form de NextAuth (generalmente id u type="submit")
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000); 

    // Vamos al panel de comunidad
    await page.goto('/add-place');
    
    // Seleccionar depto, asumiendo 1 índice válido y renderizado
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

  test('Flujo 2: Registro de Negocio Premium', async ({ page }) => {
    await page.goto('/registro-negocio');

    await page.fill('input[name="name"]', 'Negocio E2E Test');
    await page.selectOption('select[name="category"]', 'restaurant');
    
    // Departamento (CityID selector)
    await page.selectOption('select[name="cityId"]', { index: 1 }); 

    await page.fill('input[name="ownerName"]', 'Dueño Test');
    await page.fill('input[name="ownerEmail"]', 'dueno@test.com');
    await page.fill('input[name="ownerPhone"]', '999888777');

    // Botón GPS
    await page.click('button:has-text("Obtener mi ubicacion actual")');
    await page.waitForTimeout(1000); 

    await page.click('button[type="submit"]');

    // Buscamos la pantalla de éxito que tiene CheckCircle y texto
    await expect(page.locator('text=Solicitud Enviada')).toBeVisible({ timeout: 10000 });
  });
});
