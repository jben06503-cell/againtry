import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useLocation } from "wouter";
import { Movie } from "@shared/schema";
import Header from "@/components/header";
import MovieModal from "@/components/movie-modal";
import RelatedMovies from "@/components/related-movies";
import CommentSection from "@/components/comment-section";
import ReportLink from "@/components/report-link";
import TrailerModal from "@/components/trailer-modal";
import Footer from "@/components/footer";
import { Download, Play, Share2, Heart, MessageCircle, Flag, ExternalLink, FileText, Clock, Calendar, Users, Star } from "lucide-react";

export default function MovieDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: ["https://cine-freak-clone-git-main-rajus-projects-5dda1627.vercel.app/api/movies", id],
  });

  const { data: allMovies } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  useEffect(() => {
    if (movie) {
      setSelectedMovie(movie);
    }
  }, [movie]);

  const handleBackClick = () => {
    setLocation("/");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTrailerClick = () => {
    setIsTrailerOpen(true);
  };

  const handleCloseTrailer = () => {
    setIsTrailerOpen(false);
  };

  const handleDownload = (url: string, quality: string) => {
    window.open(url, '_blank');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header 
          onSearch={() => {}}
          onCategoryFilter={() => {}}
          onAdvancedSearch={() => {}}
          selectedCategory=""
        />
        <div className="container mx-auto px-4 py-6">
          <Alert className="bg-gray-800 border-gray-700">
            <AlertDescription className="text-white">
              Failed to load movie details. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header 
          onSearch={() => {}}
          onCategoryFilter={() => {}}
          onAdvancedSearch={() => {}}
          selectedCategory=""
        />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full bg-gray-800" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-800" />
              <Skeleton className="h-20 w-full bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header 
          onSearch={() => {}}
          onCategoryFilter={() => {}}
          onAdvancedSearch={() => {}}
          selectedCategory=""
        />
        <div className="container mx-auto px-4 py-6">
          <Alert className="bg-gray-800 border-gray-700">
            <AlertDescription className="text-white">
              Movie not found.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        onSearch={() => {}}
        onCategoryFilter={() => {}}
        onAdvancedSearch={() => {}}
        selectedCategory=""
      />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <button onClick={handleBackClick} className="hover:text-white transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-white">{movie.category}</span>
          <span>/</span>
          <span className="text-white">{movie.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
              <div className="relative">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-auto"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-semibold">
                    {movie.quality}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold">
                    {movie.resolution}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-white font-semibold">4.5</span>
                    <span className="text-gray-400">(1.2k reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{movie.language}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{movie.genre}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
              {/* Title and Quality Badges */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-3">
                  {movie.title} ({movie.year})
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    {movie.quality}
                  </Badge>
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    {movie.resolution}
                  </Badge>
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    {movie.language}
                  </Badge>
                  <Badge className="bg-orange-600 text-white px-3 py-1">
                    {movie.category}
                  </Badge>
                  <Badge className="bg-red-600 text-white px-3 py-1">
                    ESub
                  </Badge>
                </div>
              </div>
              
              {/* Movie Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  {movie.director && (
                    <div>
                      <span className="text-gray-400 font-semibold">Director:</span>
                      <p className="text-white">{movie.director}</p>
                    </div>
                  )}
                  {movie.cast && (
                    <div>
                      <span className="text-gray-400 font-semibold">Cast:</span>
                      <p className="text-white">{movie.cast}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 font-semibold">Genre:</span>
                    <p className="text-white">{movie.genre}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold">Duration:</span>
                    <p className="text-white">{movie.duration}</p>
                  </div>
                </div>
              </div>
              
              {/* Plot Summary */}
              {movie.plot && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Plot Summary</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movie.plot}
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button 
                  onClick={handleOpenModal}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Movie
                </Button>
                
                <Button 
                  onClick={handleTrailerClick}
                  variant="outline" 
                  className="text-white border-gray-600 hover:bg-gray-700 px-6 py-3"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Trailer
                </Button>
                
                <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 px-6 py-3">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
                
                <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 px-6 py-3">
                  <Heart className="h-5 w-5 mr-2" />
                  Favorite
                </Button>
              </div>
              
              {/* Download Links Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Download className="h-6 w-6 mr-2 text-red-500" />
                  Download Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movie.downloadLinks.map((link, index) => (
                    <div 
                      key={index}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-red-500 transition-colors cursor-pointer"
                      onClick={() => handleDownload(link.url, link.quality)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-600 text-white px-2 py-1 text-sm">
                          {link.quality}
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-white font-semibold mb-1">
                        {link.size}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Google Drive
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Screenshots Gallery */}
              {movie.screenshots.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Screenshots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {movie.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Movies */}
        <RelatedMovies currentMovie={movie} allMovies={allMovies || []} />
        
        {/* Comments Section */}
        <CommentSection movieId={movie.id} />
        
        {/* Report Link */}
        <ReportLink movieId={movie.id} movieTitle={movie.title} />
      </main>

      {/* Movie Modal */}
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Trailer Modal */}
      <TrailerModal 
        isOpen={isTrailerOpen}
        onClose={handleCloseTrailer}
        movieTitle={movie.title}
      />

      <Footer />
    </div>
  );
}
