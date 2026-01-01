export interface Coordinate {
  id: string
  x: number
  y: number
}

const normalizeMapTypeKey = (mapType?: string): string => {
  return (mapType ?? '').toLowerCase().replace(/\s+/g, '').replace(',', '')
}

export const BUILDING_SLOT_COORDINATES_27: Coordinate[] = [
  { id: '1', x: 400, y: 180 },
  { id: '2', x: 710, y: 210 },
  { id: '3', x: 535, y: 225 },
  { id: '4', x: 232, y: 281 },
  { id: '5', x: 628, y: 293 },
  { id: '6', x: 412, y: 303 },
  { id: '7', x: 776, y: 361 },
  { id: '8', x: 217, y: 354 },
  { id: '9', x: 693, y: 370 },
  { id: '10', x: 357, y: 395 },
  { id: '11', x: 580, y: 430 },
  { id: '12', x: 774, y: 425 },
  { id: '13', x: 282, y: 447 },
  { id: '14', x: 663, y: 465 },
  { id: '15', x: 318, y: 550 },
  { id: '16', x: 205, y: 555 },
  { id: '17', x: 804, y: 576 },
  { id: '18', x: 629, y: 585 },
  { id: '19', x: 550, y: 630 },
  { id: '20', x: 753, y: 631 },
  { id: '21', x: 276, y: 650 },
  { id: '22', x: 610, y: 690 },
  { id: '23', x: 452, y: 695 },
  { id: '24', x: 199, y: 710 },
  { id: '25', x: 745, y: 740 },
  { id: '26', x: 400, y: 780 },
  { id: '27', x: 566, y: 795 }
]

export const BUILDING_SLOT_COORDINATES_GREAT_HOLLOW_13: Coordinate[] = [
  { id: '1', x: 347, y: 312 },
  { id: '2', x: 733, y: 347 },
  { id: '3', x: 770, y: 414 },
  { id: '4', x: 612, y: 512 },
  { id: '5', x: 353, y: 525 },
  { id: '6', x: 253, y: 579 },
  { id: '7', x: 641, y: 655 },
  { id: '8', x: 280, y: 683 },
  { id: '9', x: 361, y: 773 },
  { id: '10', x: 453, y: 779 },
  { id: '11', x: 921, y: 806 },
  { id: '12', x: 881, y: 898 },
  { id: '13', x: 685, y: 931 }
]

export const NIGHTLORD_COORDINATE: Coordinate = {
  id: 'nightlord',
  x: 111,
  y: 900
}

export const NIGHTLORD_STATUS_CARD_COORDINATE: Coordinate = {
  id: 'nightlord_status_card',
  x: 85,
  y: 940
}

export const EVENT_COORDINATE: Coordinate = {
  id: 'event',
  x: 900,
  y: 100
}

export const getBuildingSlotCoordinates = (mapType?: string): Coordinate[] => {
  const normalized = normalizeMapTypeKey(mapType)
  if (normalized === 'greathollow') return BUILDING_SLOT_COORDINATES_GREAT_HOLLOW_13
  return BUILDING_SLOT_COORDINATES_27
}

export const getInteractiveCoordinates = (mapType?: string): Coordinate[] => {
  return [...getBuildingSlotCoordinates(mapType), NIGHTLORD_COORDINATE]
}

export const getAllMapCoordinates = (mapType?: string): Coordinate[] => {
  return [
    ...getBuildingSlotCoordinates(mapType),
    NIGHTLORD_COORDINATE,
    NIGHTLORD_STATUS_CARD_COORDINATE,
    EVENT_COORDINATE
  ]
}

export const getCoordinateById = (id: string, mapType?: string): Coordinate | undefined => {
  return getAllMapCoordinates(mapType).find(coord => coord.id === id)
}

export const getNightlordCoordinate = (): Coordinate => {
  return NIGHTLORD_COORDINATE
}

export const getNightlordStatusCardCoordinate = (): Coordinate => {
  return NIGHTLORD_STATUS_CARD_COORDINATE
}

export const getEventCoordinate = (): Coordinate => {
  return EVENT_COORDINATE
}

export const isBuildingSlot = (id: string, mapType?: string): boolean => {
  return getBuildingSlotCoordinates(mapType).some(coord => coord.id === id)
}

export const isNightlordSlot = (id: string): boolean => {
  return id === 'nightlord'
}

export const isEventSlot = (id: string): boolean => {
  return id === 'event'
}

export const scaleCoordinate = (coordinate: Coordinate, containerSize: number): { x: number, y: number } => {
  const scaleFactor = containerSize / 1000
  return {
    x: coordinate.x * scaleFactor,
    y: coordinate.y * scaleFactor
  }
}

export const toLeafletCoordinates = (coordinate: Coordinate, containerSize: number): [number, number] => {
  const scaled = scaleCoordinate(coordinate, containerSize)
  return [containerSize - scaled.y, scaled.x]
}

export const INTERACTIVE_COORDINATES: Coordinate[] = getInteractiveCoordinates()

export const ALL_MAP_COORDINATES: Coordinate[] = getAllMapCoordinates()

export const BUILDING_SLOT_COORDINATES: Coordinate[] = BUILDING_SLOT_COORDINATES_27
