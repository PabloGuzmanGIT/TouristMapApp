/**
 * Convert DMS (Degrees, Minutes, Seconds) coordinates to Decimal
 * 
 * Examples:
 * - "13°09'27\"S" → -13.1575
 * - "74°12'59\"W" → -74.2164
 * - "13°09'27\"N" → 13.1575
 * - "74°12'59\"E" → 74.2164
 */
export function dmsToDecimal(dms: string): number | null {
    // Remove extra spaces
    dms = dms.trim()

    // Match DMS pattern: 13°09'27"S or 13°09'27.5"S
    const regex = /^(\d+)°\s*(\d+)'\s*([\d.]+)"?\s*([NSEW])$/i
    const match = dms.match(regex)

    if (!match) return null

    const degrees = parseFloat(match[1])
    const minutes = parseFloat(match[2])
    const seconds = parseFloat(match[3])
    const direction = match[4].toUpperCase()

    // Calculate decimal
    let decimal = degrees + minutes / 60 + seconds / 3600

    // Apply sign based on direction
    if (direction === 'S' || direction === 'W') {
        decimal = -decimal
    }

    return parseFloat(decimal.toFixed(6))
}

/**
 * Parse coordinate input - accepts both decimal and DMS formats
 */
export function parseCoordinate(input: string): number | null {
    input = input.trim()

    // Try DMS format first
    const dmsResult = dmsToDecimal(input)
    if (dmsResult !== null) return dmsResult

    // Try decimal format
    const decimal = parseFloat(input)
    if (!isNaN(decimal)) return decimal

    return null
}

/**
 * Example usage:
 * 
 * parseCoordinate("13°09'27\"S") → -13.1575
 * parseCoordinate("-13.1575") → -13.1575
 * parseCoordinate("74°12'59\"W") → -74.2164
 */
