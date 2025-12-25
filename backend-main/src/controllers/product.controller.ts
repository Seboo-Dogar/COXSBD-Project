import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, priceUSD, originalPriceUSD, category, isNew, isBestSeller } = req.body;

    const image = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        priceUSD: parseFloat(priceUSD),
        originalPriceUSD: originalPriceUSD ? parseFloat(originalPriceUSD) : undefined,
        image,
        category,
        isNew: isNew === 'true',
        isBestSeller: isBestSeller === 'true',
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};