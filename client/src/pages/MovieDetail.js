import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Play, Share2, Heart, Calendar, Clock, Users, Star, ExternalLink, Film, ArrowLeft } from "lucide-react";
export default function MovieDetail() {
    const { id } = useParams();
    const [, setLocation] = useLocation();
    const { data: movie, isLoading, error } = useQuery({
        queryKey: [`/api/movies/${id}`],
    });
    const handleBackClick = () => {
        setLocation("/");
    };
    const handleDownload = (url, quality) => {
        if (url && url !== "#") {
            window.open(url, '_blank');
        }
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: movie?.title,
                text: `Check out ${movie?.title} on CineFreak`,
                url: window.location.href,
            });
        }
        else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };
    if (error) {
        return (<div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
            <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
            <Button onClick={handleBackClick} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Go Back Home
            </Button>
          </div>
        </div>
      </div>);
    }
    if (isLoading) {
        return (<div className="min-h-screen bg-gray-900 text-white">
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
      </div>);
    }
    if (!movie) {
        return (<div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
            <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
            <Button onClick={handleBackClick} className="bg-red-600 hover:bg-red-700">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Go Back Home
            </Button>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <Button onClick={handleBackClick} variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img src={movie.poster} alt={movie.title} className="w-full h-auto"/>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">
                      {movie.quality}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold rounded">
                      {movie.resolution}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400"/>
                      <span className="text-white font-semibold">4.5</span>
                      <span className="text-gray-400">(1.2k)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400"/>
                      <span>{movie.year}</span>
                    </div>
                    {movie.duration && (<div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400"/>
                        <span>{movie.duration}</span>
                      </div>)}
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400"/>
                      <span>{movie.language}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {/* Title and Badges */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-white mb-3">
                    {movie.title} ({movie.year})
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {movie.quality}
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {movie.resolution}
                    </span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {movie.language}
                    </span>
                    <span className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      {movie.category}
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                      ESub
                    </span>
                  </div>
                </div>
                
                {/* Movie Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    {movie.director && (<div>
                        <span className="text-gray-400 font-semibold">Director:</span>
                        <p className="text-white">{movie.director}</p>
                      </div>)}
                    {movie.cast && (<div>
                        <span className="text-gray-400 font-semibold">Cast:</span>
                        <p className="text-white">{movie.cast}</p>
                      </div>)}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 font-semibold">Genre:</span>
                      <p className="text-white">{movie.genre}</p>
                    </div>
                    {movie.duration && (<div>
                        <span className="text-gray-400 font-semibold">Duration:</span>
                        <p className="text-white">{movie.duration}</p>
                      </div>)}
                  </div>
                </div>
                
                {/* Plot Summary */}
                {movie.plot && (<div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Plot Summary</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {movie.plot}
                    </p>
                  </div>)}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <Button onClick={() => handleDownload(movie.downloadLinks[0]?.url || "#", movie.downloadLinks[0]?.quality || "")} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold">
                    <Download className="h-5 w-5 mr-2"/>
                    Download Movie
                  </Button>
                  
                  <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 px-6 py-3">
                    <Play className="h-5 w-5 mr-2"/>
                    Watch Trailer
                  </Button>
                  
                  <Button onClick={handleShare} variant="outline" className="text-white border-gray-600 hover:bg-gray-700 px-6 py-3">
                    <Share2 className="h-5 w-5 mr-2"/>
                    Share
                  </Button>
                  
                  <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 px-6 py-3">
                    <Heart className="h-5 w-5 mr-2"/>
                    Favorite
                  </Button>
                </div>
                
                {/* Download Links Section */}
                {movie.downloadLinks && movie.downloadLinks.length > 0 && (<div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Download className="h-6 w-6 mr-2 text-red-500"/>
                      Download Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {movie.downloadLinks.map((link, index) => (<Card key={index} className="bg-gray-700 border-gray-600 hover:border-red-500 transition-colors cursor-pointer" onClick={() => handleDownload(link.url, link.quality)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-green-600 text-white px-2 py-1 text-sm rounded font-semibold">
                                {link.quality}
                              </span>
                              <ExternalLink className="h-4 w-4 text-gray-400"/>
                            </div>
                            <div className="text-white font-semibold mb-1">
                              {link.size}
                            </div>
                            <div className="text-gray-400 text-sm">
                              Google Drive
                            </div>
                          </CardContent>
                        </Card>))}
                    </div>
                  </div>)}
                
                {/* Screenshots Gallery */}
                {movie.screenshots && movie.screenshots.length > 0 && (<div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Screenshots</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {movie.screenshots.map((screenshot, index) => (<div key={index} className="aspect-video">
                          <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover rounded border border-gray-600 hover:border-red-500 transition-colors cursor-pointer" onClick={() => window.open(screenshot, '_blank')}/>
                        </div>))}
                    </div>
                  </div>)}
              </CardContent>
            </Card>
          </div>
        </div>
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
