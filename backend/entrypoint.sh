#!/bin/sh
set -e
echo "👀 entrypoint.sh is running"

echo "⏳ Waiting for MongoDB..."
until curl --silent "$DB_CONNECTION_STRING"; do
  echo "Still waiting for MongoDB..."
  sleep 3
done

if [ "$RUN_SEED" = "true" ]; then
  echo "🔎 Checking if DB already has data..."
  if node checkDb.js; then
    echo "✅ Data exists, skipping seeding."
  else
    echo "🌱 No data found, seeding..."
    npm run seed

    if [ "$RUN_EMBEDDINGS" = "true" ]; then
      echo "🧠 Seeding embeddings..."
      npm run seed-embeddings
    fi
  fi
fi

echo "Starting server..."
npm start

echo "🚀 Server started!"
