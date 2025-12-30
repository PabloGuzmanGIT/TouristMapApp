// Form options for Place edit form

export const PRICE_RANGE_OPTIONS = [
    { value: 'free', label: 'Gratis' },
    { value: '$', label: '$' },
    { value: '$$', label: '$$' },
    { value: '$$$', label: '$$$' },
]

export const DIFFICULTY_OPTIONS = [
    { value: 'easy', label: 'Fácil' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'difficult', label: 'Difícil' },
    { value: 'extreme', label: 'Extremo' },
]

export const SAFETY_LEVEL_OPTIONS = [
    { value: 'very_safe', label: 'Muy Seguro' },
    { value: 'safe', label: 'Seguro' },
    { value: 'caution', label: 'Precaución' },
    { value: 'risky', label: 'Riesgoso' },
]

export const LANGUAGE_OPTIONS = [
    { value: 'es', label: 'Español', icon: '🇪🇸' },
    { value: 'en', label: 'Inglés', icon: '🇺🇸' },
    { value: 'fr', label: 'Francés', icon: '🇫🇷' },
    { value: 'de', label: 'Alemán', icon: '🇩🇪' },
    { value: 'pt', label: 'Portugués', icon: '🇧🇷' },
    { value: 'qu', label: 'Quechua', icon: '🏔️' },
]

export const AMENITY_OPTIONS = [
    { value: 'wifi', label: 'WiFi Gratis', icon: '📶' },
    { value: 'parking', label: 'Estacionamiento', icon: '🅿️' },
    { value: 'restroom', label: 'Baños', icon: '🚻' },
    { value: 'cafeteria', label: 'Cafetería', icon: '☕' },
    { value: 'restaurant', label: 'Restaurante', icon: '🍽️' },
    { value: 'guide', label: 'Guía Turístico', icon: '🎙️' },
    { value: 'souvenirs', label: 'Tienda Souvenirs', icon: '🛍️' },
    { value: 'pets', label: 'Admite Mascotas', icon: '🐕' },
    { value: '24h', label: 'Acceso 24h', icon: '🕐' },
    { value: 'atm', label: 'Cajero/ATM Cerca', icon: '🏧' },
    { value: 'cards', label: 'Acepta Tarjetas', icon: '💳' },
    { value: 'usd', label: 'Acepta Dólares', icon: '💵' },
]

export const ACTIVITY_OPTIONS = [
    { value: 'hiking', label: 'Senderismo', icon: '🥾' },
    { value: 'photography', label: 'Fotografía', icon: '📸' },
    { value: 'camping', label: 'Camping', icon: '⛺' },
    { value: 'birdwatching', label: 'Observación de Aves', icon: '🦅' },
    { value: 'swimming', label: 'Nadar', icon: '🏊' },
    { value: 'climbing', label: 'Escalada', icon: '🧗' },
    { value: 'cycling', label: 'Ciclismo', icon: '🚴' },
    { value: 'boating', label: 'Paseo en Bote', icon: '⛵' },
    { value: 'picnic', label: 'Picnic', icon: '🧺' },
    { value: 'guided_tour', label: 'Tour Guiado', icon: '🎫' },
    { value: 'yoga', label: 'Meditación/Yoga', icon: '🧘' },
    { value: 'fishing', label: 'Pesca', icon: '🎣' },
]

export const TRANSPORT_OPTIONS = [
    { value: 'car', label: 'Auto Propio', icon: '🚗' },
    { value: 'taxi', label: 'Taxi', icon: '🚕' },
    { value: 'bus', label: 'Bus', icon: '🚌' },
    { value: 'tour', label: 'Tour Organizado', icon: '🚐' },
    { value: 'walking', label: 'Caminando', icon: '🚶' },
    { value: 'bike', label: 'Bicicleta', icon: '🚲' },
]

export const SUITABLE_FOR_OPTIONS = [
    { value: 'children', label: 'Niños', icon: '👶' },
    { value: 'seniors', label: 'Adultos Mayores', icon: '👴' },
    { value: 'families', label: 'Familias', icon: '👨‍👩‍👧' },
    { value: 'couples', label: 'Parejas', icon: '💑' },
    { value: 'groups', label: 'Grupos', icon: '👥' },
    { value: 'solo', label: 'Viajero Solo', icon: '🧳' },
]

export const TAG_OPTIONS = [
    { value: 'family', label: 'Familiar' },
    { value: 'adventure', label: 'Aventura' },
    { value: 'nature', label: 'Naturaleza' },
    { value: 'romantic', label: 'Romántico' },
    { value: 'historic', label: 'Histórico' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'photogenic', label: 'Fotogénico' },
    { value: 'relaxing', label: 'Relajante' },
]

// Default empty details structure
export const DEFAULT_PLACE_DETAILS = {
    priceRange: '',
    entryFee: { adult: '', child: '', senior: '', currency: 'PEN' },
    duration: '',
    bestTime: '',

    languages: [] as string[],
    altitude: { meters: '', warning: '' },
    difficulty: '',
    suitableFor: [] as string[],
    whatToBring: '',

    transport: {
        options: [] as string[],
        travelTime: '',
        tourRequired: false,
        nearestCity: '',
    },

    amenities: [] as string[],
    activities: [] as string[],

    accessibility: {
        wheelchair: false,
        elevator: false,
        disabledParking: false,
        braille: false,
        audioGuide: false,
    },

    restrictions: {
        photoAllowed: true,
        dressCode: '',
        dronesAllowed: false,
        safetyLevel: 'safe',
        safetyTips: '',
    },

    description: '',
    tags: [] as string[],
}

export type PlaceDetails = typeof DEFAULT_PLACE_DETAILS
