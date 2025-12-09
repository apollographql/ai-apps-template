echo "Downloading Apollo MCP Server..."
curl -sSL https://mcp.apollo.dev/download/nix/v1.3.0-experimental.0 | sh

echo "Installing npm packages..."
cd ecommerce-graph
npm install

cd ../

cd dev/the-store
npm install
cd ../..

echo "Installing chokidar globally..."
npm i chokidar -g

echo "\n"
echo "\n"
echo "You're all installed and ready to go! 🚀"
echo "\n"
echo "To get started, do all the following in separate terminals:"
echo "1. 'cd' into the 'ecommerce-graph' folder and start it with 'npm run dev'"
echo "2. 'cd' into the 'dev/the-store' folder and start it with 'npm run dev:e2e'"
echo "3. From the root of this project, run 'start_mcp.sh' to start up the mcp server"
echo "\n"
echo "To access your running dev server from a provider (E.g. ChatGPT), you will likely need a tool like ngrok to create a tunnel to your locally running MCP server (E.g. ngrok http 8000)."
echo "\n"
echo "Happy building! 🚀"