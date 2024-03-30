#!/bin/bash

die() {
  echo "$1" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

install_dependencies() {
  if ! command_exists npm; then
    die "Error: npm is not installed. Please install npm before running this script."
  fi

  echo "Installing frontend dependencies..."
  cd frontend || die "Error: frontend directory not found."
  npm install || die "Error: Failed to install frontend dependencies."
  cd ..

  echo "Installing backend dependencies..."
  cd backend || die "Error: backend directory not found."
  npm install || die "Error: Failed to install backend dependencies."
  cd ..
}

start_app() {
  echo "Starting backend server..."
  cd backend || die "Error: backend directory not found."
  npm run start &

  echo "Starting frontend server..."
  cd ../frontend || die "Error: frontend directory not found."
  npm run dev  
}

install_dependencies
start_app