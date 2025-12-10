// Slogans personalizados para cada departamento del Perú
export const citySlogans: Record<string, string> = {
    'amazonas': 'Descubre la majestuosidad de Kuélap y las cataratas de Gocta. Naturaleza y cultura ancestral en el norte del Perú.',
    'ancash': 'Explora el Callejón de Huaylas y la Cordillera Blanca. Aventura, montañas nevadas y lagunas de ensueño.',
    'apurimac': 'Tierra del Señor que Habla. Descubre cañones profundos, tradiciones andinas y el legado de los Chankas.',
    'arequipa': 'La Ciudad Blanca te espera con su arquitectura colonial, el Cañón del Colca y una gastronomía inigualable.',
    'ayacucho': 'Descubre la historia, cultura y belleza de la ciudad de las iglesias. Tu guía definitiva para explorar lo mejor de Ayacucho.',
    'cajamarca': 'Donde el imperio Inca se encontró con la conquista. Baños del Inca, ventanillas de Otuzco y tradición cajamarquina.',
    'callao': 'Puerto histórico del Perú. Explora la Fortaleza del Real Felipe, islas Palomino y la gastronomía chalaca.',
    'cusco': 'Ombligo del mundo y capital del Imperio Inca. Machu Picchu, Valle Sagrado y la magia andina te esperan.',
    'huancavelica': 'Descubre las minas de mercurio, aguas termales y la auténtica cultura andina en el corazón de los Andes.',
    'huanuco': 'Cuna de Kotosh y el Templo de las Manos Cruzadas. Historia milenaria y naturaleza en la selva alta.',
    'ica': 'Oasis en el desierto. Paracas, Nazca, Huacachina y la Ruta del Pisco te esperan bajo el sol eterno.',
    'junin': 'Tierra del Valle del Mantaro. Tradición, artesanía, el lago Junín y la batalla que selló nuestra independencia.',
    'la-libertad': 'Cuna de la civilización Moche y Chimú. Chan Chan, Huanchaco y la eterna primavera trujillana.',
    'lambayeque': 'Reino del Señor de Sipán. Descubre tumbas reales, pirámides y la riqueza arqueológica del norte.',
    'lima': 'Capital del Perú. Historia colonial, gastronomía de clase mundial y la modernidad de la ciudad de los reyes.',
    'loreto': 'Puerta de entrada a la Amazonía peruana. Iquitos, el río Amazonas y la biodiversidad más rica del planeta.',
    'madre-de-dios': 'Corazón de la selva amazónica. Reserva de Tambopata, Manu y la capital de la biodiversidad del Perú.',
    'moquegua': 'Valle del sol eterno. Pisco, vino, playas del sur y el legado de Tiwanaku en tierras peruanas.',
    'pasco': 'Ciudad de los tres pisos. Minas de plata, bosques de piedra y la Selva Central te esperan.',
    'piura': 'Playas del norte, manglares de Tumbes y la calidez piurana. Sol, mar y tradición norteña.',
    'puno': 'Capital folklórica del Perú. Lago Titicaca, islas flotantes y la magia de la cultura altiplánica.',
    'san-martin': 'Selva alta exuberante. Cataratas de Ahuashiyacu, Laguna Azul y la tierra del café y el cacao.',
    'tacna': 'Ciudad heroica del sur. Historia, el morro de Arica y la puerta de entrada al Perú desde Chile.',
    'tumbes': 'Playas tropicales y manglares únicos. El Caribe peruano te espera con sol todo el año.',
    'ucayali': 'Pucallpa y la magia shipiba. Lago Yarinacocha, artesanía ancestral y la puerta a la Amazonía central.',
}

export function getCitySlogan(citySlug: string): string {
    return citySlogans[citySlug] || `Descubre la belleza, historia y cultura de ${citySlug}. Tu guía para explorar lo mejor de esta región.`
}
