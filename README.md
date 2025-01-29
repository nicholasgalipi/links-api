# Links API Documentation

Simple API for managing a collection of links with categories and tags. Data is stored in a local JSON file.

## Endpoints

### Get All Links
Retrieves all stored links.

```
GET /links
```

Response:
```json
[
  {
    "id": "0001",
    "url": "https://example.com",
    "category": "tech",
    "tags": ["javascript", "api"]
  }
]
```

### Add New Link
Creates a new link entry.

```
POST /links
```

Request Body:
```json
{
  "url": "https://example.com",
  "category": "tech",
  "tags": ["javascript", "api"]
}
```

Response: Returns the created link with generated ID.
```json
{
  "id": "0001",
  "url": "https://example.com",
  "category": "tech",
  "tags": ["javascript", "api"]
}
```

### Bulk Add Links
Adds multiple links at once.

```
POST /links/bulk
```

Request Body:
```json
{
  "links": [
    {
      "url": "https://example1.com",
      "category": "tech",
      "tags": ["javascript"]
    },
    {
      "url": "https://example2.com",
      "category": "science",
      "tags": ["physics", "research"]
    }
  ]
}
```

Response: Returns array of created links with generated IDs.

### Update Link
Updates an existing link by ID.

```
PUT /links/:id
```

Request Body (all fields optional):
```json
{
  "url": "https://updated-example.com",
  "category": "new-category",
  "tags": ["new-tag"]
}
```

Response: Returns the updated link.

### Delete Link
Deletes a link by ID.

```
DELETE /links/:id
```

Response: 204 No Content on success.

### Get Links by Category
Retrieves links from a specific category, optionally filtered by tags.

```
GET /links/category/:category
GET /links/category/:category?tags=tag1,tag2
```

Example:
```
GET /links/category/tech?tags=javascript,api
```

Response: Returns array of matching links.

### Get Links by Tags
Retrieves links that have all specified tags.

```
GET /links/tags/:tags
```

Example:
```
GET /links/tags/javascript,api
```

Response: Returns array of matching links.

## Data Structure

Each link entry has the following structure:

```json
{
  "id": "0001",          // Unique sequential ID
  "url": "string",       // The actual link URL
  "category": "string",  // Single category
  "tags": ["string"]     // Array of tags
}
```

## Notes
- No authentication required
- Data is stored in `links.json` in the application directory
- IDs are automatically generated as sequential 4-digit numbers (0001, 0002, etc.)
- Server runs on port 3000 by default (configurable via PORT environment variable)