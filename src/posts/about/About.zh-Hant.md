# 欢迎使用 Falinks Teambuilder

Falinks Teambuilder 是一款协作宝可梦队伍编辑器，你可以与他人合作来组建一支宝可梦队伍。它致力于提供和 Pokémon Showdown
队伍编辑器一样的体验，但你可以邀请朋友一同协作来构建同一支队伍，你的改动会反映在房间内所有人的页面上。

为了让组队过程更容易，你可以通过导入现有的 Pokémon Showdown 格式的队伍文本或者 PokePaste 链接来开始。

## 用户脚本

我们准备了一个用户脚本 [falinks-teambuilder-helper](https://greasyfork.org/zh-CN/scripts/451746-falinks-teambuilder-helper)
来增强本应用和 Pokémon Showdown 与 PokePaste 的整合能力。

### 从队伍创建房间

它会在你访问 Pokémon Showdown 或 PokePaste 时被启用。它会创建一个“Open in a Falinks Teambuilder
room”的按钮来让你更容易地把队伍导入到本应用中。

### 将队伍添加到 Showdown 队伍编辑器

当你们完成了队伍的构建后，你可以点击房间内的“Load in Showdown”按钮来将队伍添加到你的 Pokémon Showdown
队伍编辑器中。它会在你确认后自动将队伍添加到你的队伍编辑器中。

## 已知问题

- WebRTC 不支持 [Safari 和 Chrome 的跨浏览器协作](https://github.com/yjs/y-webrtc/issues/19)。在这种情况下，请尝试
  WebSocket 协议。
- 请不要使用浏览器的前进或后退按钮进入房间，可能会产生一些问题，比如数据丢失等。
- 不支持跨通信协议。换句话说，只有房间名和通信协议都一样时才可以建立连接。

## 联系我

本应用还有很多的新功能等待实现，也一定会存在一系列问题。欢迎用户们在 [Twitter](https://twitter.com/dora_865)
或 [GitHub](https://github.com/txfs19260817/falinks-teambuilder/issues) 的 issue 或讨论区与我联系、提出建议或反馈问题。
