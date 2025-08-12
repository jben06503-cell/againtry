"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
const schema_1 = require("@shared/schema");
const db_1 = require("./db");
const drizzle_orm_1 = require("drizzle-orm");
class DatabaseStorage {
    async getMovies() {
        return await db_1.db.select().from(schema_1.movies).orderBy((0, drizzle_orm_1.desc)(schema_1.movies.createdAt));
    }
    async getMovie(id) {
        const [movie] = await db_1.db.select().from(schema_1.movies).where((0, drizzle_orm_1.eq)(schema_1.movies.id, id));
        return movie || undefined;
    }
    async createMovie(insertMovie) {
        const [movie] = await db_1.db
            .insert(schema_1.movies)
            .values(insertMovie)
            .returning();
        return movie;
    }
    async updateMovie(id, updateData) {
        const [movie] = await db_1.db
            .update(schema_1.movies)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.movies.id, id))
            .returning();
        return movie || undefined;
    }
    async deleteMovie(id) {
        const result = await db_1.db.delete(schema_1.movies).where((0, drizzle_orm_1.eq)(schema_1.movies.id, id));
        return (result.rowCount ?? 0) > 0;
    }
    async searchMovies(query) {
        const searchQuery = `%${query.toLowerCase()}%`;
        return await db_1.db
            .select()
            .from(schema_1.movies)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.movies.title, searchQuery), (0, drizzle_orm_1.like)(schema_1.movies.genre, searchQuery), (0, drizzle_orm_1.like)(schema_1.movies.director, searchQuery), (0, drizzle_orm_1.like)(schema_1.movies.cast, searchQuery)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.movies.createdAt));
    }
    async getMoviesByCategory(category) {
        return await db_1.db
            .select()
            .from(schema_1.movies)
            .where((0, drizzle_orm_1.eq)(schema_1.movies.category, category))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.movies.createdAt));
    }
    async getAdminUser(id) {
        const [user] = await db_1.db.select().from(schema_1.adminUsers).where((0, drizzle_orm_1.eq)(schema_1.adminUsers.id, id));
        return user || undefined;
    }
    async getAdminUserByUsername(username) {
        const [user] = await db_1.db.select().from(schema_1.adminUsers).where((0, drizzle_orm_1.eq)(schema_1.adminUsers.username, username));
        return user || undefined;
    }
    async createAdminUser(insertUser) {
        const [user] = await db_1.db
            .insert(schema_1.adminUsers)
            .values(insertUser)
            .returning();
        return user;
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
