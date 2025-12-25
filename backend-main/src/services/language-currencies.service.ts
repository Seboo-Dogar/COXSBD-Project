import { PrismaClient, LanguageCurrencies } from "@prisma/client";
const prisma = new PrismaClient();

export class LanguageCurrenciesService {
  /**
   * Creates a new language currencies record in the database.
   */
  async createLanguageCurrencies(data: Omit<LanguageCurrencies, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.languageCurrencies.create({ data });
  }

  /**
   * Retrieves the language currencies record (global settings for the web app).
   */
  async getLanguageCurrencies() {
    return await prisma.languageCurrencies.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves a single language currencies record by its unique ID.
   */
  async getLanguageCurrenciesById(id: string) {
    return await prisma.languageCurrencies.findUnique({
      where: { id },
    });
  }

  /**
   * Updates an existing language currencies record.
   */
  async updateLanguageCurrencies(id: string, data: Partial<Omit<LanguageCurrencies, 'id' | 'createdAt' | 'updatedAt'>>) {
    return await prisma.languageCurrencies.update({ where: { id }, data });
  }

  /**
   * Deletes a language currencies record.
   */
  async deleteLanguageCurrencies(id: string) {
    return await prisma.languageCurrencies.delete({ where: { id } });
  }
}

