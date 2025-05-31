# Status Panel

This is the managing panel part of my status system available at https://github.com/Raraph84/Status-Website

## Setup

### Prerequisites

- Have already setup the API
- Git installed to clone the repo
- NodeJS installed to build

### Building

Clone the repo and install the libs by running:

```bash
git clone https://github.com/Raraph84/Status-Admin-Panel-Website
cd Status-Admin-Panel-Website/
npm install
```

Copy the `Status-Admin-Panel-Website/.env.example` to `Status-Admin-Panel-Website/.env` and fill it to match your API URL and API KEY configured in the API env file
Then build the panel by running:

```bash
npm run build
```

Then serve the static panel website built in `Status-Admin-Panel-Website/build/` with any webserver  
/!\ You should add an htpasswd authentication or any other authentication to the panel or anyone will be able to modify your configuration
