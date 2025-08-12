import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertMovieSchema, insertAdminUserSchema } from "@shared/schema";
import { z } from "zod";
const router = express.Router();
// Movie routes
router.get("/movies", async (req, res) => {
    try {
        const { category, search } = req.query;
        let movies;
        if (search) {
            movies = await storage.searchMovies(search);
        }
        else if (category) {
            movies = await storage.getMoviesByCategory(category);
        }
        else {
            movies = await storage.getMovies();
        }
        res.json(movies);
    }
    catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});
router.get("/movies/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const movie = await storage.getMovie(id);
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json(movie);
    }
    catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ error: "Failed to fetch movie" });
    }
});
router.post("/movies", async (req, res) => {
    try {
        const validatedData = insertMovieSchema.parse(req.body);
        const movie = await storage.createMovie(validatedData);
        res.status(201).json(movie);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid movie data", details: error.issues });
        }
        console.error("Error creating movie:", error);
        res.status(500).json({ error: "Failed to create movie" });
    }
});
router.put("/movies/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const validatedData = insertMovieSchema.partial().parse(req.body);
        const movie = await storage.updateMovie(id, validatedData);
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json(movie);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid movie data", details: error.issues });
        }
        console.error("Error updating movie:", error);
        res.status(500).json({ error: "Failed to update movie" });
    }
});
router.delete("/movies/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = await storage.deleteMovie(id);
        if (!success) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Failed to delete movie" });
    }
});
// Admin authentication routes
router.post("/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }
        const user = await storage.getAdminUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "24h" });
        res.json({ token, user: { id: user.id, username: user.username } });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});
router.post("/admin/register", async (req, res) => {
    try {
        const { username, password } = insertAdminUserSchema.parse(req.body);
        // Check if user already exists
        const existingUser = await storage.getAdminUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await storage.createAdminUser({
            username,
            password: hashedPassword,
        });
        res.status(201).json({
            user: {
                id: user.id,
                username: user.username
            }
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Invalid user data", details: error.issues });
        }
        console.error("Error creating admin user:", error);
        res.status(500).json({ error: "Failed to create admin user" });
    }
});
export default router;
