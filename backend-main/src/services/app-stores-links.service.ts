import { PrismaClient, AppStoresLinks } from "@prisma/client";
const prisma = new PrismaClient();

export class AppStoresLinksService {
  /**
   * Creates a new app stores links record in the database.
   */
  async createAppStoresLinks(data: Omit<AppStoresLinks, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.appStoresLinks.create({ data });
  }

  /**
   * Retrieves the app stores links record (global settings for the web app).
   */
  async getAppStoresLinks() {
    return await prisma.appStoresLinks.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single app stores links record by its unique ID.
   */
  async getAppStoresLinksById(id: string) {
    return await prisma.appStoresLinks.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing app stores links record.
   */
  async updateAppStoresLinks(id: string, data: Partial<Omit<AppStoresLinks, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.appStoresLinks.update({ where: { id }, data });
  }

  /**
   * Deletes an app stores links record.
   */
  async deleteAppStoresLinks(id: string) {
    return await prisma.appStoresLinks.delete({ where: { id } });
  }
}

