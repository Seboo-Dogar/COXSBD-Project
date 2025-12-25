import { PrismaClient, AccountSettings } from "@prisma/client";
const prisma = new PrismaClient();

export class AccountSettingsService {
  /**
   * Creates a new account settings record in the database.
   */
  async createAccountSettings(data: Omit<AccountSettings, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.accountSettings.create({ data });
  }

  /**
   * Retrieves the account settings record (global settings for the web app).
   */
  async getAccountSettings() {
    return await prisma.accountSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single account settings record by its unique ID.
   */
  async getAccountSettingsById(id: string) {
    return await prisma.accountSettings.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing account settings record.
   */
  async updateAccountSettings(id: string, data: Partial<Omit<AccountSettings, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.accountSettings.update({ where: { id }, data });
  }

  /**
   * Deletes an account settings record.
   */
  async deleteAccountSettings(id: string) {
    return await prisma.accountSettings.delete({ where: { id } });
  }
}

