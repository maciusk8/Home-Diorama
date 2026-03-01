#!/bin/bash

# Install dependencies if they are missing
bun install

# Initialize schema/database if needed
bun run server/init-db.ts

# Start the frontend and backend servers
bun run dev
