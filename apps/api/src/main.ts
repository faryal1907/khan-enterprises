import { config } from "dotenv";
import { resolve } from "path";

// Load root .env when Nest runs from apps/api (monorepo layout)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend apps (Web: 3000, Admin: 3001)
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000"],
    credentials: true,
  });

  // Global prefix for all API routes
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 4000;

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  console.log(`🚀 Khan Enterprises API running on http://localhost:${port}`);
}

bootstrap();
