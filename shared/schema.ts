import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  downloadLinks: jsonb("download_links").$type<DownloadLink[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Download link type
export type DownloadLink = {
  quality: string;
  size: string;
  url: string;
};

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

// Types
export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;