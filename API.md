# API Documentation

## Routes

### GET /routes
Get all routes in the system.

**Response:**
```json
[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91.0,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 4500,
    "isBaseline": true
  }
]
```

### POST /routes/:id/baseline
Set a route as the baseline for comparisons.

**Parameters:**
- `id`: Route ID to set as baseline

### GET /routes/comparison
Compare routes against the baseline.

**Response:**
```json
{
  "baseline": {
    "routeId": "R001",
    "ghgIntensity": 91.0
  },
  "results": [
    {
      "routeId": "R002",
      "percentDiff": -3.30,
      "compliant": true
    }
  ]
}
```

## Compliance

### GET /compliance/cb
Get compliance balance for a route.

**Query Parameters:**
- `shipId`: Ship/Route ID
- `year`: Year for calculation

**Response:**
```json
{
  "shipId": "R001",
  "year": 2024,
  "cb_gco2eq": 1000
}
```

### GET /compliance/adjusted-cb
Get adjusted compliance balance after banking operations.

**Query Parameters:**
- `shipId`: Ship/Route ID
- `year`: Year for calculation

## Banking

### POST /banking/bank
Bank a positive compliance balance.

**Request Body:**
```json
{
  "shipId": "R001",
  "year": 2024,
  "amount": 1000
}
```

### POST /banking/apply
Apply banked surplus to a deficit.

**Request Body:**
```json
{
  "shipId": "R001",
  "year": 2024,
  "amount": 500
}
```

## Pooling

### POST /pools
Create a new compliance pool.

**Request Body:**
```json
{
  "year": 2024,
  "members": [
    {
      "shipId": "R001",
      "cb_before": 1000
    }
  ]
}
```

### Validation Rules
1. Sum of adjusted CBs must be ≥ 0
2. Deficit ships cannot exit worse than entry
3. Surplus ships cannot exit negative

## Error Responses

All endpoints return errors in the format:
```json
{
  "error": "Error message description"
}
```

Common status codes:
- 400: Invalid request
- 404: Resource not found
- 409: Business rule violation
- 500: Server error