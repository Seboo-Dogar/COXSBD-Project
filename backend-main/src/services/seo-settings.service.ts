import { PrismaClient, SeoSettings } from "@prisma/client";
const prisma = new PrismaClient();

export class SeoSettingsService {
  /**
   * Creates a new SEO settings record in the database.
   */
  async createSeoSettings(data: Omit<SeoSettings, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.seoSettings.create({ data });
  }

  /**
   * Retrieves the SEO settings record (global settings for the web app).
   */
  async getSeoSettings() {
    return await prisma.seoSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single SEO settings record by its unique ID.
   */
  async getSeoSettingsById(id: string) {
    return await prisma.seoSettings.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing SEO settings record.
   */
  async updateSeoSettings(id: string, data: Partial<Omit<SeoSettings, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.seoSettings.update({ where: { id }, data });
  }

  /**
   * Deletes a SEO settings record.
   */
  async deleteSeoSettings(id: string) {
    return await prisma.seoSettings.delete({ where: { id } });
  }
}

