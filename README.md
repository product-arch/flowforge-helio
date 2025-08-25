# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cf0e860e-72c0-4d3e-8542-6e14b456aab5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cf0e860e-72c0-4d3e-8542-6e14b456aab5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## API Documentation

This project includes comprehensive API documentation served via Swagger UI.

### Start the Documentation Server

**Important**: You need to run both the development server and documentation server:

```sh
# Terminal 1: Start the React development server
npm run dev

# Terminal 2: Start the documentation server
npm run swagger
```

Or start the documentation server alone:

```sh
npm run swagger
```

With both servers running, the documentation will be available at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html (proxied from port 8081)
- **Alternative**: http://localhost:8080/docs (proxied from port 8081)
- **OpenAPI Spec**: http://localhost:8080/openapi.yaml (proxied from port 8081)
- **Health Check**: http://localhost:8080/health (proxied from port 8081)

The documentation server runs on port 8081, but is accessible through the main development server (port 8080) via proxy configuration.

### Environment Variables

Set `FLOWFORGE_API_TOKEN` to automatically authenticate API requests in Swagger UI:

```sh
export FLOWFORGE_API_TOKEN="your-api-token"
npm run swagger
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cf0e860e-72c0-4d3e-8542-6e14b456aab5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
