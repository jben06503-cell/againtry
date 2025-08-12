"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAdminUserSchema = exports.insertMovieSchema = exports.adminUsers = exports.movies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// Movies table
exports.movies = (0, pg_core_1.pgTable)("movies", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    year: (0, pg_core_1.integer)("year").notNull(),
    genre: (0, pg_core_1.text)("genre").notNull(),
    language: (0, pg_core_1.text)("language").notNull(),
    quality: (0, pg_core_1.text)("quality").notNull(),
    resolution: (0, pg_core_1.text)("resolution").notNull(),
    size: (0, pg_core_1.text)("size").notNull(),
    poster: (0, pg_core_1.text)("poster").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    plot: (0, pg_core_1.text)("plot"),
    director: (0, pg_core_1.text)("director"),
    cast: (0, pg_core_1.text)("movie_cast"),
    duration: (0, pg_core_1.text)("duration"),
    screenshots: (0, pg_core_1.text)("screenshots").array().default([]),
    downloadLinks: (0, pg_core_1.jsonb)("download_links").$type().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Admin users table
exports.adminUsers = (0, pg_core_1.pgTable)("admin_users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Create insert schemas
exports.insertMovieSchema = (0, drizzle_zod_1.createInsertSchema)(exports.movies).omit({
    id: true,
    createdAt: true,
});
exports.insertAdminUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.adminUsers).omit({
    id: true,
    createdAt: true,
});
