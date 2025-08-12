import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// Movies table
export const movies = pgTable("movies", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    year: integer("year").notNull(),
    genre: text("genre").notNull(),
    language: text("language").notNull(),
    quality: text("quality").notNull(),
    resolution: text("resolution").notNull(),
    size: text("size").notNull(),
    poster: text("poster").notNull(),
    category: text("category").notNull(),
    plot: text("plot"),
    director: text("director"),
    cast: text("movie_cast"),
    duration: text("duration"),
    screenshots: text("screenshots").array().default([]),
    downloadLinks: jsonb("download_links").$type().default([]),
    createdAt: timestamp("created_at").defaultNow(),
});
// Admin users table
export const adminUsers = pgTable("admin_users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});
// Create insert schemas
export const insertMovieSchema = createInsertSchema(movies).omit({
    id: true,
    createdAt: true,
});
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
    id: true,
    createdAt: true,
});
