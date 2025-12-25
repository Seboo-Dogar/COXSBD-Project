import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { ValidationPipe } from "@nestjs/common";

const main = async () => {
  const app = await NestFactory.create(AppModule,{
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.useGlobalPipes(new ValidationPipe());
   // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Your frontend URL
      'http://localhost:80', // Production domain
      'http://localhost:8080', // Production domain
      'http://coxsbd.com',
      'https://coxsbd.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(1337);
};

main();
