const express = require("express");
const cors = require("cors");
const { Pool } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());
app.use(express.static("client/dist"));

// Movies API
app.get("/api/movies", async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = "SELECT * FROM movies";
    let params = [];
    
    if (category) {
      query += " WHERE category = $1";
      params.push(category);
    } else if (search) {
      query += " WHERE LOWER(title) LIKE $1 OR LOWER(genre) LIKE $1 OR LOWER(director) LIKE $1 OR LOWER(movie_cast) LIKE $1";
      params.push(`%${search.toLowerCase()}%`);
    }
    
    query += " ORDER BY created_at DESC";
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

app.post("/api/movies", async (req, res) => {
  try {
    const {
      title, year, genre, language, quality, resolution, size,
      poster, category, plot, director, cast, duration, screenshots, downloadLinks
    } = req.body;
    
    if (!title || !year || !genre || !poster || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const result = await pool.query(
      `INSERT INTO movies (title, year, genre, language, quality, resolution, size, poster, category, plot, director, movie_cast, duration, screenshots, download_links)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [title, year, genre, language, quality, resolution, size, poster, category, plot, director, cast, duration, screenshots || [], JSON.stringify(downloadLinks || [])]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Failed to create movie" });
  }
});

app.put("/api/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title, year, genre, language, quality, resolution, size,
      poster, category, plot, director, cast, duration, screenshots, downloadLinks
    } = req.body;
    
    const result = await pool.query(
      `UPDATE movies SET title = COALESCE($1, title), year = COALESCE($2, year), genre = COALESCE($3, genre), 
       language = COALESCE($4, language), quality = COALESCE($5, quality), resolution = COALESCE($6, resolution),
       size = COALESCE($7, size), poster = COALESCE($8, poster), category = COALESCE($9, category),
       plot = COALESCE($10, plot), director = COALESCE($11, director), movie_cast = COALESCE($12, movie_cast),
       duration = COALESCE($13, duration), screenshots = COALESCE($14, screenshots), download_links = COALESCE($15, download_links)
       WHERE id = $16 RETURNING *`,
      [title, year, genre, language, quality, resolution, size, poster, category, plot, director, cast, duration, screenshots, JSON.stringify(downloadLinks), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
});

app.delete("/api/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query("DELETE FROM movies WHERE id = $1", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

// Admin API
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === "admin" && password === "iam22raju") {
      const token = jwt.sign({ username }, "secret-key", { expiresIn: "24h" });
      return res.json({ token, user: { username } });
    }
    
    res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});