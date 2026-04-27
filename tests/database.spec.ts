import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Database Schema Updates - Phase 1', () => {
  let testUserId: string;
  let testPlaceId: string;
  let testCityId: string;

  test.beforeAll(async () => {
    // Asegurar que hay una ciudad para poder crear el lugar
    const city = await prisma.city.create({
      data: {
        slug: 'test-city-phase1',
        name: 'Test City',
        centerLat: 0,
        centerLng: 0,
      }
    });
    testCityId = city.id;
  });

  test.afterAll(async () => {
    // Limpiar BD
    if (testPlaceId) {
      await prisma.place.deleteMany({ where: { id: testPlaceId } });
    }
    if (testUserId) {
      await prisma.user.deleteMany({ where: { id: testUserId } });
    }
    if (testCityId) {
      await prisma.city.deleteMany({ where: { id: testCityId } });
    }
    await prisma.$disconnect();
  });

  test('debería poder crear un lugar con ownerId y isVerified por defecto en false', async () => {
    // 1. Crear un usuario de prueba (dueño)
    const user = await prisma.user.create({
      data: {
        email: 'owner_test_phase1@explora.com',
        name: 'Dueño de Prueba',
        role: 'owner',
      }
    });
    testUserId = user.id;

    // 2. Crear un negocio asociado a ese usuario
    const place = await prisma.place.create({
      data: {
        slug: 'test-negocio-phase1',
        name: 'Negocio de Prueba',
        category: 'restaurant',
        lat: -12.0,
        lng: -77.0,
        cityId: testCityId,
        ownerId: testUserId, // Verificando el nuevo campo
      }
    });
    testPlaceId = place.id;

    // 3. Verificaciones (Asserts)
    expect(place.id).toBeDefined();
    expect(place.ownerId).toBe(testUserId);
    expect(place.isVerified).toBe(false); // isVerified debe ser false por defecto

    // 4. Verificar la relación desde el usuario
    const userWithPlaces = await prisma.user.findUnique({
      where: { id: testUserId },
      include: { places: true }
    });

    expect(userWithPlaces?.places).toHaveLength(1);
    expect(userWithPlaces?.places[0].slug).toBe('test-negocio-phase1');
  });

  test('debería permitir actualizar isVerified a true', async () => {
    const updatedPlace = await prisma.place.update({
      where: { id: testPlaceId },
      data: { isVerified: true }
    });

    expect(updatedPlace.isVerified).toBe(true);
  });
});
