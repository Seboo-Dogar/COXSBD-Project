# Backend Implementation Prompt: Add Product Feature

## Overview
Implement a backend API endpoint to add new products to the e-commerce system using NestJS, Prisma, and the provided dependencies. Support file upload for product images and fetch categories from the database.

## Requirements
- Create a POST endpoint `/products` that accepts product data and image file, saves the product to the database.
- Create a GET endpoint `/categories` to fetch available categories.
- Use JWT authentication to ensure only authenticated admins can add products.
- Handle file uploads using multer.
- Validate input data using class-validator.
- Return appropriate success/error responses.

## Database Schema (Prisma)
Assuming you have a `Product` model in your Prisma schema. If not, add it:

```prisma
model Product {
  id                Int      @id @default(autoincrement())
  title             String
  description       String?
  priceUSD          Float
  originalPriceUSD  Float?
  image             String   // URL or path to uploaded image
  rating            Float    @default(0)
  reviewCount       Int      @default(0)
  category          String
  isNew             Boolean  @default(false)
  isBestSeller      Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Category {
  id   Int    @id @default(autoincrement())
  name String @unique
}
```

Run `npx prisma migrate dev` after updating the schema.

## Implementation Steps

### 1. Install Additional Dependencies
Add multer for file uploads:
```bash
npm install @nestjs/platform-express multer
npm install -D @types/multer
```

### 2. Create Category DTOs and Entity
Create `src/categories/dto/create-category.dto.ts` (if needed):

```typescript
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;
}
```

Create `src/categories/categories.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }
}
```

Create `src/categories/categories.controller.ts`:

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }
}
```

Create `src/categories/categories.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
```

Import `CategoriesModule` in `app.module.ts`.

### 3. Update Product DTOs
Update `src/products/dto/create-product.dto.ts`:

```typescript
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  priceUSD: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPriceUSD?: number;

  @IsOptional()
  @IsString()
  image?: string; // Will be set after upload

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;
}
```

### 4. Update Products Service
Update `src/products/products.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  // If using Mongoose:
  // constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}
  // async create(createProductDto: CreateProductDto): Promise<Product> {
  //   const createdProduct = new this.productModel(createProductDto);
  //   return createdProduct.save();
  // }
}
```

### 5. Update Products Controller
Update `src/products/products.controller.ts`:

```typescript
import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      // Save file and set image path
      const imageUrl = `/uploads/${file.filename}`; // Adjust based on your storage
      createProductDto.image = imageUrl;
    }
    return this.productsService.create(createProductDto);
  }
}
```

### 6. Configure Multer
In `src/main.ts` or app module, configure multer:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3001); // Or your port
}
bootstrap();
```

In `src/app.module.ts`, add:

```typescript
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
    // other imports
  ],
})
export class AppModule {}
```

### 7. Ensure Authentication
Make sure you have JWT authentication set up. The controller uses `JwtAuthGuard`.

### 8. Test the Endpoints
- Use Postman to test GET /categories.
- For POST /products, use form-data with fields and file upload.

## Additional Notes
- Handle file storage securely (e.g., use cloud storage like AWS S3).
- Add validation for file types and sizes.
- Implement error handling and logging.
- Consider adding roles to restrict to admins only.