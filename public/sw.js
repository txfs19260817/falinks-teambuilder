if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let n={};const r=e=>a(e,o),l={module:{uri:o},exports:n,require:r};s[o]=Promise.all(c.map((e=>l[e]||r(e)))).then((e=>(i(...e),n)))}}define(["./workbox-09483baf"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/117-fde54f2a35a58909.js",revision:"fde54f2a35a58909"},{url:"/_next/static/chunks/224-9256877a7e07d83f.js",revision:"9256877a7e07d83f"},{url:"/_next/static/chunks/226-5489d37a835beb77.js",revision:"5489d37a835beb77"},{url:"/_next/static/chunks/285-44be220faedabe86.js",revision:"44be220faedabe86"},{url:"/_next/static/chunks/328748d6-4437d3744d0cb515.js",revision:"4437d3744d0cb515"},{url:"/_next/static/chunks/338.8f12b9825814d8b6.js",revision:"8f12b9825814d8b6"},{url:"/_next/static/chunks/428.84393a3652457b3d.js",revision:"84393a3652457b3d"},{url:"/_next/static/chunks/536-dbde59534992df80.js",revision:"dbde59534992df80"},{url:"/_next/static/chunks/558-d2115c546d288453.js",revision:"d2115c546d288453"},{url:"/_next/static/chunks/591-8018a9feabe3d046.js",revision:"8018a9feabe3d046"},{url:"/_next/static/chunks/5ffd85b2-e1e8331d0c3f22b8.js",revision:"e1e8331d0c3f22b8"},{url:"/_next/static/chunks/605-8210011f2db89a55.js",revision:"8210011f2db89a55"},{url:"/_next/static/chunks/680-1052e748aef9250a.js",revision:"1052e748aef9250a"},{url:"/_next/static/chunks/755-b402d8e3390cbc97.js",revision:"b402d8e3390cbc97"},{url:"/_next/static/chunks/858-5b7ccc7caf7febb4.js",revision:"5b7ccc7caf7febb4"},{url:"/_next/static/chunks/884-0f9da17637ecba67.js",revision:"0f9da17637ecba67"},{url:"/_next/static/chunks/e8ed2805-f93f9905494a9183.js",revision:"f93f9905494a9183"},{url:"/_next/static/chunks/fc83e031.33fba8016832ea63.js",revision:"33fba8016832ea63"},{url:"/_next/static/chunks/framework-3b5a00d5d7e8d93b.js",revision:"3b5a00d5d7e8d93b"},{url:"/_next/static/chunks/main-50e459f6d51194e6.js",revision:"50e459f6d51194e6"},{url:"/_next/static/chunks/pages/_app-7dc793ba1fa7b57b.js",revision:"7dc793ba1fa7b57b"},{url:"/_next/static/chunks/pages/_error-8353112a01355ec2.js",revision:"8353112a01355ec2"},{url:"/_next/static/chunks/pages/about-45eff2744b45ab4c.js",revision:"45eff2744b45ab4c"},{url:"/_next/static/chunks/pages/index-c49b6a48d6625d1a.js",revision:"c49b6a48d6625d1a"},{url:"/_next/static/chunks/pages/pastes/%5Bid%5D-3d0d0b5323345d8f.js",revision:"3d0d0b5323345d8f"},{url:"/_next/static/chunks/pages/pastes/create-3bed64315f0b61cf.js",revision:"3bed64315f0b61cf"},{url:"/_next/static/chunks/pages/pastes/public-df2f6157f2d1d2d8.js",revision:"df2f6157f2d1d2d8"},{url:"/_next/static/chunks/pages/pastes/search-cdbc6e4430a1c1c7.js",revision:"cdbc6e4430a1c1c7"},{url:"/_next/static/chunks/pages/pastes/vgc/%5Bformat%5D-dab1293557de0df2.js",revision:"dab1293557de0df2"},{url:"/_next/static/chunks/pages/room/%5Bname%5D-3c323b6f0f092a39.js",revision:"3c323b6f0f092a39"},{url:"/_next/static/chunks/pages/usages/%5Bformat%5D-664920350115f777.js",revision:"664920350115f777"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-2da4ea9a37791b94.js",revision:"2da4ea9a37791b94"},{url:"/_next/static/css/ad9ed82472d419cf.css",revision:"ad9ed82472d419cf"},{url:"/_next/static/qa3ScOLbXN2FzviPFTwmn/_buildManifest.js",revision:"8d819c5aad0b7115418747eee8b70cef"},{url:"/_next/static/qa3ScOLbXN2FzviPFTwmn/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android-chrome-192x192.png",revision:"1094000695a36403f4fdd87de9ab6631"},{url:"/android-chrome-384x384.png",revision:"1c290104e4c6bf8602214a2525e2a2c1"},{url:"/android-chrome-512x512.png",revision:"7956dbcfb9aacdee297e1bca58ba1901"},{url:"/apple-touch-icon.png",revision:"ae1c9fa7e5d2a3e9ccc94d5980d64191"},{url:"/assets/images/hero.jpg",revision:"ac1980883889e4c4d104c448162292d3"},{url:"/assets/images/loading.gif",revision:"684e7d1f6fb11af1049b23ddaa9425f5"},{url:"/assets/moves/categories/Physical.png",revision:"bc291652c7271be785db0675de096f75"},{url:"/assets/moves/categories/Special.png",revision:"af38ba94c8c9c8e3250a5f67bcc6add0"},{url:"/assets/moves/categories/Status.png",revision:"d1eca3884856f94aafe6492d058aa630"},{url:"/assets/types/Bug.webp",revision:"791edec593af062bf54e8b41f4e728b9"},{url:"/assets/types/Dark.webp",revision:"dd598ff5b71378a4ac85648a2a5597ff"},{url:"/assets/types/Dragon.webp",revision:"61eb32085f0c6ce24d79898b65da4dc9"},{url:"/assets/types/Electric.webp",revision:"46acf6b1d888d408a1caf8e9685cd845"},{url:"/assets/types/Fairy.webp",revision:"fd346478122ec94a495f7e8afad1699e"},{url:"/assets/types/Fighting.webp",revision:"0588b8bf725c594077c5b79a8e08a6ae"},{url:"/assets/types/Fire.webp",revision:"f15f9b0ff77819fa7b56ca8a5f65945e"},{url:"/assets/types/Flying.webp",revision:"bed18ffc4eee8c09c758bcdec2f372ef"},{url:"/assets/types/Ghost.webp",revision:"57a615196028c64ad854fc16c2f979e7"},{url:"/assets/types/Grass.webp",revision:"259b2df6648239bcacd16acda37805e9"},{url:"/assets/types/Ground.webp",revision:"9e2b2d1d93a5123970ad6e5e5dfccb48"},{url:"/assets/types/Ice.webp",revision:"177a2c71eb2f31c5b4e5a5787020a585"},{url:"/assets/types/Normal.webp",revision:"12252dd8fc2b0f3c46a4c8b37ebcafd9"},{url:"/assets/types/Poison.webp",revision:"1fb0710a91f14b1da5798deefeef90ed"},{url:"/assets/types/Psychic.webp",revision:"855033719b81d7fec146ad95a97f5260"},{url:"/assets/types/Rock.webp",revision:"6d63d4e60bc78b1e25035a1925b8981b"},{url:"/assets/types/Steel.webp",revision:"1b0d1649ba94066898c16c1bdce5dab9"},{url:"/assets/types/Water.webp",revision:"df770a5e1c05b769335f1bdd77e2f59c"},{url:"/favicon-16x16.png",revision:"ca91a9984f6edd1ecc2b5d413217d9f8"},{url:"/favicon-32x32.png",revision:"9d6d755062dfd2c0dbeae8f2ef24c843"},{url:"/favicon.ico",revision:"4dbe829e299bf1f6285b4078f84c1b15"},{url:"/locales/de/abilities.json",revision:"9766ccc6ea5547a022b179152a85a89f"},{url:"/locales/de/ability_descriptions.json",revision:"7297aacd2a1253353816aa4a71d5d816"},{url:"/locales/de/categories.json",revision:"986fe79197a9276dbc6f104b7ef35bb0"},{url:"/locales/de/common.json",revision:"2361d60547a93779619d0babcb6e4fe5"},{url:"/locales/de/create.json",revision:"9d2b8ac830284cf1dfb6a0bed5cbcb06"},{url:"/locales/de/formes.json",revision:"f640f9c4e0b6ea90e18b6edc740dec22"},{url:"/locales/de/home.json",revision:"4392cafe83934199e031a4400bb3630d"},{url:"/locales/de/item_descriptions.json",revision:"caedccadfecac801995e76e85e860012"},{url:"/locales/de/items.json",revision:"98667f9da86ff067ba703dce1aaf732d"},{url:"/locales/de/move_descriptions.json",revision:"29c3e9dfd73a0e38a8b981cff00c6707"},{url:"/locales/de/moves.json",revision:"8c1a943890218864975be33b344e8669"},{url:"/locales/de/natures.json",revision:"f59e1132a8e669e6f46b24932596a087"},{url:"/locales/de/room.json",revision:"b42f59050b7579ad37c5f634a53f1176"},{url:"/locales/de/search.json",revision:"ad2dc933f4ff98f1769293080fdb695a"},{url:"/locales/de/species.json",revision:"100f632781977702da845147ae358e6c"},{url:"/locales/de/types.json",revision:"c5653cb28238a3298c2979748b655c5b"},{url:"/locales/de/usages.json",revision:"b571d167b8d89b314753b4c828ee02cb"},{url:"/locales/en/abilities.json",revision:"e45add85d5818c37ebb1b4cb49bda12f"},{url:"/locales/en/categories.json",revision:"bbc3f51df7fba416ebc7de411081eb3d"},{url:"/locales/en/common.json",revision:"17c7d06c27dcf637d5ac5f8935ce0099"},{url:"/locales/en/create.json",revision:"a84c32c89759b00f68a342240ec1c74e"},{url:"/locales/en/home.json",revision:"720e6d8843be0ab42a1a4e0f4899a548"},{url:"/locales/en/items.json",revision:"171c35ab3e3b7a395f0f86707147bcc7"},{url:"/locales/en/moves.json",revision:"33adf1296529812e14a581cba33ffbf1"},{url:"/locales/en/natures.json",revision:"f0980de8a63616a331adab92a7b56818"},{url:"/locales/en/room.json",revision:"907d2331ff5526af20825ed21f06e567"},{url:"/locales/en/search.json",revision:"ce7eede156b68961b618caf47b5291b7"},{url:"/locales/en/species.json",revision:"cacc192a950e7f6a967b592d04222ad5"},{url:"/locales/en/types.json",revision:"bb20c56d9521cc77611225b623e0fbce"},{url:"/locales/en/usages.json",revision:"07a968d1b056c6e5d5891e70bce9e288"},{url:"/locales/es/abilities.json",revision:"1dcad0b4b2559fbc31a2f5ebcb6d060a"},{url:"/locales/es/ability_descriptions.json",revision:"2c2c99a1b1a3975553383205e728c8fd"},{url:"/locales/es/categories.json",revision:"847bb8646882aa892db5735a80ec5141"},{url:"/locales/es/common.json",revision:"b1bd758063731de3b9fcd716b8ae5709"},{url:"/locales/es/create.json",revision:"9f9a667694d1a9c33f453666d78361ef"},{url:"/locales/es/formes.json",revision:"555a3f80d89a4caacc16ad339d74301b"},{url:"/locales/es/home.json",revision:"93e2ceb34b1ae4aba030f1160b7060ea"},{url:"/locales/es/item_descriptions.json",revision:"30255d1db1ee0e41e895f31acb3217c8"},{url:"/locales/es/items.json",revision:"9a5616b8efdeb6234b809a1050f82c80"},{url:"/locales/es/move_descriptions.json",revision:"70985e2a28398d385f64d9c32f2a4f5a"},{url:"/locales/es/moves.json",revision:"524dd2ab407a17e0f6cc47d6b186fc2d"},{url:"/locales/es/natures.json",revision:"1158d8e78833bd9b4b465a9261ed9d2e"},{url:"/locales/es/room.json",revision:"a3bd0a0edd6085f5bada7c83df4971c9"},{url:"/locales/es/search.json",revision:"366ed419ab75406d948b082db38f66e8"},{url:"/locales/es/species.json",revision:"2bc2317b0fd67b7713f58ee6eb09d961"},{url:"/locales/es/types.json",revision:"3697175432348a651cc9c3fae3b38645"},{url:"/locales/es/usages.json",revision:"4c341a82ca6984c5e5aa4fcaf106c1e5"},{url:"/locales/fr/abilities.json",revision:"c0080e6587c4855639198a1cade598f3"},{url:"/locales/fr/ability_descriptions.json",revision:"d8cd39ce95a0927a1c0b5f3c1c6f2062"},{url:"/locales/fr/categories.json",revision:"c969b65c5ba9243ea068f4256867631c"},{url:"/locales/fr/common.json",revision:"42ba6d17193bc9986b3b5b48f859e319"},{url:"/locales/fr/create.json",revision:"3bc4eb2177cbf1b32df972832723697c"},{url:"/locales/fr/formes.json",revision:"c40d49f375ba4538c71f699a1275d4e3"},{url:"/locales/fr/home.json",revision:"336b48c802c3f411a2979de1338d7018"},{url:"/locales/fr/item_descriptions.json",revision:"a9e86f9613701a2d96198c262912d401"},{url:"/locales/fr/items.json",revision:"219b5a7790ac56f1beb2e0d0e894b289"},{url:"/locales/fr/move_descriptions.json",revision:"810e55fda00b84a5cb4a6c7a644243f4"},{url:"/locales/fr/moves.json",revision:"e2d2e107b8ad972555505876c9d6e8ec"},{url:"/locales/fr/natures.json",revision:"52a693bc4e997f7e3380b1af08811fd5"},{url:"/locales/fr/room.json",revision:"b4aa664dbc3b1a2140f0bc8d7a3a0c7e"},{url:"/locales/fr/search.json",revision:"faa17a81a7e7e6bbdc5c3bbed76ac68e"},{url:"/locales/fr/species.json",revision:"879183eebd5e193b893d11b3071c01a7"},{url:"/locales/fr/types.json",revision:"9d3d43b608bdde7c5cc3d72e1f6ac223"},{url:"/locales/fr/usages.json",revision:"a5bd755c1fe7b56a448c440dd5ee942e"},{url:"/locales/it/abilities.json",revision:"e16b2bdf0f03a46bae3c63aa26c56d0a"},{url:"/locales/it/ability_descriptions.json",revision:"cc6089aba6cb90e5bf8d4d54bb500a18"},{url:"/locales/it/categories.json",revision:"f4afdc58b90a7fd00a93f3d4af78b82c"},{url:"/locales/it/common.json",revision:"7e5f46dadd476574ff5539a25294740b"},{url:"/locales/it/create.json",revision:"22126a843481cd14c2ea181e75ad9865"},{url:"/locales/it/formes.json",revision:"8a64e981242c2a95aebfd374dd24299b"},{url:"/locales/it/home.json",revision:"0acad449e7c8477e9e39074e43db6f66"},{url:"/locales/it/item_descriptions.json",revision:"d5c4ac28e1d90c6367d1281fc502b65f"},{url:"/locales/it/items.json",revision:"4cacb944666412dc27ea6b79959b3ecb"},{url:"/locales/it/move_descriptions.json",revision:"606d1affb8c24a6ddeb0249d74668640"},{url:"/locales/it/moves.json",revision:"03bf5d24e84ad758543e8d2a823c624d"},{url:"/locales/it/natures.json",revision:"794755658ce0a28cdb98fc1370e28a11"},{url:"/locales/it/room.json",revision:"30c558db281264b3d358eac8aa5ea0f1"},{url:"/locales/it/search.json",revision:"b9de41b50c400cdce1a4443e927c3df2"},{url:"/locales/it/species.json",revision:"3dbb9ca4410b8511902e568c5b93dbc7"},{url:"/locales/it/types.json",revision:"9d0202b39e81f9e3735efd608eae54b7"},{url:"/locales/it/usages.json",revision:"1dd2727931e9ad041eaad3088ff3f382"},{url:"/locales/ja/abilities.json",revision:"a1507fb8c06cd3207895271120fbf107"},{url:"/locales/ja/ability_descriptions.json",revision:"b15b45f23e67437aca05ada17300296f"},{url:"/locales/ja/categories.json",revision:"71b6dc3129ff7e2919f7fd2814c2b48f"},{url:"/locales/ja/common.json",revision:"f8466356d61ca132c5d0aff23914176f"},{url:"/locales/ja/create.json",revision:"852d398bc4c2a975fab565644438d2bd"},{url:"/locales/ja/formes.json",revision:"8919f58c04c4f7d74f4a8c2570d0242c"},{url:"/locales/ja/home.json",revision:"7e1647b7acc49d5fa63a741a4a179c5f"},{url:"/locales/ja/item_descriptions.json",revision:"348e10f6cbc53d5dc7443714c49aeace"},{url:"/locales/ja/items.json",revision:"77cfe65a57a8b5e2f2eddeef8654198e"},{url:"/locales/ja/move_descriptions.json",revision:"bfad316d6e1001737c6b26525fcd7f49"},{url:"/locales/ja/moves.json",revision:"463c8f7573af75e8a0bb62ccbfe3bfaf"},{url:"/locales/ja/natures.json",revision:"724a49fa93ff8c79fff18d984e1d17a9"},{url:"/locales/ja/room.json",revision:"8a09dd8d491b2d54e67b388a6305a8e4"},{url:"/locales/ja/search.json",revision:"30083dab03291ffad1c6d6bc5a379243"},{url:"/locales/ja/species.json",revision:"895be6351e5dcfaa128985479585aee8"},{url:"/locales/ja/types.json",revision:"d671dad032aca822bbc53358dfa50b7f"},{url:"/locales/ja/usages.json",revision:"7216967b5a2f7f96d7a22ef4c980a7b2"},{url:"/locales/ko/abilities.json",revision:"bdd62dd55fd01b8cdde00c7adc09bc63"},{url:"/locales/ko/ability_descriptions.json",revision:"dac77bcbda4326a3ba006bb611be386c"},{url:"/locales/ko/categories.json",revision:"f69048481b12e62f058a11a571b2eda4"},{url:"/locales/ko/common.json",revision:"964615c94a272a5c6f8adbe2804c3296"},{url:"/locales/ko/create.json",revision:"62a0c692f22262330bbc0869b91523b5"},{url:"/locales/ko/formes.json",revision:"37daabbd35bc7918f57b702a875b7d00"},{url:"/locales/ko/home.json",revision:"17c9e4fd8a6798388cd59934e25a7722"},{url:"/locales/ko/item_descriptions.json",revision:"24d531809a97f8f82ffa2001cdd345fd"},{url:"/locales/ko/items.json",revision:"faf905e5a24060debbff790c2df03acf"},{url:"/locales/ko/move_descriptions.json",revision:"1ce8c67c58649f86b24a8ae1c389cc37"},{url:"/locales/ko/moves.json",revision:"092f02e5a2beb8abb4f65eefc07fe196"},{url:"/locales/ko/natures.json",revision:"8afcd2cfa765363b59a291ce0fa51f76"},{url:"/locales/ko/room.json",revision:"25b504a9e9e5cd0817610b0f5b3d5bb7"},{url:"/locales/ko/search.json",revision:"f0ea0243c1652688bf3d53f52b283c4e"},{url:"/locales/ko/species.json",revision:"ccf66acc408ebbe0321fffe366a3aba6"},{url:"/locales/ko/types.json",revision:"3092e42c51ce5057c4fa34946d2dfbb4"},{url:"/locales/ko/usages.json",revision:"8cf3f486ff0f2115e61294057b7de0f0"},{url:"/locales/zh-Hans/abilities.json",revision:"803f59e0628bc348edb84d09d03054ee"},{url:"/locales/zh-Hans/ability_descriptions.json",revision:"ca346491d6187b7c3dd84c82d7d937b5"},{url:"/locales/zh-Hans/categories.json",revision:"eba900505a63aa5a901d612a3e14b8ff"},{url:"/locales/zh-Hans/common.json",revision:"7eb15d1d3a3870740331b6ea2b57d419"},{url:"/locales/zh-Hans/create.json",revision:"959fa7977b3c2c3ad5129766c3501acb"},{url:"/locales/zh-Hans/formes.json",revision:"dd3d3079d5983e553d346c73c5e68aac"},{url:"/locales/zh-Hans/home.json",revision:"11a1e25c58f60905de15bd2a011a0fde"},{url:"/locales/zh-Hans/item_descriptions.json",revision:"c5c2f78db9c11e71a513b39fe763e738"},{url:"/locales/zh-Hans/items.json",revision:"4466250383a6ba2e5128cf823568e9bf"},{url:"/locales/zh-Hans/move_descriptions.json",revision:"fdfc4d0eed2fffad3bc4300ec8e17c31"},{url:"/locales/zh-Hans/moves.json",revision:"5aab79065524e0de9fe6c1fc3dc7f7dc"},{url:"/locales/zh-Hans/natures.json",revision:"2474795ffa0ec01b07f4e576635e9646"},{url:"/locales/zh-Hans/room.json",revision:"fc1eb4fbb198a8620893e7cce23b939b"},{url:"/locales/zh-Hans/search.json",revision:"127bfc6237a76b30b95c3326303a98e3"},{url:"/locales/zh-Hans/species.json",revision:"5ccd40cda06eec03c26f2b405794e70f"},{url:"/locales/zh-Hans/types.json",revision:"4275dea37027368697a14e4f721e991f"},{url:"/locales/zh-Hans/usages.json",revision:"7c3310b234d4f7f8fdd2822cd182ee87"},{url:"/locales/zh-Hant/abilities.json",revision:"04154955a13ff59f0cf62374251addf8"},{url:"/locales/zh-Hant/ability_descriptions.json",revision:"e5d835744db206b005ebf479ba50b9fc"},{url:"/locales/zh-Hant/categories.json",revision:"de7a4a6de3ee75b254318c559a326cbd"},{url:"/locales/zh-Hant/common.json",revision:"8056c91e932a192b327e3966b63e7bc4"},{url:"/locales/zh-Hant/create.json",revision:"5e6ea265ec7f6eec13c8dbdd41496548"},{url:"/locales/zh-Hant/formes.json",revision:"01aac90b94e97fd39b382d0ac9118230"},{url:"/locales/zh-Hant/home.json",revision:"3cc45a79524a3061ee438dce809bec9c"},{url:"/locales/zh-Hant/item_descriptions.json",revision:"5a9b1d173dc0e50d8f85a299e21a8ade"},{url:"/locales/zh-Hant/items.json",revision:"1b8e7ad81460ab1fa9efdb519f02eb1f"},{url:"/locales/zh-Hant/move_descriptions.json",revision:"2be3e00b1dc78c1e32875cc403cf35ff"},{url:"/locales/zh-Hant/moves.json",revision:"c733b5d79b5de157ad7da9c103c91778"},{url:"/locales/zh-Hant/natures.json",revision:"46dccf8f99ceb998381ffb58cfa6c547"},{url:"/locales/zh-Hant/room.json",revision:"67504eeba25b8af40a54b377224d2856"},{url:"/locales/zh-Hant/search.json",revision:"bf48a07d67fdfb33a7a07bafc122b9dd"},{url:"/locales/zh-Hant/species.json",revision:"1ca91656c10e3eafc0d1f4b0b23b0f7f"},{url:"/locales/zh-Hant/types.json",revision:"d21467c3dee86e0ff86f8bd984f14471"},{url:"/locales/zh-Hant/usages.json",revision:"4f7d86361dc4ee78dd717d992804aa95"},{url:"/manifest.json",revision:"414330f5bc1b91b8106cc44bb6091567"},{url:"/robots.txt",revision:"126407814a7a6cad45d3bcfb46090e0e"},{url:"/safari-pinned-tab.svg",revision:"3733b9e8fc0e0fb08480d65d84b2cf7a"},{url:"/sitemap-0.xml",revision:"53ba64a4c33c7048f40c8ac02e326c07"},{url:"/sitemap-1.xml",revision:"f841b14e9a00c0e4e57e36f7e4eddc36"},{url:"/sitemap-2.xml",revision:"cde093757af1beb2ba0fd165888ad6fe"},{url:"/sitemap-3.xml",revision:"726c588bf1de9fc077b4e933be02ce19"},{url:"/sitemap-4.xml",revision:"8b64ce3f46349084609399ca25c9d4b5"},{url:"/sitemap-5.xml",revision:"839ca6dde16984a985f2952df5c1bdb6"},{url:"/sitemap-6.xml",revision:"b5589fefb0fa91f56204f4e585834565"},{url:"/sitemap.xml",revision:"67fb6d0a3baa4d550ffb8d208a0265da"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
