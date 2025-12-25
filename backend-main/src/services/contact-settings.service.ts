import { PrismaClient, ContactSettings } from "@prisma/client";
const prisma = new PrismaClient();

export class ContactSettingsService {
  /**
   * Creates a new contact settings record in the database.
   */
  async createContactSettings(data: Omit<ContactSettings, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.contactSettings.create({ data });
  }

  /**
   * Retrieves the contact settings record (global settings for the web app).
   */
  async getContactSettings() {
    return await prisma.contactSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single contact settings record by its unique ID.
   */
  async getContactSettingsById(id: string) {
    return await prisma.contactSettings.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing contact settings record.
   */
  async updateContactSettings(id: string, data: Partial<Omit<ContactSettings, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.contactSettings.update({ where: { id }, data });
  }

  /**
   * Deletes a contact settings record.
   */
  async deleteContactSettings(id: string) {
    return await prisma.contactSettings.delete({ where: { id } });
  }
}

