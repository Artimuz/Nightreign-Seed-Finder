// Validation utilities for map components and configurations

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateMapType(mapType: string): ValidationResult {
  const validTypes = ['normal', 'crater', 'mountaintop', 'noklateo', 'rotted', 'greatHollow']
  const result: ValidationResult = {
    isValid: validTypes.includes(mapType),
    errors: [],
    warnings: []
  }

  if (!result.isValid) {
    result.errors.push(`Invalid map type: ${mapType}. Must be one of: ${validTypes.join(', ')}`)
  }

  return result
}

export function validateContainerSize(size: number): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (size <= 0) {
    result.isValid = false
    result.errors.push('Container size must be greater than 0')
  }

  if (size < 100) {
    result.warnings.push('Container size is very small, may cause rendering issues')
  }

  if (size > 5000) {
    result.warnings.push('Container size is very large, may impact performance')
  }

  return result
}

export function validateCoordinate(coord: { x: number; y: number }): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (typeof coord.x !== 'number' || typeof coord.y !== 'number') {
    result.isValid = false
    result.errors.push('Coordinate must have numeric x and y properties')
    return result
  }

  if (isNaN(coord.x) || isNaN(coord.y)) {
    result.isValid = false
    result.errors.push('Coordinate values cannot be NaN')
  }

  if (coord.x < 0 || coord.y < 0) {
    result.warnings.push('Coordinate has negative values')
  }

  if (coord.x > 1000 || coord.y > 1000) {
    result.warnings.push('Coordinate values are outside typical range (0-1000)')
  }

  return result
}

export function validateZoomConfig(config: { min: number; max: number }): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (config.min < 0) {
    result.isValid = false
    result.errors.push('Minimum zoom cannot be negative')
  }

  if (config.max < config.min) {
    result.isValid = false
    result.errors.push('Maximum zoom must be greater than or equal to minimum zoom')
  }

  if (config.max > 5) {
    result.warnings.push('Very high zoom levels may cause performance issues')
  }

  return result
}

export function validateBuildingType(building: string): ValidationResult {
  const validBuildings = [
    'empty', 'church', 'fort', 'township', 'ruins', 'sorcerers', 'mainencampment', 'greatchurch',
    'fort_magic', 'greatchurch_fire', 'greatchurch_holy', 'mainencampment_eletric',
    'mainencampment_fire', 'mainencampment_madness', 'ruins_bleed', 'ruins_blight',
    'ruins_eletric', 'ruins_fire', 'ruins_frostbite', 'ruins_holy', 'ruins_magic',
    'ruins_poison', 'ruins_sleep'
  ]

  const result: ValidationResult = {
    isValid: validBuildings.includes(building),
    errors: [],
    warnings: []
  }

  if (!result.isValid && building) {
    result.errors.push(`Invalid building type: ${building}`)
  }

  return result
}

export function validateNightlordType(nightlord: string): ValidationResult {
  const validNightlords = [
    '', 'empty', '1_Gladius', '2_Adel', '3_Gnoster', '4_Maris', 
    '5_Libra', '6_Fulghor', '7_Caligo', '8_Heolstor'
  ]

  const result: ValidationResult = {
    isValid: validNightlords.includes(nightlord),
    errors: [],
    warnings: []
  }

  if (!result.isValid) {
    result.errors.push(`Invalid nightlord type: ${nightlord}`)
  }

  return result
}

export function validateEventType(eventType: string): ValidationResult {
  const validEvents = [
    'augurraid', 'extraboss', 'fellomen', 'frenzytower', 'gnosterplague',
    'libracurse', 'mausoleum', 'meteorstrike', 'nighthorde', 'sorcerersrise'
  ]

  const result: ValidationResult = {
    isValid: validEvents.includes(eventType),
    errors: [],
    warnings: []
  }

  if (!result.isValid) {
    result.errors.push(`Invalid event type: ${eventType}`)
  }

  return result
}

export function validateSeedNumber(seedNumber: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (!seedNumber) {
    result.isValid = false
    result.errors.push('Seed number is required')
    return result
  }

  const num = parseInt(seedNumber)
  if (isNaN(num)) {
    result.isValid = false
    result.errors.push('Seed number must be a valid number')
    return result
  }

  if (num < 0 || num > 319) {
    result.isValid = false
    result.errors.push('Seed number must be between 0 and 319')
  }

  return result
}

export function validateMapConfiguration(config: {
  mapType?: string
  containerSize?: number
  zoomConfig?: { min: number; max: number }
  selectedBuildings?: Record<string, string>
  selectedNightlord?: string
}): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  // Validate map type
  if (config.mapType) {
    const mapTypeResult = validateMapType(config.mapType)
    result.errors.push(...mapTypeResult.errors)
    result.warnings.push(...mapTypeResult.warnings)
    if (!mapTypeResult.isValid) result.isValid = false
  }

  // Validate container size
  if (config.containerSize) {
    const sizeResult = validateContainerSize(config.containerSize)
    result.errors.push(...sizeResult.errors)
    result.warnings.push(...sizeResult.warnings)
    if (!sizeResult.isValid) result.isValid = false
  }

  // Validate zoom config
  if (config.zoomConfig) {
    const zoomResult = validateZoomConfig(config.zoomConfig)
    result.errors.push(...zoomResult.errors)
    result.warnings.push(...zoomResult.warnings)
    if (!zoomResult.isValid) result.isValid = false
  }

  // Validate buildings
  if (config.selectedBuildings) {
    Object.entries(config.selectedBuildings).forEach(([slotId, building]) => {
      if (building) {
        const buildingResult = validateBuildingType(building)
        if (!buildingResult.isValid) {
          result.isValid = false
          result.errors.push(`Invalid building in slot ${slotId}: ${building}`)
        }
      }
    })
  }

  // Validate nightlord
  if (config.selectedNightlord) {
    const nightlordResult = validateNightlordType(config.selectedNightlord)
    result.errors.push(...nightlordResult.errors)
    result.warnings.push(...nightlordResult.warnings)
    if (!nightlordResult.isValid) result.isValid = false
  }

  return result
}

export function sanitizeMapConfiguration(config: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...config }

  // Sanitize map type
  if (typeof sanitized.mapType === 'string' && !validateMapType(sanitized.mapType).isValid) {
    sanitized.mapType = 'normal'
  }

  // Sanitize container size
  if (typeof sanitized.containerSize === 'number' && !validateContainerSize(sanitized.containerSize).isValid) {
    sanitized.containerSize = 1000
  }

  // Sanitize buildings
  if (sanitized.selectedBuildings && typeof sanitized.selectedBuildings === 'object') {
    const buildings = sanitized.selectedBuildings as Record<string, string>
    Object.keys(buildings).forEach(slotId => {
      const building = buildings[slotId]
      if (typeof building === 'string' && building && !validateBuildingType(building).isValid) {
        buildings[slotId] = ''
      }
    })
  }

  // Sanitize nightlord
  if (typeof sanitized.selectedNightlord === 'string' && !validateNightlordType(sanitized.selectedNightlord).isValid) {
    sanitized.selectedNightlord = ''
  }

  return sanitized
}