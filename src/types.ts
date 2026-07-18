export interface Place {
  label: string;
  coords: [number, number] | `${number},${number}`;
  current?: boolean;
  image?: string;
}

export type MapData = {
  color: string;
  label: string;
  places: Place[];
}[];
