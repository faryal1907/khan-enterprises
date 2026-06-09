# Sprint 4 — Inventory System Implementation Plan

## Overview

This sprint implements a comprehensive inventory management system for serialized bike units and parts & accessories. The system includes file uploads for bike documents, stock movement logging, and low stock alerts.

## Features

### Serialized Bike Inventory
- Admin form to add new bike units (chassis number, engine number, branch, model, vendor)
- File upload for supplier invoice, warranty document, registration papers (Cloudinary)
- Branch assignment for bike location
- Status management (AVAILABLE by default)
- Inventory list view with filters (branch, status, model, vendor)
- Individual bike detail page with all documents visible

### Parts & Accessories Inventory
- Add/edit parts with quantity, reorder level, branch
- Stock movement logging (every quantity change recorded with reason and user)
- Low stock alert system (flag parts below reorder level)
- Branch stock view (stock counts per branch per product)

## Architecture

### Database Schema

#### Bike Model
```prisma
model Bike {
  id            String      @id @default(uuid())
  chassisNumber String      @unique
  engineNumber  String      @unique
  branchId      String
  branch        Branch      @relation(fields: [branchId], references: [id])
  modelId       String
  model         BikeModel   @relation(fields: [modelId], references: [id])
  vendorId      String
  vendor        Vendor      @relation(fields: [vendorId], references: [id])
  status        BikeStatus  @default(AVAILABLE)
  documents     Document[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum BikeStatus {
  AVAILABLE
  SOLD
  RESERVED
  DAMAGED
  MAINTENANCE
}
```

#### Part Model
```prisma
model Part {
  id           String         @id @default(uuid())
  name         String
  quantity     Int            @default(0)
  reorderLevel Int            @default(10)
  branchId     String
  branch       Branch         @relation(fields: [branchId], references: [id])
  movements    StockMovement[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}
```

#### StockMovement Model
```prisma
model StockMovement {
  id             String   @id @default(uuid())
  partId         String
  part           Part     @relation(fields: [partId], references: [id])
  quantityChange Int
  reason         String
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  createdAt      DateTime @default(now())
}
```

#### Document Model
```prisma
model Document {
  id          String      @id @default(uuid())
  bikeId      String
  bike        Bike        @relation(fields: [bikeId], references: [id])
  type        DocumentType
  cloudinaryUrl String
  cloudinaryPublicId String
  uploadedAt  DateTime    @default(now())
}

enum DocumentType {
  INVOICE
  WARRANTY
  REGISTRATION
  OTHER
}
```

#### Supporting Models
```prisma
model BikeModel {
  id          String   @id @default(uuid())
  name        String   @unique
  make        String
  year        Int
  bikes       Bike[]
}

model Vendor {
  id     String @id @default(uuid())
  name   String @unique
  bikes  Bike[]
}
```

### Backend (NestJS)

#### Modules Structure
```
apps/api/src/modules/
├── bike/
│   ├── bike.controller.ts
│   ├── bike.service.ts
│   ├── dto/
│   │   ├── create-bike.dto.ts
│   │   ├── update-bike.dto.ts
│   │   └── query-bike.dto.ts
│   └── bike.module.ts
├── part/
│   ├── part.controller.ts
│   ├── part.service.ts
│   ├── dto/
│   │   ├── create-part.dto.ts
│   │   ├── update-part.dto.ts
│   │   └── query-part.dto.ts
│   └── part.module.ts
├── stock-movement/
│   ├── stock-movement.controller.ts
│   ├── stock-movement.service.ts
│   └── stock-movement.module.ts
└── upload/
    ├── upload.controller.ts
    ├── upload.service.ts
    └── upload.module.ts
```

#### API Endpoints

**Bike Endpoints**
- `POST /api/bikes` - Create new bike (ADMIN only)
- `GET /api/bikes` - List bikes with filters (branch, status, model, vendor)
- `GET /api/bikes/:id` - Get bike details with documents
- `PUT /api/bikes/:id` - Update bike (ADMIN only)
- `DELETE /api/bikes/:id` - Delete bike (ADMIN only)

**Part Endpoints**
- `POST /api/parts` - Create new part (ADMIN/MANAGER)
- `GET /api/parts` - List parts with low stock flag and branch counts
- `GET /api/parts/:id` - Get part details
- `PUT /api/parts/:id` - Update part (ADMIN/MANAGER)
- `DELETE /api/parts/:id` - Delete part (ADMIN only)

**Stock Movement Endpoints**
- `GET /api/parts/:id/movements` - Get stock movement history for a part
- `POST /api/parts/:id/adjust-stock` - Adjust stock quantity with reason

**Upload Endpoints**
- `POST /api/upload` - Upload file to Cloudinary (returns URL)

### Frontend (Next.js Admin)

#### Page Structure
```
apps/admin/app/
├── bikes/
│   ├── page.tsx              # Bike inventory list with filters
│   ├── new/
│   │   └── page.tsx          # Add new bike form
│   └── [id]/
│       └── page.tsx          # Bike detail page
├── parts/
│   ├── page.tsx              # Parts list with low stock alerts
│   ├── new/
│   │   └── page.tsx          # Add new part form
│   ├── [id]/
│   │   └── page.tsx          # Part detail with stock movements
│   └── [id]/
│       └── edit/
│           └── page.tsx      # Edit part form
└── upload/
    └── route.ts             # API route for file uploads (optional, or use backend)
```

#### Component Structure
```
apps/admin/components/
├── bike/
│   ├── BikeForm.tsx          # Bike creation/edit form
│   ├── BikeList.tsx          # Bike inventory list
│   ├── BikeFilters.tsx       # Filter controls
│   └── BikeDetail.tsx        # Bike detail view
├── part/
│   ├── PartForm.tsx          # Part creation/edit form
│   ├── PartList.tsx          # Parts list
│   ├── LowStockAlert.tsx     # Low stock warning component
│   └── StockMovementHistory.tsx  # Stock movement table
└── upload/
    └── FileUpload.tsx        # Cloudinary file upload component
```

## Implementation Steps

### Phase 1: Database & Backend Setup

1. **Design Database Schema**
   - Define Prisma models for Bike, Part, StockMovement, Document
   - Define supporting models (BikeModel, Vendor)
   - Add enums for BikeStatus and DocumentType

2. **Set Up Cloudinary**
   - Create Cloudinary account
   - Get API keys (cloud name, API key, API secret)
   - Configure upload presets for bike documents
   - Add environment variables to `.env`

3. **Create Prisma Models**
   - Add models to `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name inventory-system`

4. **Create DTOs**
   - `CreateBikeDto`: chassisNumber, engineNumber, branchId, modelId, vendorId, status
   - `QueryBikeDto`: branchId, status, modelId, vendorId (all optional)
   - `CreatePartDto`: name, quantity, reorderLevel, branchId
   - `UpdatePartDto`: name, quantity, reorderLevel, branchId
   - `AdjustStockDto`: quantityChange, reason

5. **Create Upload Module**
   - Install `cloudinary` and `@nestjs/platform-express`
   - Create `UploadService` with Cloudinary integration
   - Create `UploadController` with file upload endpoint
   - Configure Multer for file handling

6. **Create Bike Module**
   - Create `BikeService` with CRUD operations
   - Implement document upload logic in bike creation
   - Create `BikeController` with all endpoints
   - Add `@Roles('ADMIN')` guards to write operations

7. **Create Part Module**
   - Create `PartService` with CRUD operations
   - Implement stock adjustment with movement logging
   - Add low stock detection logic
   - Create `PartController` with all endpoints
   - Add appropriate role guards

8. **Create Stock Movement Module**
   - Create `StockMovementService` to log changes
   - Create `StockMovementController` for history endpoint

### Phase 2: Frontend Implementation

9. **Create File Upload Component**
   - Install `react-dropzone` for drag-and-drop uploads
   - Create `FileUpload` component with Cloudinary integration
   - Handle file validation (size, type)
   - Show upload progress

10. **Create Bike Form**
    - Form fields: chassis number, engine number, branch, model, vendor
    - File upload sections for invoice, warranty, registration
    - Form validation with React Hook Form + Zod
    - Submit to backend API

11. **Create Bike List View**
    - Table/grid view of all bikes
    - Filter controls: branch dropdown, status dropdown, model dropdown, vendor dropdown
    - Search by chassis/engine number
    - Pagination
    - Click to view details

12. **Create Bike Detail Page**
    - Display all bike information
    - Show uploaded documents with download links
    - Status change option (ADMIN only)
    - Edit button (ADMIN only)

13. **Create Part Form**
    - Form fields: name, quantity, reorder level, branch
    - Validation (quantity must be non-negative)
    - Submit to backend API

14. **Create Parts List View**
    - Table view of all parts
    - Low stock alert highlighting (quantity < reorderLevel)
    - Branch stock counts per part
    - Filter by branch
    - Search by name
    - Pagination

15. **Create Part Detail Page**
    - Display part information
    - Stock movement history table (date, quantity change, reason, user)
    - Adjust stock form (quantity change + reason)
    - Edit button (ADMIN/MANAGER)

16. **Update Navigation**
    - Add "Bikes" link to admin navigation
    - Add "Parts" link to admin navigation
    - Update role-based visibility (ADMIN sees all, MANAGER sees parts)

### Phase 3: Testing & Documentation

17. **Test Bike Creation**
    - Test adding bike with all fields
    - Test file upload functionality
    - Test duplicate chassis/engine number validation
    - Test branch assignment

18. **Test Bike Listing**
    - Test all filter combinations
    - Test search functionality
    - Test pagination
    - Test detail page navigation

19. **Test Part CRUD**
    - Test adding new part
    - Test editing part
    - Test deleting part (ADMIN only)
    - Test stock adjustment with movement logging

20. **Test Low Stock Alerts**
    - Create part with quantity below reorder level
    - Verify alert appears in list view
    - Test stock adjustment to clear alert

21. **Test Role-Based Access**
    - Test ADMIN access to all features
    - Test MANAGER access to parts (read/write)
    - Test MANAGER denied access to bike management
    - Test SALES_STAFF denied access to inventory management

22. **Update Documentation**
    - Update `docs/api-contract.md` with new endpoints
    - Update `docs/auth.md` with new role permissions
    - Create user guide for inventory management

## Dependencies

### Backend
```json
{
  "dependencies": {
    "@nestjs/platform-express": "^10.0.0",
    "multer": "^1.4.5-lts.1",
    "cloudinary": "^2.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react-dropzone": "^14.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

## Environment Variables

### Backend (.env)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=bike_documents
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bike_documents
```

## Security Considerations

- File upload validation (file type, size limits)
- Cloudinary upload presets with transformations
- Role-based access control on all endpoints
- Input validation on all DTOs
- SQL injection prevention (Prisma handles this)
- XSS prevention in document display

## Performance Considerations

- Pagination for large inventory lists
- Lazy loading for document previews
- Indexing on frequently queried fields (branchId, status, modelId)
- Caching for branch lists, model lists, vendor lists
- Cloudinary CDN for document delivery

## Future Enhancements

- Barcode/QR code scanning for bikes
- Bulk import from CSV/Excel
- Inventory reports and analytics
- Automated reorder suggestions
- Document expiry alerts (warranty, registration)
- Bike transfer between branches
- Audit trail for all inventory changes
- Real-time stock updates via WebSocket
