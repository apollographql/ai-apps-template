#!/usr/bin/env bash

APP="./apollo-mcp-server mcp-config.yaml"
proc=""

generate_api_schema() {
  echo "Generating API schema..."
  rover graph introspect http://localhost:4000 > schema.graphql
}

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

clear

# Start the first server
generate_api_schema
start_server

# Debounced watcher loop
chokidar "apps/**/*" "ecommerce-graph/src/**/*" -t -p |
while read path; do
  echo "Change detected..."

  # debounce: wait for a quiet window
  sleep 0.2
  while read -t 0.05 more; do :; done

  stop_server

  clear

  # Only regenerate schema if change was in ecommerce-graph
  if [[ "$path" == *ecommerce-graph/* ]]; then
    generate_api_schema
  fi

  start_server
done