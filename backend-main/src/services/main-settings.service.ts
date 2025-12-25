import { PrismaClient, MainSettings } from "@prisma/client";
const prisma = new PrismaClient();

export class MainSettingsService {
  /**
   * Creates a new main settings record in the database.
   */
  async createMainSettings(data: Omit<MainSettings, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.mainSettings.create({ data });
  }

  /**
   * Retrieves the main settings record (global settings for the web app).
   */
  async getMainSettings() {
    return await prisma.mainSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single main settings record by its unique ID.
   */
  async getMainSettingsById(id: string) {
    return await prisma.mainSettings.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing main settings record.
   */
  async updateMainSettings(id: string, data: Partial<Omit<MainSettings, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.mainSettings.update({ where: { id }, data });
  }

  /**
   * Deletes a main settings record.
   */
  async deleteMainSettings(id: string) {
    return await prisma.mainSettings.delete({ where: { id } });
  }

}

