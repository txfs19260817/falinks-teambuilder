if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const r=e=>a(e,n),d={module:{uri:n},exports:t,require:r};s[n]=Promise.all(c.map((e=>d[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-40866503"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/Q-wBd-64GWyfZ69n-4Nt1/_buildManifest.js",revision:"410c41ad6c276e12affe7ac77b72d32d"},{url:"/_next/static/Q-wBd-64GWyfZ69n-4Nt1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0a867698-93dc4e3caaf01afb.js",revision:"93dc4e3caaf01afb"},{url:"/_next/static/chunks/100-eb70941fa7b4b446.js",revision:"eb70941fa7b4b446"},{url:"/_next/static/chunks/11ca5fc8-8966c6aec5cea310.js",revision:"8966c6aec5cea310"},{url:"/_next/static/chunks/143-3d9e00abf086d3a0.js",revision:"3d9e00abf086d3a0"},{url:"/_next/static/chunks/152-8b45801a47cfa79e.js",revision:"8b45801a47cfa79e"},{url:"/_next/static/chunks/16-2fa9512c7b292ab9.js",revision:"2fa9512c7b292ab9"},{url:"/_next/static/chunks/21-93594b868724dfbd.js",revision:"93594b868724dfbd"},{url:"/_next/static/chunks/218-08166d08d2994cb4.js",revision:"08166d08d2994cb4"},{url:"/_next/static/chunks/224-5425cffd14280a1f.js",revision:"5425cffd14280a1f"},{url:"/_next/static/chunks/328748d6-b45d2116d88e7972.js",revision:"b45d2116d88e7972"},{url:"/_next/static/chunks/469-0efeaa09a940ad09.js",revision:"0efeaa09a940ad09"},{url:"/_next/static/chunks/536-93d881d742995ad6.js",revision:"93d881d742995ad6"},{url:"/_next/static/chunks/608-e317c8b62d86fd39.js",revision:"e317c8b62d86fd39"},{url:"/_next/static/chunks/614-c0d4fde9e5970caf.js",revision:"c0d4fde9e5970caf"},{url:"/_next/static/chunks/615-fae80e2bada7a885.js",revision:"fae80e2bada7a885"},{url:"/_next/static/chunks/622-2b79d4b6e792ffde.js",revision:"2b79d4b6e792ffde"},{url:"/_next/static/chunks/672.f975eca3f50b4032.js",revision:"f975eca3f50b4032"},{url:"/_next/static/chunks/675-e3cb535974bdf2d3.js",revision:"e3cb535974bdf2d3"},{url:"/_next/static/chunks/67942a6e-e749e2446a0ebc5a.js",revision:"e749e2446a0ebc5a"},{url:"/_next/static/chunks/68.13dfb1ecfe3012bd.js",revision:"13dfb1ecfe3012bd"},{url:"/_next/static/chunks/ebbea289-62a2de45d488b55e.js",revision:"62a2de45d488b55e"},{url:"/_next/static/chunks/fc83e031.23b1918aadba2338.js",revision:"23b1918aadba2338"},{url:"/_next/static/chunks/framework-4556c45dd113b893.js",revision:"4556c45dd113b893"},{url:"/_next/static/chunks/main-5b017a336f76d7af.js",revision:"5b017a336f76d7af"},{url:"/_next/static/chunks/pages/_app-1fb0d1edf72f1274.js",revision:"1fb0d1edf72f1274"},{url:"/_next/static/chunks/pages/_error-a4ba2246ff8fb532.js",revision:"a4ba2246ff8fb532"},{url:"/_next/static/chunks/pages/about-43eba10e2a96c8e8.js",revision:"43eba10e2a96c8e8"},{url:"/_next/static/chunks/pages/calc-f50fc259d85de09a.js",revision:"f50fc259d85de09a"},{url:"/_next/static/chunks/pages/index-ebb641b00ad9ec01.js",revision:"ebb641b00ad9ec01"},{url:"/_next/static/chunks/pages/pastes/create-56766cc0006f19c1.js",revision:"56766cc0006f19c1"},{url:"/_next/static/chunks/pages/pastes/private/%5Bid%5D-90c5b4a06d896c07.js",revision:"90c5b4a06d896c07"},{url:"/_next/static/chunks/pages/pastes/public-4e99842e3fb17fcf.js",revision:"4e99842e3fb17fcf"},{url:"/_next/static/chunks/pages/pastes/public/%5Bid%5D-e6c0f6fd99a2c2e2.js",revision:"e6c0f6fd99a2c2e2"},{url:"/_next/static/chunks/pages/pastes/vgc-d457d8f7584db405.js",revision:"d457d8f7584db405"},{url:"/_next/static/chunks/pages/pastes/vgc/%5Bid%5D-0e07583621f0674e.js",revision:"0e07583621f0674e"},{url:"/_next/static/chunks/pages/room/%5Bname%5D-f58b94086cc67f0a.js",revision:"f58b94086cc67f0a"},{url:"/_next/static/chunks/pages/usages/%5Bformat%5D-8d9a10849ef07d1d.js",revision:"8d9a10849ef07d1d"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-417b277277626292.js",revision:"417b277277626292"},{url:"/_next/static/css/61b0facb5d87a82d.css",revision:"61b0facb5d87a82d"},{url:"/android-chrome-192x192.png",revision:"1094000695a36403f4fdd87de9ab6631"},{url:"/android-chrome-384x384.png",revision:"1c290104e4c6bf8602214a2525e2a2c1"},{url:"/android-chrome-512x512.png",revision:"7956dbcfb9aacdee297e1bca58ba1901"},{url:"/apple-touch-icon.png",revision:"ae1c9fa7e5d2a3e9ccc94d5980d64191"},{url:"/assets/images/hero.jpg",revision:"ac1980883889e4c4d104c448162292d3"},{url:"/assets/images/loading.gif",revision:"684e7d1f6fb11af1049b23ddaa9425f5"},{url:"/assets/moves/categories/Physical.png",revision:"bc291652c7271be785db0675de096f75"},{url:"/assets/moves/categories/Special.png",revision:"af38ba94c8c9c8e3250a5f67bcc6add0"},{url:"/assets/moves/categories/Status.png",revision:"d1eca3884856f94aafe6492d058aa630"},{url:"/assets/sprites/pokemonicons-sheet.png",revision:"745e7371fed44c1d3362783a3fbb15e5"},{url:"/assets/types/Bug.webp",revision:"791edec593af062bf54e8b41f4e728b9"},{url:"/assets/types/Dark.webp",revision:"dd598ff5b71378a4ac85648a2a5597ff"},{url:"/assets/types/Dragon.webp",revision:"61eb32085f0c6ce24d79898b65da4dc9"},{url:"/assets/types/Electric.webp",revision:"46acf6b1d888d408a1caf8e9685cd845"},{url:"/assets/types/Fairy.webp",revision:"fd346478122ec94a495f7e8afad1699e"},{url:"/assets/types/Fighting.webp",revision:"0588b8bf725c594077c5b79a8e08a6ae"},{url:"/assets/types/Fire.webp",revision:"f15f9b0ff77819fa7b56ca8a5f65945e"},{url:"/assets/types/Flying.webp",revision:"bed18ffc4eee8c09c758bcdec2f372ef"},{url:"/assets/types/Ghost.webp",revision:"57a615196028c64ad854fc16c2f979e7"},{url:"/assets/types/Grass.webp",revision:"259b2df6648239bcacd16acda37805e9"},{url:"/assets/types/Ground.webp",revision:"9e2b2d1d93a5123970ad6e5e5dfccb48"},{url:"/assets/types/Ice.webp",revision:"177a2c71eb2f31c5b4e5a5787020a585"},{url:"/assets/types/Normal.webp",revision:"12252dd8fc2b0f3c46a4c8b37ebcafd9"},{url:"/assets/types/Poison.webp",revision:"1fb0710a91f14b1da5798deefeef90ed"},{url:"/assets/types/Psychic.webp",revision:"855033719b81d7fec146ad95a97f5260"},{url:"/assets/types/Rock.webp",revision:"6d63d4e60bc78b1e25035a1925b8981b"},{url:"/assets/types/Steel.webp",revision:"1b0d1649ba94066898c16c1bdce5dab9"},{url:"/assets/types/Water.webp",revision:"df770a5e1c05b769335f1bdd77e2f59c"},{url:"/favicon-16x16.png",revision:"ca91a9984f6edd1ecc2b5d413217d9f8"},{url:"/favicon-32x32.png",revision:"9d6d755062dfd2c0dbeae8f2ef24c843"},{url:"/favicon.ico",revision:"4dbe829e299bf1f6285b4078f84c1b15"},{url:"/locales/en/common.json",revision:"054f42d66e7213c7ec507683b981b419"},{url:"/locales/en/create.json",revision:"31e224d907adc7a11fa8c7e084781a45"},{url:"/locales/en/home.json",revision:"73a013426b00ed3367a55037688f44f5"},{url:"/locales/zh-Hans/common.json",revision:"a070388e5e486b521be31e14a51777d3"},{url:"/locales/zh-Hans/create.json",revision:"17c9dd3240c042c4d3dd8f81dbfb4bb6"},{url:"/locales/zh-Hans/home.json",revision:"3c1692d0e9365590c931f62ecfdcf009"},{url:"/manifest.json",revision:"414330f5bc1b91b8106cc44bb6091567"},{url:"/robots.txt",revision:"126407814a7a6cad45d3bcfb46090e0e"},{url:"/safari-pinned-tab.svg",revision:"3733b9e8fc0e0fb08480d65d84b2cf7a"},{url:"/sitemap-0.xml",revision:"9f9570b794ca8f9e787f8c8c25f67ea8"},{url:"/sitemap.xml",revision:"53a103a1e4ed1c01fb8de749cd86ca3f"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
