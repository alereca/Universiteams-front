# Universiteams-front
Pro Scientific Dissemination &amp; Volunteering

## Getting started

### Nodejs

Clone this repository, then open it with a code editor and execute the command `npm install`.

> If the dependencies are not installed with the above command, you must install [Node.js](https://nodejs.org/es/) on your machine.

### Make

Only in case you happen to use Windows install [Chocolatey package manager](https://chocolatey.org/install)
Then install Make with the following command:

```bash
$ choco install make
```

## Run a server

To run a server on _development mode_ you need to execute:

```bash
make dev
```

To be able to visualize the dev server running, you must open [http://localhost:3000](http://localhost:3000/).

> By default, the utilized port will be 3000, but this can be configured and changed for other port.

To build the system for production you must execute:

```bash
make build
```

To run a server on _production mode_ you need to execute:

```bash
make prod
```

## Repository edit

The repository's root path is `src/app/layout.tsx`.

Each new component must be created inside the `components` folder. These are server-side rendered when they are called on any of the pages. Suppose we have a component called "Dropdown", it will be rendered on a page that contains the `<Dropdown />` tag.

## Documentation about Next.js

Important and interesting documentation of Next.js can be consulted at:

-   [Nextjs.org/docs](https://nextjs.org/docs) - Features and functionalities of Next.js
-   [Nextjs.org/learn](https://nextjs.org/learn) - Interactive tutorial about Next.js

## Tech stack
### Common
|Tool|
|:-|
|:ballot_box_with_check: TypeScript / JavaScript |
|:ballot_box_with_check: JWT|

### Backend
|Tool|
|:-|
|:ballot_box_with_check: Node.JS|
|:ballot_box_with_check: Nestjs|
|:ballot_box_with_check: TypeORM|
|:ballot_box_with_check: PostgreSQL|

### Frontend
|Tool|
|:-|
|:ballot_box_with_check: React|
|:ballot_box_with_check: Next.JS|
|:ballot_box_with_check: HTML5 / CSS3 / SASS|

## Authors
|Name|GitHub Account|
|:-|:-|
|Recalde, Alejandro|:octocat: https://github.com/alereca|
|Antonelli, Nicolás|:octocat: https://github.com/NicoAntonelli|
|Acciarri, Joshua|:octocat: https://github.com/JAcciarri|
