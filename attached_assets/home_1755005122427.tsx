import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Movie } from "@shared/schema";
import Header from "@/components/header";
import MovieCard from "@/components/movie-card";
import MovieModal from "@/components/movie-modal";
import TrendingSection from "@/components/trending-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Download, Star, TrendingUp, Clock, Users } from "lucide-react";
import { type SearchFilters } from "@/components/advanced-search";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: movies, isLoading, error } = useQuery<Movie[]>({
    queryKey: ["https://cine-freak-clone-git-main-rajus-projects-5dda1627.vercel.app/api/movies"],
  });

  // Filter movies based on category and search
  useEffect(() => {
    if (!movies) return;

    let filtered = movies;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(movie => 
        movie.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        movie.director?.toLowerCase().includes(query) ||
        movie.cast?.toLowerCase().includes(query)
      );
    }

    setFilteredMovies(filtered);
  }, [movies, selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when filtering by category
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    if (!movies) return;

    let filtered = movies;

    // Apply search query
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        (movie.cast && movie.cast.toLowerCase().includes(query)) ||
        (movie.director && movie.director.toLowerCase().includes(query))
      );
    }

    // Apply genre filter
    if (filters.genre && !filters.genre.startsWith("All")) {
      filtered = filtered.filter(movie => 
        movie.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // Apply year filter
    if (filters.year && !filters.year.startsWith("All")) {
      filtered = filtered.filter(movie => 
        movie.year.toString() === filters.year
      );
    }

    // Apply quality filter
    if (filters.quality && !filters.quality.startsWith("All")) {
      filtered = filtered.filter(movie => 
        movie.quality.toLowerCase().includes(filters.quality.toLowerCase())
      );
    }

    // Apply language filter
    if (filters.language && !filters.language.startsWith("All")) {
      filtered = filtered.filter(movie => 
        movie.language.toLowerCase().includes(filters.language.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
    setSelectedCategory(""); // Clear category selection
    setSearchQuery(""); // Clear simple search
  };

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header 
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onAdvancedSearch={handleAdvancedSearch}
          selectedCategory={selectedCategory}
        />
        <div className="container mx-auto px-4 py-6">
          <Alert className="bg-gray-800 border-gray-700">
            <AlertDescription className="text-white">
              Failed to load movies. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onAdvancedSearch={handleAdvancedSearch}
        selectedCategory={selectedCategory}
      />
      
      <main>
        {/* Hero Section */}
        {!selectedCategory && !searchQuery && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="container mx-auto px-4 py-12">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Download Latest Movies
                  <span className="block text-red-500">HD Quality</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Watch and download the latest movies in HDTC, WEB-DL quality. 
                  Available in 480p, 720p, and 1080p with ESub.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Download className="h-6 w-6 text-red-500" />
                      <div>
                        <div className="text-2xl font-bold text-white">{movies?.length || 0}</div>
                        <div className="text-gray-400 text-sm">Movies</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <div>
                        <div className="text-2xl font-bold text-white">4.8</div>
                        <div className="text-gray-400 text-sm">Rating</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold text-white">10K+</div>
                        <div className="text-gray-400 text-sm">Users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6">
          {/* Featured Alert */}
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Flame className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-white">🔥 Latest Releases</h3>
                <p className="text-gray-300 text-sm">
                  Download and watch latest movies in HDTC, WEB-DL quality with 480p, 720p & 1080p options!
                </p>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <p className="text-gray-300">
                  Showing results for "<span className="text-white font-semibold">{searchQuery}</span>"
                  {filteredMovies.length > 0 && (
                    <span className="text-gray-400"> ({filteredMovies.length} movies found)</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Trending Section - Show only when no filters applied */}
          {!selectedCategory && !searchQuery && movies && (
            <TrendingSection movies={movies} />
          )}

          {/* Category Filter Info */}
          {selectedCategory && !searchQuery && (
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-500" />
                <p className="text-gray-300">
                  Showing <span className="text-white font-semibold">{selectedCategory}</span> movies
                  {filteredMovies.length > 0 && (
                    <span className="text-gray-400"> ({filteredMovies.length} movies)</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 18 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-64 w-full bg-gray-800" />
                  <Skeleton className="h-4 w-3/4 bg-gray-800" />
                  <Skeleton className="h-3 w-1/2 bg-gray-800" />
                </div>
              ))}
            </div>
          )}

          {/* Movie Grid */}
          {!isLoading && (
            <>
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredMovies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto border border-gray-700">
                    <Download className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchQuery 
                        ? `No movies found for "${searchQuery}"`
                        : selectedCategory 
                          ? `No movies found in ${selectedCategory}`
                          : "No movies available"
                      }
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your search criteria or browse all movies
                    </p>
                    {(searchQuery || selectedCategory) && (
                      <Button 
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("");
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Show All Movies
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {filteredMovies.length > 0 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button className="bg-gray-800 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-700 transition-colors text-white">
                    Previous
                  </Button>
                  <Button className="bg-red-600 px-4 py-2 text-sm text-white">
                    1
                  </Button>
                  <Button className="bg-gray-800 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-700 transition-colors text-white">
                    2
                  </Button>
                  <Button className="bg-gray-800 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-700 transition-colors text-white">
                    3
                  </Button>
                  <Button className="bg-gray-800 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-700 transition-colors text-white">
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Movie Modal */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Disclaimer */}
      <div className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h4 className="font-semibold mb-3 text-red-400 flex items-center">
                <Flame className="h-5 w-5 mr-2" />
                Disclaimer for Users
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                ATB Tech assumes no liability with respect to advertising or betting applications/websites on this site. 
                Visitors register or deposit on advertisement websites/apps at their own risk. ATB Tech is not responsible for this.
              </p>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <h4 className="font-semibold mb-3 text-yellow-400 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Important Note
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                We do not host any files on our server. All files shared here are collected from the internet from various 
                Encoders and hosted on third-party sites. We do not accept responsibility for content hosted on third-party websites. 
                We just index those links which are already available on the internet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
