import { movies, adminUsers } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";
export class DatabaseStorage {
    async getMovies() {
        return await db.select().from(movies).orderBy(desc(movies.createdAt));
    }
    async getMovie(id) {
        const [movie] = await db.select().from(movies).where(eq(movies.id, id));
        return movie || undefined;
    }
    async createMovie(insertMovie) {
        const [movie] = await db
            .insert(movies)
            .values(insertMovie)
            .returning();
        return movie;
    }
    async updateMovie(id, updateData) {
        const [movie] = await db
            .update(movies)
            .set(updateData)
            .where(eq(movies.id, id))
            .returning();
        return movie || undefined;
    }
    async deleteMovie(id) {
        const result = await db.delete(movies).where(eq(movies.id, id));
        return result.rowCount > 0;
    }
    async searchMovies(query) {
        const searchQuery = `%${query.toLowerCase()}%`;
        return await db
            .select()
            .from(movies)
            .where(or(like(movies.title, searchQuery), like(movies.genre, searchQuery), like(movies.director, searchQuery), like(movies.cast, searchQuery)))
            .orderBy(desc(movies.createdAt));
    }
    async getMoviesByCategory(category) {
        return await db
            .select()
            .from(movies)
            .where(eq(movies.category, category))
            .orderBy(desc(movies.createdAt));
    }
    async getAdminUser(id) {
        const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
        return user || undefined;
    }
    async getAdminUserByUsername(username) {
        const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
        return user || undefined;
    }
    async createAdminUser(insertUser) {
        const [user] = await db
            .insert(adminUsers)
            .values(insertUser)
            .returning();
        return user;
    }
}
export const storage = new DatabaseStorage();
