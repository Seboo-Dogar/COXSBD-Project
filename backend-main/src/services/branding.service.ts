import { PrismaClient, Branding } from "@prisma/client";
const prisma = new PrismaClient();

export class BrandingService {
  /**
   * Creates a new branding record in the database.
   */
  async createBranding(data: Omit<Branding, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.branding.create({ data });
  }

  /**
   * Retrieves the branding record (global settings for the web app).
   */
  async getBranding() {
    return await prisma.branding.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single branding record by its unique ID.
   */
  async getBrandingById(id: string) {
    return await prisma.branding.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing branding record.
   */
  async updateBranding(id: string, data: Partial<Omit<Branding, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.branding.update({ where: { id }, data });
  }

  /**
   * Deletes a branding record.
   */
  async deleteBranding(id: string) {
    return await prisma.branding.delete({ where: { id } });
  }
}

