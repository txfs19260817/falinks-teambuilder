# Pastes

| Name            | Description                                                                  | Data Fetching Method | Collection Name Defined In | 
|:----------------|:-----------------------------------------------------------------------------| :------------------- |:-----------------------------------------|
| VGC Pastes      | Pastes of VGC teams collected by [VGCPastes](https://twitter.com/VGCPastes)  | [Static Generation](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) | `AppConfig.collectionName.vgcPastes`     |
| Public Pastes   | Pastes of teams publicly published by users                                  | [Server-side Rendering](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) | `AppConfig.collectionName.publicPastes`  |
| Private Pastes  | Pastes of teams privately shared by users                                    | [Client-side Rendering](https://nextjs.org/docs/basic-features/data-fetching/client-side) | `AppConfig.collectionName.privatePastes` |

