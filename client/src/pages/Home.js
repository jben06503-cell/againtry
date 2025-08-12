import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Play, Download, Star, Calendar, Clock, Film } from "lucide-react";
const categories = [
    "Animation", "Bangla Dubbed", "Bangla Movies", "Chinese", "Chorki",
    "DC Movies", "Dual Audio", "English Movies", "German", "Hindi Movies",
    "Horror", "Hoichoi", "Indonesian", "Japanese", "Kannada", "Korean",
    "Malayalam", "MCU", "Others", "Tamil", "Telugu", "Turkish",
    "Hindi Dubbed Movies", "Spanish", "WEB-Series"
];
export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);
    const { data: movies, isLoading, error } = useQuery({
        queryKey: ["/api/movies"],
    });
    // Filter movies based on category and search
    useEffect(() => {
        if (!movies)
            return;
        let filtered = movies;
        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(movie => movie.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(movie => movie.title.toLowerCase().includes(query) ||
                movie.genre.toLowerCase().includes(query) ||
                movie.director?.toLowerCase().includes(query) ||
                movie.cast?.toLowerCase().includes(query));
        }
        setFilteredMovies(filtered);
    }, [movies, selectedCategory, searchQuery]);
    const handleSearch = (e) => {
        e.preventDefault();
    };
    const handleCategoryClick = (category) => {
        setSelectedCategory(selectedCategory === category ? "" : category);
        setSearchQuery("");
    };
    if (error) {
        return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Movies</h2>
          <p className="text-gray-400">Please try again later.</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Film className="h-8 w-8 text-red-500"/>
                <span className="text-2xl font-bold">
                  <span className="text-blue-500">CINE</span>
                  <span className="text-red-500">FREAK</span>
                  <span className="text-gray-300">.NET</span>
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input type="text" placeholder="Search movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 cine-input"/>
                <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-3 text-xs bg-green-600 hover:bg-green-700">
                  SEARCH
                </Button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-sm">
                🔞 18+ MOVIES
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                📱 JOIN TELEGRAM
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white text-sm">
                📥 HOW TO DOWNLOAD
              </Button>
              <Link href="/admin">
                <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (<button key={category} onClick={() => handleCategoryClick(category)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"}`}>
                {category}
              </button>))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        {!selectedCategory && !searchQuery && (<div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 mb-8 border border-gray-700">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Download Latest Movies
                <span className="block text-red-500">HD Quality</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Watch and download the latest movies in HDTC, WEB-DL quality. 
                Available in 480p, 720p, and 1080p with ESub.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-center space-x-2">
                    <Download className="h-6 w-6 text-red-500"/>
                    <div>
                      <div className="text-2xl font-bold text-white">{movies?.length || 0}</div>
                      <div className="text-gray-400 text-sm">Movies</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-6 w-6 text-yellow-500"/>
                    <div>
                      <div className="text-2xl font-bold text-white">4.8</div>
                      <div className="text-gray-400 text-sm">Rating</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-center space-x-2">
                    <Play className="h-6 w-6 text-blue-500"/>
                    <div>
                      <div className="text-2xl font-bold text-white">10K+</div>
                      <div className="text-gray-400 text-sm">Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}

        {/* Results Info */}
        {(searchQuery || selectedCategory) && (<div className="mb-6">
            <p className="text-gray-300">
              {searchQuery && `Showing results for "${searchQuery}"`}
              {selectedCategory && `Showing "${selectedCategory}" movies`}
              {filteredMovies.length > 0 && (<span className="text-gray-400"> ({filteredMovies.length} movies found)</span>)}
            </p>
          </div>)}

        {/* Loading State */}
        {isLoading && (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, index) => (<Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="h-64 bg-gray-700 animate-pulse rounded-t-lg"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-3 bg-gray-700 animate-pulse rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>))}
          </div>)}

        {/* Movie Grid */}
        {!isLoading && (<>
            {filteredMovies.length > 0 ? (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (<Link key={movie.id} href={`/movie/${movie.id}`}>
                    <Card className="movie-card bg-gray-800 border-gray-700 h-full">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover rounded-t-lg" loading="lazy"/>
                          <div className="absolute top-2 left-2">
                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              {movie.quality}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              {movie.resolution}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                              {movie.size}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                            {movie.title} ({movie.year})
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                            <Calendar className="h-3 w-3"/>
                            <span>{movie.year}</span>
                            {movie.duration && (<>
                                <Clock className="h-3 w-3"/>
                                <span>{movie.duration}</span>
                              </>)}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {movie.genre}
                          </p>
                          <div className="mt-2">
                            <span className="inline-block bg-orange-600 text-white px-2 py-1 rounded text-xs">
                              {movie.language}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>))}
              </div>) : (<div className="text-center py-16">
                <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto border border-gray-700">
                  <Download className="h-16 w-16 text-gray-500 mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchQuery
                    ? `No movies found for "${searchQuery}"`
                    : selectedCategory
                        ? `No movies found in ${selectedCategory}`
                        : "No movies available"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search criteria or browse all movies
                  </p>
                  {(searchQuery || selectedCategory) && (<Button onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                    }} className="bg-red-600 hover:bg-red-700 text-white">
                      Show All Movies
                    </Button>)}
                </div>
              </div>)}
          </>)}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 CineFreak.net. All rights reserved. Download movies responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>);
}
