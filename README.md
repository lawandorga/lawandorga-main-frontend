# lawandorga-frontend

## Running the app locally against a local backend

To run the app locally, you need to start the [backend](https://github.com/lawandorga/lawandorga-backend-service)
first. Take note of the URL where the development server can be accessed. If necessary, replace the addresses in
`.env.development` with the ones from the backend server. Then run `npm run dev` to start the frontend server.

## Running the on Docker

Remember to run `npm run build` to get a new `/dist`, then run `docker build . -t lorga` to build the Docker image,
and finally `docker run lorga` to actually start the container.

## Code-formatting on VS Code

If you use VS Code, you can copy the rules from `.vscode/settings.json` into your editor's Workspace Settings.
