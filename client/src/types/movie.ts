export interface Movie {
  id: number
  title: string
  year: number
  genre: string
  language: string
  quality: string
  resolution: string
  size: string
  poster: string
  category: string
  plot?: string
  director?: string
  cast?: string
  duration?: string
  screenshots?: string[]
  download_links?: any[]
}

export interface MovieFormData {
  title: string
  year: number
  genre: string
  language: string
  quality: string
  resolution: string
  size: string
  poster: string
  category: string
  plot?: string
  director?: string
  cast?: string
  duration?: string
  screenshots?: string[]
  download_links?: any[]
}
