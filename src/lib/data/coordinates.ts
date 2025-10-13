import { Coordinates } from '@/lib/types';
import coordsData from '../../../data/coordsXY.json';
export const coordinates: Coordinates[] = coordsData as Coordinates[];
export const getCoordinateById = (id: string): Coordinates | undefined => {
  return coordinates.find(coord => coord.id === id);
};
export const getSlotCoordinates = (): Coordinates[] => {
  return coordinates.filter(coord => coord.id !== 'nightlord');
};
export const getNightlordCoordinates = (): Coordinates | undefined => {
  return coordinates.find(coord => coord.id === 'nightlord');
};