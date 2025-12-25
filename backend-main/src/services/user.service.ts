import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

export class UserService {
  /**
   * Retrieves all users with MERCHANT role.
   */
  async getMerchantUsers(skip = 0, take = 10) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: Role.MERCHANT,
        },
        skip,
        take,
        orderBy: { registeredAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          registeredAt: true,
          // Exclude sensitive fields like password and refreshToken
        },
      }),
      prisma.user.count({ where: { role: Role.MERCHANT } }),
    ]);

    return {
      users,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        totalPages: Math.ceil(total / take),
        limit: take,
        skip,
      },
    };
  }
}

