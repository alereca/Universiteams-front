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

## Technologies used

### Frontend

| Name                              | How it contributes to the project              |
| :-------------------------------- | :--------------------------------------------- |
| :necktie: TypeScript              | Programming language that builds on JavaScript |
| :rocket: Next.js                  | Fullstack framework for React.js               |
| :basket: Mantine                  | Really cool component library                  |
| :bone: HTML5 & CSS3               | The basics for the web!                        |
| :art: Sass CSS                    | Simple stylization                             |
| :framed_picture: Tabler Icons     | Icons Mantine-compatible                       |
| :paintbrush: Prettier             | Nice code formatter                            |
| :triangular_ruler: ESLint         | Complete linter with strict rules              |
| :guide_dog: Husky                 | Git hooks to assure quality commits            |
| :test_tube: Jest                  | Easy unit testing                              |
| :package: TurboPack               | JavaScript very fast bundler                   |
| :page_with_curl: GitHub Actions   | CI/CD automation                               |
| :arrow_up_small: Deploy in Vercel | Deployment is very important!                  |           

### Backend

| Name                               | How it contributes to the project                             |
| :--------------------------------- | :------------------------------------------------------------ |
| :necktie: TypeScript               | Programming language that builds on JavaScript                |
| :green_book: Node.js               | JavaScript runtime built on V8 JavaScript engine              |
| :cat: Nest.js                      | Framework for building efficient, scalable Node.js web apps   |
| :world_map: TypeORM                | Object-relational mapping (ORM) tool for Node.js              |
| :card_file_box: PostgreSQL         | Open-source relational database management system (RDBMS)     |
| :floppy_disk: JSON Web Token (JWT) | Compact and self-contained way for securely transmitting info |
| :paintbrush: Prettier              | Nice code formatter                                           |
| :triangular_ruler: ESLint          | Complete linter with strict rules                             |
| :test_tube: Jest                   | Easy unit testing                                             |
| :alembic: Supertest                | High-level HTTP abstraction for E2E integration testing       |
| :open_book: Swagger                | Interactive, machine and human-readable API documentation     |
| :gear: Traefik                     | HTTP reverse proxy and load balancer                          |
| :whale: Docker                     | Separates the app from the infrastructure with containers     |
| :cloud: Terraform                  | Infrastructure as code tool to manage the infra in any cloud  |
| :airplane: New Relic               | Monitor and analyze deployments                               |
| :droplet: DigitalOcean Droplet     | Deploy in scalable cloud virtual machines                     |

## Authors

| Name                         | GitHub Account                          |
| :--------------------------- | :-------------------------------------- |
| :octocat: Alejandro Recalde  | :link: https://github.com/alereca       |
| :octocat: Nicolás Antonelli  | :link: https://github.com/NicoAntonelli |
| :octocat: Joshua Acciarri    | :link: https://github.com/JAcciarri     |
