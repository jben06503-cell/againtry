const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Sample movie data for demonstration
const sampleMovies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    year: 2022,
    genre: "Sci-Fi",
    language: "English",
    quality: "4K",
    resolution: "3840x2160",
    size: "12.5GB",
    poster: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_FMjpg_UX1000_.jpg",
    category: "Sci-Fi",
    plot: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    director: "James Cameron",
    movie_cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
    duration: "3h 12m"
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    year: 2022,
    genre: "Action",
    language: "English",
    quality: "HD",
    resolution: "1920x1080",
    size: "4.2GB",
    poster: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg",
    category: "Action",
    plot: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    director: "Joseph Kosinski",
    movie_cast: "Tom Cruise, Jennifer Connelly, Miles Teller",
    duration: "2h 10m"
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    year: 2022,
    genre: "Action",
    language: "English",
    quality: "FHD",
    resolution: "1920x1080",
    size: "6.8GB",
    poster: "https://m.media-amazon.com/images/M/MV5BNTM4NjIxNmEtYWE5NS00NDczLTkyNWQtYThhNmQyZGQzMjM0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    category: "Action",
    plot: "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
    director: "Ryan Coogler",
    movie_cast: "Letitia Wright, Lupita Nyong'o, Danai Gurira",
    duration: "2h 41m"
  },
  {
    id: 4,
    title: "The Batman",
    year: 2022,
    genre: "Action",
    language: "English",
    quality: "4K",
    resolution: "3840x2160",
    size: "15.2GB",
    poster: "https://m.media-amazon.com/images/M/MV5BM2MyNTAwZGEtNTAxNC00ODVjLTgzZjUtYmU0YjAzNzQxNzg5XkEyXkFqcGdeQXVyNDc2NTg3NzA@._V1_.jpg",
    category: "Action",
    plot: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    director: "Matt Reeves",
    movie_cast: "Robert Pattinson, Zoë Kravitz, Jeffrey Wright",
    duration: "2h 56m"
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Comedy",
    language: "English",
    quality: "HD",
    resolution: "1920x1080",
    size: "3.9GB",
    poster: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
    category: "Comedy",
    plot: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have lived.",
    director: "Daniels",
    movie_cast: "Michelle Yeoh, Stephanie Hsu, Ke Huy Quan",
    duration: "2h 19m"
  },
  {
    id: 6,
    title: "Scream",
    year: 2022,
    genre: "Horror",
    language: "English",
    quality: "FHD",
    resolution: "1920x1080",
    size: "4.1GB",
    poster: "https://m.media-amazon.com/images/M/MV5BYmI5ZjcyOWItODhkZi00YTJkLTk5ZDQtMmU0NzY2MDBkNTA4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
    category: "Horror",
    plot: "Twenty-five years after the original series of murders in Woodsboro, a new Ghostface emerges, and Sidney Prescott must return to uncover the truth.",
    director: "Matt Bettinelli-Olpin, Tyler Gillett",
    movie_cast: "Melissa Barrera, Jenna Ortega, Neve Campbell",
    duration: "1h 54m"
  }
];

let movies = [...sampleMovies];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname.startsWith('/api/movies')) {
    if (method === 'GET') {
      if (pathname === '/api/movies') {
        // Get all movies with optional filtering
        const { category, search } = parsedUrl.query;
        let filteredMovies = movies;

        if (category) {
          filteredMovies = movies.filter(movie => 
            movie.category.toLowerCase() === category.toLowerCase()
          );
        }

        if (search) {
          const searchLower = search.toLowerCase();
          filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchLower) ||
            movie.genre.toLowerCase().includes(searchLower) ||
            movie.director.toLowerCase().includes(searchLower) ||
            movie.movie_cast.toLowerCase().includes(searchLower)
          );
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filteredMovies));
        return;
      }

      // Get specific movie by ID
      const movieId = parseInt(pathname.split('/')[3]);
      const movie = movies.find(m => m.id === movieId);

      if (movie) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movie));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Movie not found' }));
      }
      return;
    }

    if (method === 'POST' && pathname === '/api/movies') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const movieData = JSON.parse(body);
          const newMovie = {
            id: movies.length + 1,
            ...movieData,
            cast: movieData.cast || movieData.movie_cast
          };
          movies.push(newMovie);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newMovie));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    if (method === 'PUT') {
      const movieId = parseInt(pathname.split('/')[3]);
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const updateData = JSON.parse(body);
          const movieIndex = movies.findIndex(m => m.id === movieId);

          if (movieIndex !== -1) {
            movies[movieIndex] = { ...movies[movieIndex], ...updateData };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movies[movieIndex]));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Movie not found' }));
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    if (method === 'DELETE') {
      const movieId = parseInt(pathname.split('/')[3]);
      const movieIndex = movies.findIndex(m => m.id === movieId);

      if (movieIndex !== -1) {
        movies.splice(movieIndex, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Movie deleted successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Movie not found' }));
      }
      return;
    }
  }

  // Admin login API
  if (pathname === '/api/admin/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        
        if (username === 'admin' && password === 'iam22raju') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            token: 'demo-token', 
            user: { username: 'admin' } 
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, 'public', filePath);

  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Serve index.html for SPA routing
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (error, content) => {
          if (error) {
            res.writeHead(500);
            res.end('Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎬 MovieStream server running on port ${PORT}`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/movies`);
});