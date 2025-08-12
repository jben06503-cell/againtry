import { movies, adminUsers, type Movie, type InsertMovie, type AdminUser, type InsertAdminUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";

export interface IStorage {
  // Movie operations
  getMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(insertMovie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, updateData: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<boolean>;
  searchMovies(query: string): Promise<Movie[]>;
  getMoviesByCategory(category: string): Promise<Movie[]>;
  
  // Admin user operations
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser>;
}

export class DatabaseStorage implements IStorage {
  async getMovies(): Promise<Movie[]> {
    return await db.select().from(movies).orderBy(desc(movies.createdAt));
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie || undefined;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const [movie] = await db
      .insert(movies)
      .values(insertMovie)
      .returning();
    return movie;
  }

  async updateMovie(id: number, updateData: Partial<InsertMovie>): Promise<Movie | undefined> {
    const [movie] = await db
      .update(movies)
      .set(updateData)
      .where(eq(movies.id, id))
      .returning();
    return movie || undefined;
  }

  async deleteMovie(id: number): Promise<boolean> {
    const result = await db.delete(movies).where(eq(movies.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(movies)
      .where(
        or(
          like(movies.title, searchQuery),
          like(movies.genre, searchQuery),
          like(movies.director, searchQuery),
          like(movies.cast, searchQuery)
        )
      )
      .orderBy(desc(movies.createdAt));
  }

  async getMoviesByCategory(category: string): Promise<Movie[]> {
    return await db
      .select()
      .from(movies)
      .where(eq(movies.category, category))
      .orderBy(desc(movies.createdAt));
  }

  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db
      .insert(adminUsers)
      .values(insertUser)
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();