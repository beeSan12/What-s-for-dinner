#!/bin/bash
echo "👀 entrypoint.sh is running"

# echo "⏳ Waiting for MongoDB..."
# until bash -c "</dev/tcp/mongo/27017"; do
#   sleep 1
# done

# echo "✅ Mongo is up!"

# echo "Seeding database..."
# npm run seed

# echo "Seeding embeddings..."
# npm run seed-embeddings

# echo "Starting server..."
# npm start

# echo "🚀 Server started!"

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  npm run seed || exit 1

  if [ "$RUN_EMBEDDINGS" = "true" ]; then
    echo "Seeding embeddings..."
    npm run seed-embeddings || exit 1
  fi
fi

echo "Starting server..."
npm start