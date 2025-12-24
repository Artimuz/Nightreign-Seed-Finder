export interface Coordinate {
  id: string
  x: number
  y: number
}
export const BUILDING_SLOT_COORDINATES: Coordinate[] = [
  { id: "01", x: 400, y: 180 },
  { id: "02", x: 710, y: 210 },
  { id: "03", x: 535, y: 225 },
  { id: "04", x: 232, y: 281 },
  { id: "05", x: 628, y: 293 },
  { id: "06", x: 412, y: 303 },
  { id: "07", x: 776, y: 361 },
  { id: "08", x: 217, y: 354 },
  { id: "09", x: 693, y: 370 },
  { id: "10", x: 357, y: 395 },
  { id: "11", x: 580, y: 430 },
  { id: "12", x: 774, y: 425 },
  { id: "13", x: 282, y: 447 },
  { id: "14", x: 663, y: 465 },
  { id: "15", x: 318, y: 550 },
  { id: "16", x: 205, y: 555 },
  { id: "17", x: 804, y: 576 },
  { id: "18", x: 629, y: 585 },
  { id: "19", x: 550, y: 630 },
  { id: "20", x: 753, y: 631 },
  { id: "21", x: 276, y: 650 },
  { id: "22", x: 610, y: 690 },
  { id: "23", x: 452, y: 695 },
  { id: "24", x: 199, y: 710 },
  { id: "25", x: 745, y: 740 },
  { id: "26", x: 400, y: 780 },
  { id: "27", x: 566, y: 795 }
]

export const NIGHTLORD_COORDINATE: Coordinate = {
  id: "nightlord",
  x: 111,
  y: 900
}

export const NIGHTLORD_STATUS_CARD_COORDINATE: Coordinate = {
  id: "nightlord_status_card",
  x: 85,
  y: 940
}

export const EVENT_COORDINATE: Coordinate = {
  id: "event",
  x: 900,
  y: 100
}

export const INTERACTIVE_COORDINATES: Coordinate[] = [
  ...BUILDING_SLOT_COORDINATES,
  NIGHTLORD_COORDINATE
]

export const ALL_MAP_COORDINATES: Coordinate[] = [
  ...BUILDING_SLOT_COORDINATES,
  NIGHTLORD_COORDINATE,
  NIGHTLORD_STATUS_CARD_COORDINATE,
  EVENT_COORDINATE
]
export const getCoordinateById = (id: string): Coordinate | undefined => {
  return ALL_MAP_COORDINATES.find(coord => coord.id === id)
}

export const getBuildingSlotCoordinates = (): Coordinate[] => {
  return BUILDING_SLOT_COORDINATES
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

export const isBuildingSlot = (id: string): boolean => {
  return BUILDING_SLOT_COORDINATES.some(coord => coord.id === id)
}

export const isNightlordSlot = (id: string): boolean => {
  return id === "nightlord"
}

export const isEventSlot = (id: string): boolean => {
  return id === "event"
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