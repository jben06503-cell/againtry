import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'wouter'
import { Film, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Movie {
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
  created_at?: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['/api/movies', selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/movies?${params}`)
      if (!response.ok) throw new Error('Failed to fetch movies')
      return response.json()
    },
  })

  const categories = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Thriller']

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold">MovieStream</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-red-400">
                  Home
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className="text-white hover:text-red-400">
                  Admin
                </Button>
              </Link>
            </nav>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <section className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 aspect-[2/3] rounded-lg"></div>
                <div className="mt-2 h-4 bg-gray-800 rounded"></div>
                <div className="mt-1 h-3 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">No Movies Found</h2>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map((movie: Movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-600 hover:bg-red-700">
                        View Details
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.quality}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {movie.year} • {movie.genre}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 MovieStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}