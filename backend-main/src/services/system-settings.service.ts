import { PrismaClient, SystemSettings } from "@prisma/client";
const prisma = new PrismaClient();

export class SystemSettingsService {
  /**
   * Creates a new system settings record in the database.
   */
  async createSystemSettings(data: Omit<SystemSettings, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.systemSettings.create({ data });
  }

  /**
   * Retrieves the system settings record (global settings for the web app).
   */
  async getSystemSettings() {
    return await prisma.systemSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single system settings record by its unique ID.
   */
  async getSystemSettingsById(id: string) {
    return await prisma.systemSettings.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing system settings record.
   */
  async updateSystemSettings(id: string, data: Partial<Omit<SystemSettings, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.systemSettings.update({ where: { id }, data });
  }

  /**
   * Deletes a system settings record.
   */
  async deleteSystemSettings(id: string) {
    return await prisma.systemSettings.delete({ where: { id } });
  }
}

