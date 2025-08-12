import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Film } from "lucide-react";
import { Link } from "wouter";
export default function NotFound() {
    return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-gray-800 border-gray-700">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500"/>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
          
          <p className="text-gray-400 mb-6">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Home className="h-4 w-4 mr-2"/>
                Go Back Home
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full text-white border-gray-600 hover:bg-gray-700">
                <Film className="h-4 w-4 mr-2"/>
                Browse Movies
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>);
}
