# AI Marketplace Backend

## Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (with 3D model upload)
- `GET /api/products/model/:filename` - Serve 3D model file

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (auth required)

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders` - List user orders (auth required)

## 3D Model Integration
- Upload GLB files with products via `POST /api/products` (form-data, field: `model`)
- Models are served from `/uploads/{filename}`

## Setup
- Copy `.env.example` to `.env` and set your secrets
- Run `npm install`
- Start server: `node index.js` or `npm start`

## Notes
- MongoDB must be running locally or update `MONGO_URI` in `.env`
- All endpoints return JSON
- Auth uses JWT in `Authorization: Bearer <token>` header
