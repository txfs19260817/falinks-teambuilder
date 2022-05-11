import { WebrtcProvider } from 'y-webrtc';
import { AbstractType, Doc } from 'yjs';

let instance: WebrtcProviders;

class WebrtcProviders {
  private providers: Map<string, WebrtcProvider>;

  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!');
    }
    this.providers = new Map();
    instance = this;
  }

  public getProvider(roomName: string): WebrtcProvider | undefined {
    return this.providers.get(roomName);
  }

  public setProvider(roomName: string, doc: Doc | AbstractType<any>): void {
    if (this.providers.has(roomName)) {
      throw new Error(`Room '${roomName}' 's provider already exists!`);
    }
    this.providers.set(roomName, new WebrtcProvider(roomName, doc as any));
  }

  public getOrCreateProvider(roomName: string, doc?: Doc | AbstractType<any>): WebrtcProvider {
    if (!this.providers.has(roomName)) {
      if (!doc) {
        throw new Error(`No room '${roomName}' found so you need to pass a doc`);
      }
      this.providers.set(roomName, new WebrtcProvider(roomName, doc as any));
    }
    return this.providers.get(roomName)!;
  }

  public connectByRoomName(roomName: string): void {
    const provider = this.providers.get(roomName);
    if (!provider) {
      throw new Error(`No room '${roomName}' found, please create the WebrtcProvider first`);
    }
    provider.connect();
  }

  // eslint-disable-next-line class-methods-use-this
  public connectByProvider(provider: WebrtcProvider): void {
    provider.connect();
  }

  public disconnectByRoomName(roomName: string): void {
    const provider = this.providers.get(roomName);
    if (!provider) {
      throw new Error(`No room '${roomName}' found, please create the WebrtcProvider first`);
    }
    provider.disconnect();
  }

  // eslint-disable-next-line class-methods-use-this
  public disconnectByProvider(provider: WebrtcProvider): void {
    provider.disconnect();
  }

  public deleteProvider(roomName: string): void {
    this.providers.delete(roomName);
  }
}

const singletonWebrtcProviders = Object.freeze(new WebrtcProviders());
export default singletonWebrtcProviders;
