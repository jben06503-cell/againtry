import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, LogOut, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { apiRequest, queryClient } from '@/lib/queryClient'

import { Movie, MovieFormData } from '@/types/movie'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const { toast } = useToast()

  const { register: loginRegister, handleSubmit: handleLoginSubmit } = useForm<{
    username: string
    password: string
  }>()

  const { register, handleSubmit, reset, setValue } = useForm<MovieFormData>()

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['/api/movies'],
    queryFn: async () => {
      const response = await fetch('/api/movies')
      if (!response.ok) throw new Error('Failed to fetch movies')
      return response.json()
    },
    enabled: isLoggedIn,
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
    },
    onSuccess: () => {
      setIsLoggedIn(true)
      toast({ title: 'Login successful' })
    },
    onError: () => {
      toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' })
    },
  })

  const addMovieMutation = useMutation({
    mutationFn: async (movieData: MovieFormData) => {
      return apiRequest('/api/movies', {
        method: 'POST',
        body: JSON.stringify(movieData),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] })
      setShowAddForm(false)
      reset()
      toast({ title: 'Movie added successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to add movie', variant: 'destructive' })
    },
  })

  const updateMovieMutation = useMutation({
    mutationFn: async ({ id, ...movieData }: MovieFormData & { id: number }) => {
      return apiRequest(`/api/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(movieData),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] })
      setEditingMovie(null)
      reset()
      toast({ title: 'Movie updated successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to update movie', variant: 'destructive' })
    },
  })

  const deleteMovieMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/movies/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/movies'] })
      toast({ title: 'Movie deleted successfully' })
    },
    onError: () => {
      toast({ title: 'Failed to delete movie', variant: 'destructive' })
    },
  })

  const onLogin = (data: { username: string; password: string }) => {
    loginMutation.mutate(data)
  }

  const onAddMovie = (data: MovieFormData) => {
    addMovieMutation.mutate(data)
  }

  const onUpdateMovie = (data: MovieFormData) => {
    if (editingMovie) {
      updateMovieMutation.mutate({ ...data, id: editingMovie.id })
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setValue('title', movie.title)
    setValue('year', movie.year)
    setValue('genre', movie.genre)
    setValue('language', movie.language)
    setValue('quality', movie.quality)
    setValue('resolution', movie.resolution)
    setValue('size', movie.size)
    setValue('poster', movie.poster)
    setValue('category', movie.category)
    setValue('plot', movie.plot || '')
    setValue('director', movie.director || '')
    setValue('cast', movie.cast || '')
    setValue('duration', movie.duration || '')
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      deleteMovieMutation.mutate(id)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <div className="text-center mb-6">
            <Film className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-400">Enter your credentials to access the admin panel</p>
          </div>
          
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                {...loginRegister('username', { required: true })}
                type="text"
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                {...loginRegister('password', { required: true })}
                type="password"
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Movie
              </Button>
              <Button
                onClick={() => setIsLoggedIn(false)}
                variant="ghost"
                className="text-white hover:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add/Edit Movie Form */}
        {(showAddForm || editingMovie) && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingMovie ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <form
              onSubmit={handleSubmit(editingMovie ? onUpdateMovie : onAddMovie)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  {...register('title', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year *</label>
                <Input
                  {...register('year', { required: true, valueAsNumber: true })}
                  type="number"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Genre *</label>
                <Input
                  {...register('genre', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language *</label>
                <Input
                  {...register('language', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quality *</label>
                <Input
                  {...register('quality', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., HD, FHD, 4K"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Resolution *</label>
                <Input
                  {...register('resolution', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 1920x1080"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Size *</label>
                <Input
                  {...register('size', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 2.5GB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Input
                  {...register('category', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Poster URL *</label>
                <Input
                  {...register('poster', { required: true })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Director</label>
                <Input
                  {...register('director')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cast</label>
                <Input
                  {...register('cast')}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Input
                  {...register('duration')}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., 2h 30m"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Plot</label>
                <textarea
                  {...register('plot')}
                  rows={3}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400"
                  placeholder="Movie plot summary..."
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700"
                  disabled={addMovieMutation.isPending || updateMovieMutation.isPending}
                >
                  {editingMovie ? 'Update Movie' : 'Add Movie'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingMovie(null)
                    reset()
                  }}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Movies List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Movies ({movies.length})</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="w-16 h-24 bg-gray-700 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : movies.length === 0 ? (
            <div className="p-8 text-center">
              <Film className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No movies found. Add your first movie!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {movies.map((movie: Movie) => (
                <div key={movie.id} className="p-4 flex items-center space-x-4">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{movie.title}</h3>
                    <p className="text-gray-400">
                      {movie.year} • {movie.genre} • {movie.quality}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movie.language} • {movie.size}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(movie)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(movie.id)}
                      size="sm"
                      variant="destructive"
                      disabled={deleteMovieMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}