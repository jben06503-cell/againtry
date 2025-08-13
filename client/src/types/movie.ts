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
  download_links?: DownloadLink[]
  created_at?: string
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
}

export interface DownloadLink {
  quality: string
  size: string
  url: string
}

export interface AdminUser {
  id: number
  username: string
  password: string
  created_at?: string
}
