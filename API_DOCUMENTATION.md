# QuickCart API Documentation

## Overview
This document provides the complete API structure for the QuickCart Zepto-type system. Backend developers can implement these endpoints to connect the frontend to a real database.

## Base Configuration
- **Base URL**: `http://localhost:3001/api` (configurable via `VITE_API_URL` environment variable)
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## Authentication Endpoints

### POST /auth/login
Login user and return authentication token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "user|vendor|admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "user|vendor|admin",
      "status": "active|inactive",
      "address": "string",
      "storeName": "string",
      "registrationDate": "string",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "token": "string"
  }
}
```

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "user|vendor|admin",
  "address": "string",
  "storeName": "string",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* Same as login response */ },
    "token": "string"
  }
}
```

### POST /auth/logout
Logout user (invalidate token).

**Headers:** `Authorization: Bearer <token>`

### GET /auth/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

## User Management Endpoints

### GET /users
Get all users with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `role`: string (user|vendor|admin)
- `status`: string (active|inactive)
- `search`: string (searches name, email, storeName)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "user|vendor|admin",
      "status": "active|inactive",
      "address": "string",
      "storeName": "string",
      "registrationDate": "string",
      "totalOrders": number,
      "totalRevenue": number,
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### GET /users/:id
Get user by ID.

**Headers:** `Authorization: Bearer <token>`

### PUT /users/:id
Update user information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Partial user object

### DELETE /users/:id
Delete user.

**Headers:** `Authorization: Bearer <token>`

### POST /users
Create new user (admin only).

**Headers:** `Authorization: Bearer <token>`

## Order Management Endpoints

### GET /orders
Get all orders with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number
- `limit`: number
- `status`: string (pending|processing|shipped|delivered|cancelled)
- `search`: string (searches order ID, customer name, vendor name)
- `vendorId`: string
- `customerId`: string

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "customerId": "string",
      "vendorId": "string",
      "customerName": "string",
      "customerEmail": "string",
      "vendorName": "string",
      "total": number,
      "status": "pending|processing|shipped|delivered|cancelled",
      "deliveryStatus": "preparing|ready|out_for_delivery|delivered|failed",
      "date": "string",
      "items": [
        {
          "id": "string",
          "productId": "string",
          "name": "string",
          "quantity": number,
          "price": number,
          "image": "string"
        }
      ],
      "deliveryAddress": "string",
      "paymentStatus": "pending|paid|failed",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": { /* Same as users */ }
}
```

### GET /orders/:id
Get order by ID.

**Headers:** `Authorization: Bearer <token>`

### PUT /orders/:id/status
Update order status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "pending|processing|shipped|delivered|cancelled"
}
```

### PUT /orders/:id/delivery-status
Update delivery status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "deliveryStatus": "preparing|ready|out_for_delivery|delivered|failed"
}
```

## Product Management Endpoints

### GET /products
Get all products with pagination and filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: number
- `limit`: number
- `vendorId`: string
- `category`: string
- `status`: string (active|inactive)
- `search`: string

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "vendorId": "string",
      "name": "string",
      "category": "string",
      "price": number,
      "quantity": "string",
      "stock": number,
      "image": "string",
      "status": "active|inactive",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": { /* Same as users */ }
}
```

### GET /products/:id
Get product by ID.

**Headers:** `Authorization: Bearer <token>`

### POST /products
Create new product.

**Headers:** `Authorization: Bearer <token>`

### PUT /products/:id
Update product.

**Headers:** `Authorization: Bearer <token>`

### DELETE /products/:id
Delete product.

**Headers:** `Authorization: Bearer <token>`

## Statistics Endpoints

### GET /stats/system
Get system-wide statistics (admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": number,
    "totalOrders": number,
    "activeUsers": number,
    "totalVendors": number,
    "totalCustomers": number,
    "totalAdmins": number,
    "growthRate": number,
    "monthlyRevenue": number,
    "pendingOrders": number,
    "deliveredOrders": number
  }
}
```

### GET /stats/vendor/:vendorId
Get vendor-specific statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": number,
    "orders": number,
    "products": number
  }
}
```

### GET /stats/user/:userId
Get user-specific statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": number,
    "totalSpent": number
  }
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String (user|vendor|admin),
  status: String (active|inactive),
  address: String,
  storeName: String (vendor only),
  registrationDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref: User),
  vendorId: ObjectId (ref: User),
  customerName: String,
  customerEmail: String,
  vendorName: String,
  total: Number,
  status: String (pending|processing|shipped|delivered|cancelled),
  deliveryStatus: String (preparing|ready|out_for_delivery|delivered|failed),
  date: Date,
  items: [{
    productId: ObjectId,
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  deliveryAddress: String,
  paymentStatus: String (pending|paid|failed),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId (ref: User),
  name: String,
  category: String,
  price: Number,
  quantity: String,
  stock: Number,
  image: String,
  status: String (active|inactive),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Implementation Notes

1. **Authentication**: Use JWT tokens with reasonable expiration (e.g., 24 hours)
2. **Password Security**: Hash passwords using bcrypt or similar
3. **Validation**: Implement input validation for all endpoints
4. **Rate Limiting**: Consider implementing rate limiting for sensitive endpoints
5. **CORS**: Configure CORS to allow frontend domain
6. **Environment Variables**: Use environment variables for sensitive configuration

## Frontend Integration

The frontend automatically falls back to mock data if the API is not available, making development easy. Simply implement the endpoints above and the frontend will seamlessly use the real API.

For testing without a backend, the frontend includes comprehensive mock data that demonstrates all features.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

Backend developers can change the API URL by updating this environment variable.
