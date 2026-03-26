#!/bin/bash

# 1. Optional command if you haven't created the DB in your Cloudflare account yet
# npx wrangler d1 create team_time_db

# 2. Initialize / start the database locally by applying the schema
echo "Applying SQL schema to local D1 database..."
npx wrangler d1 execute team_time_db --local --file=./schema.sql

echo "Local database initialized successfully!"