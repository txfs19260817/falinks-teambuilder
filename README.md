# Welcome to [Falinks Teambuilder](https://falinks-teambuilder.vercel.app/) 👋

[![Node.js CI](https://github.com/txfs19260817/falinks-teambuilder/actions/workflows/node.js.yml/badge.svg)](https://github.com/txfs19260817/falinks-teambuilder/actions/workflows/node.js.yml)
[![License: WTFPL](https://img.shields.io/badge/License-WTFPL-yellow.svg)](https://github.com/txfs19260817/falinks-teambuilder/blob/main/LICENSE)

> Use Falinks Teambuilder to create, and collaborate on Pokémon teams.
> Build together with real-time sharing and from any device.

## Usage

![Usage](usage.gif?raw=true)

## Userscript

Please install the [falinks-teambuilder-helper](https://greasyfork.org/zh-CN/scripts/451746-falinks-teambuilder-helper)
UserScript to enhance the experience of using Falinks Teambuilder with Pokémon Showdown and PokePaste together.

## Development

Requirements:

- Node.js: 16.x (used `.at()`)
- PostgreSQL URLs required by Prisma (
  see [Prisma docs](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database#shadow-database-user-permissions))
    - `DATABASE_URL`: For development / production
    - `SHADOW_DATABASE_URL`: Cloud-hosted shadow databases must be created manually

### Install

```sh
npm install
```

### Develop

```sh
next dev
```

### Run tests

```sh
npm run test
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/txfs19260817/falinks-teambuilder/issues)
and [discussions page](https://github.com/txfs19260817/falinks-teambuilder/discussions).

## Acknowledgements

- This project is based on a Next js template made by [CreativeDesignsGuru](https://creativedesignsguru.com/)
- Built with the best Pokémon Showdown components [@pkmn/ps](https://github.com/pkmn/ps)
- Collaborative features powered by [Yjs](https://github.com/yjs/yjs)
  and [SyncedStore](https://github.com/yousefed/SyncedStore)
- This README was generated by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)
