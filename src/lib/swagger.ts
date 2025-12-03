// src/lib/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tourism Map API',
            version: '1.0.0',
            description: 'API documentation for the Tourism Map application - Explore cities, areas, and places',
            contact: {
                name: 'Tourism Map Team',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server (default)',
            },
            {
                url: 'http://localhost:3002',
                description: 'Development server (alternative)',
            },
            {
                url: 'https://your-production-url.com',
                description: 'Production server',
            },
        ],
        components: {
            schemas: {
                Place: {
                    type: 'object',
                    required: ['id', 'citySlug', 'slug', 'name', 'category', 'lat', 'lng'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier',
                        },
                        citySlug: {
                            type: 'string',
                            description: 'City slug identifier',
                            example: 'ayacucho',
                        },
                        areaSlug: {
                            type: 'string',
                            description: 'Area slug identifier (optional)',
                            example: 'quinua',
                        },
                        slug: {
                            type: 'string',
                            description: 'Place slug identifier',
                            example: 'plaza-mayor',
                        },
                        name: {
                            type: 'string',
                            description: 'Place name',
                            example: 'Plaza Mayor de Ayacucho',
                        },
                        category: {
                            type: 'string',
                            enum: [
                                'restaurant', 'cafe', 'bar', 'market',
                                'turistico', 'historico', 'museo', 'iglesia', 'plaza_parque', 'centro_cultural',
                                'naturaleza', 'mirador', 'sendero', 'cascada_laguna',
                                'tienda', 'artesania',
                                'servicio', 'salud', 'banco', 'policia', 'municipalidad', 'transporte',
                                'infoturismo', 'cowork', 'gasolinera',
                                'alojamiento', 'instagrameable', 'random'
                            ],
                            description: 'Place category',
                        },
                        featured: {
                            type: 'boolean',
                            description: 'Whether the place is featured',
                            default: false,
                        },
                        lat: {
                            type: 'number',
                            format: 'float',
                            description: 'Latitude coordinate',
                            example: -13.16359,
                        },
                        lng: {
                            type: 'number',
                            format: 'float',
                            description: 'Longitude coordinate',
                            example: -74.22434,
                        },
                        short: {
                            type: 'string',
                            description: 'Short description',
                            example: 'Corazón histórico con portales coloniales.',
                        },
                        images: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uri',
                            },
                            description: 'Array of image URLs',
                        },
                        bookingUrl: {
                            type: 'string',
                            format: 'uri',
                            description: 'Booking URL',
                        },
                        website: {
                            type: 'string',
                            format: 'uri',
                            description: 'Website URL',
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number',
                        },
                        address: {
                            type: 'string',
                            description: 'Physical address',
                        },
                    },
                },
                Area: {
                    type: 'object',
                    required: ['id', 'slug', 'name'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier',
                        },
                        slug: {
                            type: 'string',
                            description: 'Area slug',
                            example: 'quinua',
                        },
                        name: {
                            type: 'string',
                            description: 'Area name',
                            example: 'Quinua',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/app/api/**/*.ts'], // Path to the API routes
}

export const swaggerSpec = swaggerJsdoc(options)
