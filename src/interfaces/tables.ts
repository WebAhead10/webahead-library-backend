export interface Tag {
  tag_name: string
  id: number
}

export interface Overlay {
  coords: string
  id: number
}

export interface OverlayCoord {
  x: number
  y: number
  height: number
  width: number
}

export interface Newspaper {
  id: number
  published_date: Date
  publisher_id: number
  newspaper_key: string
}
