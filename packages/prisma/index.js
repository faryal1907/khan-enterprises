"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("tsx/cjs");
const client_1 = require("./generated/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Global declaration to prevent multiple instances of PrismaClient in development (e.g., Next.js hot reloading)
const globalForPrisma = globalThis;
let prismaInstance;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not defined.");
}
// Check if using Accelerate (prisma:// or prisma+postgres://)
const isAccelerate = databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+postgres://");
if (isAccelerate) {
    prismaInstance = globalForPrisma.prisma ?? new client_1.PrismaClient({
        accelerateUrl: databaseUrl,
    });
}
else {
    // Direct database connection via driver adapter
    const pool = new pg_1.Pool({
        connectionString: databaseUrl,
    });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    prismaInstance = globalForPrisma.prisma ?? new client_1.PrismaClient({
        adapter,
    });
}
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
}
exports.prisma = prismaInstance;
__exportStar(require("./generated/client"), exports);
