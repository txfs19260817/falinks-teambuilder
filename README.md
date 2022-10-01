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
- MongoDB Atlas (used Atlas Search). Set environment variables `MONGODB_URI` and `MONGODB_APIKEY`

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

Feel free to check [issues page](https://github.com/txfs19260817/falinks-teambuilder/issues).

## Roadmap

- [X] Collaborate text editor
- [ ] Usage Tour
- [X] Statistics
- [ ] Save & Load
- [X] Integrate with [Pokémon Showdown](https://play.pokemonshowdown.com/)
- [X] Suggested EVs spreads
- [X] Single Pokémon paste import/export
- [X] Team Gallery
- [X] Usage sorting
- [X] I18n

## Acknowledgements

- This project is based on a Next js template made by [CreativeDesignsGuru](https://creativedesignsguru.com/)
- Built with the best Pokémon Showdown components [@pkmn/ps](https://github.com/pkmn/ps)
- Collaborative features powered by [Yjs](https://github.com/yjs/yjs)
  and [SyncedStore](https://github.com/yousefed/SyncedStore)
- This README was generated by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)
