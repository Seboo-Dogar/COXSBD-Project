import { PrismaClient, SocialLinks } from "@prisma/client";
const prisma = new PrismaClient();

export class SocialLinksService {
  /**
   * Creates a new social links record in the database.
   */
  async createSocialLinks(data: Omit<SocialLinks, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.socialLinks.create({ data });
  }

  /**
   * Retrieves the social links record (global settings for the web app).
   */
  async getSocialLinks() {
    return await prisma.socialLinks.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single social links record by its unique ID.
   */
  async getSocialLinksById(id: string) {
    return await prisma.socialLinks.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing social links record.
   */
  async updateSocialLinks(id: string, data: Partial<Omit<SocialLinks, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.socialLinks.update({ where: { id }, data });
  }

  /**
   * Deletes a social links record.
   */
  async deleteSocialLinks(id: string) {
    return await prisma.socialLinks.delete({ where: { id } });
  }
}

