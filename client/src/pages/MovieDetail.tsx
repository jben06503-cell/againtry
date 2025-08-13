import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'wouter'
import { ArrowLeft, Calendar, Clock, Star, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Movie } from '@/types/movie'

export default function MovieDetail() {
  const { id } = useParams()
  const [, setLocation] = useLocation()

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: ['/api/movies', id],
    queryFn: async () => {
      const response = await fetch(`/api/movies/${id}`)
      if (!response.ok) throw new Error('Movie not found')
      return response.json()
    },
  })

  const handleBackClick = () => {
    setLocation('/')
  }

  if (error || (!isLoading && !movie)) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
            <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
            <Button onClick={handleBackClick} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-800 animate-pulse rounded-lg"></div>
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="h-8 bg-gray-800 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 animate-pulse rounded w-1/2"></div>
              <div className="h-20 bg-gray-800 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={handleBackClick}
          variant="ghost"
          className="mb-6 text-white hover:text-red-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Quality:</span>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                    {movie.quality}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Resolution:</span>
                  <span>{movie.resolution}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Size:</span>
                  <span>{movie.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Language:</span>
                  <span>{movie.language}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {movie.year}
                  </div>
                  {movie.duration && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {movie.duration}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {movie.genre}
                  </div>
                </div>
              </div>

              {/* Plot */}
              {movie.plot && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Plot</h2>
                  <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
                </div>
              )}

              {/* Cast and Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.director && (
                  <div>
                    <h3 className="font-semibold mb-2">Director</h3>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                )}
                {movie.cast && (
                  <div>
                    <h3 className="font-semibold mb-2">Cast</h3>
                    <p className="text-gray-300">{movie.cast}</p>
                  </div>
                )}
              </div>

              {/* Screenshots */}
              {movie.screenshots && movie.screenshots.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.screenshots.map((screenshot: string, index: number) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Download Links */}
              {movie.download_links && movie.download_links.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Download Links</h2>
                  <div className="space-y-3">
                    {movie.download_links.map((link: any, index: number) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{link.name || `Download ${index + 1}`}</h4>
                            <p className="text-sm text-gray-400">{link.size || movie.size}</p>
                          </div>
                          <Button
                            onClick={() => window.open(link.url, '_blank')}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Watch Online */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Watch Online</h2>
                <p className="text-gray-400 mb-4">
                  Stream this movie online in high quality
                </p>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Eye className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}