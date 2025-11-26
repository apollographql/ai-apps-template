#!/usr/bin/env bash

APP="./apollo-mcp-server mcp-config.yaml"
proc=""

start_server() {
  echo "Starting server..."
  $APP &
  proc=$!
}

stop_server() {
  if [ -n "$proc" ]; then
    kill "$proc" 2>/dev/null
    sleep 0.2

    # force kill if needed
    if kill -0 "$proc" 2>/dev/null; then
      kill -9 "$proc" 2>/dev/null
    fi

    wait "$proc" 2>/dev/null
    proc=""
  fi
}

# Start the first server
start_server

# Debounced watcher loop
chokidar "apps/**/*" -t -p |
while read path; do
  echo "Change detected: $path"
  
  # debounce: wait for a quiet window
  sleep 0.2
  while read -t 0.05 more; do :; done

  stop_server
  start_server
done