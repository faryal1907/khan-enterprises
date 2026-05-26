# 🛠️ Khan Enterprises — Local Development Environment Setup

This document serves as the step-by-step developer walkthrough for configuring and launching the local development environment for **Khan Enterprises**. Our architecture is a local-first setup designed to run seamlessly on a Windows machine utilizing WSL2 and Docker.

---

## 📋 Table of Contents
1. [Required Tools to Install (In Order)](#1-required-tools-to-install-in-order)
2. [Local System Architecture](#2-local-system-architecture)
3. [Monorepo Initial Workspace Configuration](#3-monorepo-initial-workspace-configuration)
4. [Setting Up Local Database Services (Docker Compose)](#4-setting-up-local-database-services-docker-compose)
5. [Prisma Database Connection Setup](#5-prisma-database-connection-setup)
6. [Initial Run & Dev Verification Steps](#6-initial-run--dev-verification-steps)
7. [Troubleshooting & Developer Tips](#7-troubleshooting--developer-tips)

---

## 1. Required Tools to Install (In Order)

To ensure high performance and terminal compatibility, the developer environment is built on **Windows Subsystem for Linux (WSL2)**. Please follow this order of installation:

### 1.1 Windows Subsystem for Linux 2 (WSL2)
*   **Purpose:** Runs a native Linux kernel inside Windows, eliminating file system latency and terminal incompatibility during Node.js/Docker executions.
*   **Action:** Open PowerShell as Administrator and run:
    ```powershell
    wsl --install
    ```
*   **Verification:** Restart your PC. It will boot into a Ubuntu terminal setup window asking you to create a Unix username and password.

### 1.2 Docker Desktop
*   **Purpose:** Containerizes background services (PostgreSQL, pgAdmin) to avoid installing system-wide database pollutions on your native Windows registry.
*   **Action:** Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).
*   **Important Setting:** During installation, ensure "Use the WSL 2 based engine" is checked. After installation, open Docker Settings -> **Resources** -> **WSL Integration**, and toggle on your installed Ubuntu distro to allow terminal access to docker CLI inside WSL2.

### 1.3 Visual Studio Code
*   **Purpose:** Primary integrated development environment (IDE).
*   **Action:** Install VS Code on Windows.
*   **Required Extensions:** Open VS Code and install the following:
    *   **WSL extension** (by Microsoft) — Allows VS Code to run its server in WSL2, letting you edit Linux-native files directly with high IDE efficiency.
    *   **Prisma extension** — Syntax highlighting and linting for `.prisma` files.
    *   **Tailwind CSS IntelliSense** — Dynamic styling autocomplete.
    *   **ESLint / Prettier** — Core syntax validation.

### 1.4 Git
*   **Purpose:** Repository version control.
*   **Action:** Inside your WSL2 Ubuntu terminal, install Git:
    ```bash
    sudo apt update
    sudo apt install git -y
    ```
*   Configure your identity:
    ```bash
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

### 1.5 Node.js (LTS via NVM)
*   **Purpose:** JavaScript/TypeScript runtime.
*   **Action:** Install NVM (Node Version Manager) inside WSL2 to seamlessly switch versions:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    Close and reopen your terminal, then install Node.js LTS:
    ```bash
    nvm install --lts
    nvm use --lts
    ```

### 1.6 GUI & API Inspectors
*   **pgAdmin 4:** Download pgAdmin on Windows as a native desktop client or run it via the local Docker Compose configuration (recommended, pre-configured below on Port 8080) to inspect PostgreSQL tables and schemas.
*   **Postman:** Download [Postman Desktop Agent](https://www.postman.com/downloads/) to construct, test, and save local API calls towards `http://localhost:4000`.

---

## 2. Local System Architecture

All apps and services execute locally. The ports are bound to avoid conflicts:

| Service | Technology | Internal Dev Port | Access / Control Endpoint |
| :--- | :--- | :---: | :--- |
| **Customer Frontend** | Next.js (App Router) | `3000` | `http://localhost:3000` |
| **Admin ERP Portal** | Next.js (Dashboard) | `3001` | `http://localhost:3001` |
| **Backend Core API** | NestJS | `4000` | `http://localhost:4000` |
| **Database Instance** | PostgreSQL | `5432` | `postgresql://postgres:postgres@localhost:5432/khan_db` |
| **DB Admin Dashboard**| pgAdmin 4 (Docker) | `8080` | `http://localhost:8080` |

---

## 3. Monorepo Initial Workspace Configuration

To allow Turborepo to orchestrate builds, compile base files, and link workspaces correctly, follow these setups for the root directories:

### 3.1 Initializing root `package.json`
Use npm workspaces to map the dependency graph. Write this configuration to the root `package.json`:

```json
{
  "name": "khan-enterprises",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "db:up": "docker-compose -f docker/docker-compose.yml up -d",
    "db:down": "docker-compose -f docker/docker-compose.yml down",
    "prisma:generate": "turbo run prisma:generate",
    "prisma:migrate": "turbo run prisma:migrate"
  },
  "devDependencies": {
    "turbo": "^1.13.0"
  }
}
```

### 3.2 Setting Up `turbo.json`
Create a pipeline layout specifying inputs, outputs, and dependencies for parallel executions:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "prisma:generate": {
      "outputs": []
    },
    "prisma:migrate": {
      "dependsOn": ["prisma:generate"]
    }
  }
}
```

### 3.3 Setting Up `tsconfig.base.json`
Standardize common compilation parameters for Next.js, NestJS, and shared internal npm packages:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@khan/types": ["packages/types/src/index.ts"],
      "@khan/ui/*": ["packages/ui/src/*"],
      "@khan/utils": ["packages/utils/src/index.ts"]
    }
  },
  "exclude": ["node_modules"]
}
```

---

## 4. Setting Up Local Database Services (Docker Compose)

We use Docker to manage the database and standard GUI. 

Create your compose file under `docker/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: khan-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: khan_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - khan_network
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4
    container_name: khan-pgadmin
    ports:
      - "8080:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@khan.com
      PGADMIN_DEFAULT_PASSWORD: admin
    networks:
      - khan_network
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local

networks:
  khan_network:
    driver: bridge
```

---

## 5. Prisma Database Connection Setup

To tie the database container with our apps, we store variables in environment files.

### 5.1 Root Environment Settings
Create a `.env` file in the root workspace `c:\Users\Laptop\Desktop\khan-enterprises\.env`:

```env
# Database Connection String for Prisma CLI and Local Services
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/khan_db?schema=public"

# Auth configuration
JWT_SECRET="super-secret-development-hash-key-value-12345"
JWT_REFRESH_SECRET="another-equally-secure-secret-key-development"
JWT_EXPIRE="15m"
JWT_REFRESH_EXPIRE="7d"

# Third-party integrations (Mock keys during Phase 1 & 2 development)
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

### 5.2 Create the Database Configuration Package
Your `packages/prisma` library will wrap and export the client so that NestJS and Next.js do not initialize redundant, conflicting client pools.
Create `packages/prisma/package.json`:

```json
{
  "name": "@khan/prisma",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "generate": "prisma generate",
    "migrate:dev": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy"
  },
  "dependencies": {
    "@prisma/client": "^5.12.0"
  },
  "devDependencies": {
    "prisma": "^5.12.0"
  }
}
```

---

## 6. Initial Run & Dev Verification Steps

Once these configurations are committed, initialize your system with this strict operational execution sequence:

### Step 1: Install Dependencies
Open your terminal in the root folder inside WSL2 and install all standard node packages:
```bash
npm install
```

### Step 2: Spin up local Docker Services
Execute Docker Compose to bring up PostgreSQL and pgAdmin containers:
```bash
npm run db:up
```

### Step 3: Run Database Migrations
Deploy the database schemas mapped inside `packages/prisma/schema.prisma` directly to the running PostgreSQL container. This will compile all schemas and generate local Prisma Clients:
```bash
# Execute within packages/prisma folder
npx prisma migrate dev --name init
```

### Step 4: Run the Development Server
Execute the global workspaces dev command:
```bash
npm run dev
```

Turborepo will automatically parallelize execution:
*   Customer Frontend starts on `http://localhost:3000`
*   Admin Dashboard starts on `http://localhost:3001`
*   NestJS REST API starts on `http://localhost:4000`

---

## 7. Troubleshooting & Developer Tips

### 7.1 Port In-Use Error (`EADDRINUSE`)
*   **Problem:** One of your local applications crashes with an Address Already In Use error.
*   **Fix:** Check if you have an orphaned node server running on that port:
    ```bash
    sudo lsof -i :4000
    # Kill the PID found:
    kill -9 <PID>
    ```

### 7.2 Database Connection Refused
*   **Problem:** NestJS or Prisma fails to connect to `postgresql://...`
*   **Fix:** 
    1. Verify Docker Desktop is active.
    2. Check container status in your terminal: `docker logs khan-postgres`
    3. If utilizing WSL2, ensure your `.env` connection string uses `localhost` or `127.0.0.1`. If WSL network namespaces are isolated, you may need to use `host.docker.internal`.

### 7.3 Syncing Schema Changes Across Teams
Whenever you pull new commits from Git containing Prisma changes, ALWAYS update your local client database by running:
```bash
npm run prisma:generate
npx prisma db push
```
This keeps your local typescript auto-completes matches the remote database fields structure.
