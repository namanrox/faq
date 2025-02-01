# FAQ Manage

## Overview

This is an API for managing frequently asked questions (FAQs) that uses **Node.js, Express.js, and MongoDB** and supports multi-language translation and caching (Redis).

## Pre-Requisites

Before setting up the application, ensure the following is installed:

1. Node.js (latest version)
2. MongoDB (Local or Cloud instance)
3. Docker(for running redis)

## Installation

1. Clone the Repository:

```bash
git clone https://github.com/namanrox/faq.git
cd faq
```

2. Install the Dependencies:
```
npm install
```

4. Set Up Environment Variables:
```
MONGO_URI=your_mongo_uri
PORT=4000
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
FRONTEND_URL=your_frontend_url
```

## Configuration
1. Database Setup: Ensure MongoDB is running. You can use a local instance or a cloud-based MongoDB service.

2. Redis setup: Use docker to run the Redis.

## Running the Application
1. Using NodeJS:
```
npm start
```
2. Using Docker:
```
docker-compose up --build
```
By default, the server will start on **port 4000**. You can change the port by modifying the PORT variable in your .env file, which must be made in the root directory.

### Verify the Server:
Open your browser or API client and navigate to http://localhost:4000. You should see a response indicating that the server is running.

## API Endpoints

- Fetch all FAQs
```
GET /api/faqs
```

- Add a new FAQ
```
POST /api/faqs
Content-Type: application/json
Body: { "question": "Your question?", "answer": "The answer." }
```

- Delete an FAQ
```
DELETE /api/faqs/:id
```
