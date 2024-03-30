#!/bin/bash

die() {
  echo "$1" >&2
  exit 1
}

start_app() {
  echo "Starting backend server..."
  cd backend || die "Error: backend directory not found."
  npm run start &

  echo "Starting frontend server..."
  cd ../frontend || die "Error: frontend directory not found."
  npm run dev  
}

start_app