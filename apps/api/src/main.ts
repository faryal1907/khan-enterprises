import { config } from "dotenv";
import { resolve } from "path";

// Load root .env when Nest runs from apps/api (monorepo layout)
// Use override: true to ensure root .env takes precedence
config({ path: resolve(process.cwd(), ".env"), override: false });
config({ path: resolve(process.cwd(), "../../.env"), override: true });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers — must be applied before CORS and routes
  app.use(helmet());

  // Request logging — essential for debugging production issues
  // Use 'combined' format in production (Apache-style), 'dev' in development (colored, concise)
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Enable CORS for frontend apps (Web: 3000, Admin: 3001)
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4000",
    // Production — set ALLOWED_ORIGINS in Render env vars to add more
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : []),
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global prefix for all API routes except /health
  app.setGlobalPrefix("api", {
    exclude: ['health'],
  });

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
