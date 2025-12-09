# About this Template

This template is for building AI Conversational Apps (currently for OpenAI Apps SDK and more coming) using Apollo Client and Apollo MCP Server.

This template contains the Vite setup required for building React apps that can be served by Apollo MCP Server, the Apollo Client integration package, as well as a demo e-commerce graphql and react application.

## Getting Started

First, create a copy of this repo using a scaffolding tool like [tiged](https://github.com/tiged/tiged):

```sh
npx tiged apollographql/ai-apps-template my-awesome-app
```

`cd` into the newly created project directory and then run the install script to setup your repo:

```sh
./install.sh
```

You're now ready to run your app!

## Running the Demo

To run the demo, do all the following in separate terminals:

1. `cd` into the `ecommerce-graph` folder and start it with `npm run dev`
2. `cd` into the `dev/the-store` folder and start it with `npm run dev:e2e`
3. From the root of this project, run `./start_mcp.sh` to start up the mcp server

To access your running dev server from a provider (E.g. ChatGPT), you will likely need a tool like [ngrok](https://ngrok.com/) to create a tunnel to your locally running MCP server (E.g. `ngrok http 8000`).

## Accessing the App from ChatGPT

Follow the instructions in the OpenAI docs to [Add your app to ChatGPT](https://developers.openai.com/apps-sdk/quickstart/#add-your-app-to-chatgpt). Note that this requires a Plus or higher plan.
