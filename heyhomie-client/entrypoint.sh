#!/bin/bash

set -e

if [ -z "${NEXT_PUBLIC_NODE_ENV:-}" ]; then
    echo "NEXT_PUBLIC_NODE_ENV environment variable must be set."
    exit 1
fi

echo "NEXT_PUBLIC_NODE_ENV: $NEXT_PUBLIC_NODE_ENV"

set -x

cleanup() {
    rm -rf node_modules build out .npm .next .cache .vercel .pnp .pnp.js package-lock.json coverage report.*.json *.log
}

install_dependencies() {
    npm install
}

start_production() {
    echo "Starting in production mode..."

    cleanup

    install_dependencies

    npm run build
    npm run start -p 3000
}

start_development() {
    echo "Starting in development mode..."

    cleanup

    install_dependencies

    npm run dev
}

if [ "$NEXT_PUBLIC_NODE_ENV" = "production" ]; then
    start_production
else
    start_development
fi

echo "Script is running..."

sleep infinity
