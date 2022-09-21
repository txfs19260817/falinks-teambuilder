# Welcome

Falinks Teambuilder is an online Pokémon teambuilder that lets you create Pokémon teams and work with other people. It aims to deliver an experience similar to the Pokémon Showdown teambuilder, but you can collaborate with friends and the changes you make will be visible on everyone's screens in the same room.

You may start from scratch or import an existing Showdown paste to create a new team. You may also easily export your team to a Showdown importable or generate a PokePaste link.

## UserScript

You may install the [falinks-teambuilder-helper](https://greasyfork.org/zh-CN/scripts/451746-falinks-teambuilder-helper) UserScript. It will be enabled when Pokémon Showdown or PokePaste is launched and create a "Open in a Falinks Teambuilder room" button on the page. It makes it easy to load teams into Falinks Teambuilder.

## Known issues

- WebRTC provider cannot make [Safari and Chrome browsers work together](https://github.com/yjs/y-webrtc/issues/19) on the same team. In this case, you may try WebSocket provider.
- Please do not use the Back and Forward buttons to enter a room in order to prevent unanticipated behavior. It may also result in data loss.
- Collaboration between providers of different communication protocols is not supported. In other words, both the provider and room name are required to match in order to establish a connection.

## Contact me

There are still several features and issues to be added and fixed. If you have any suggestions or questions, feel free to contact me on [Twitter](https://twitter.com/dora_865) or leave your questions on the [GitHub](https://github.com/txfs19260817/falinks-teambuilder/issues) issue or discussion pages.
