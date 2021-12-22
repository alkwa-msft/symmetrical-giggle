import { FASTElement, customElement, attr, html, css } from '@microsoft/fast-element';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallClient, DeviceManager } from '@azure/communication-calling';
import { DI, Registration, Container } from '@microsoft/fast-foundation';

export const ACSUnresolvedDeviceManager = DI.createInterface<Promise<DeviceManager>>();

export const ACSDeviceManager = DI.createInterface<Promise<DeviceManager> | DeviceManager>();

const template = html<ACSCallingProvider>`
<div>
  <div class="body">
  <slot></slot>
  </div>
</div>
`;

const styles = css`
  .body {
    background: #0080FF;
    width: 100%;
    height: 100%;
  }
`;

@customElement({name: 'acs-calling-provider', template, styles})
export class ACSCallingProvider extends FASTElement {
    constructor() {
        super();
    }

  @attr communicationUserId: string = 'Hello';
  @attr accessToken: string = 'Token';

  private _tokenCredential: AzureCommunicationTokenCredential;
  private _callClient: CallClient;
  private _unresolvedDeviceManager:  Promise<DeviceManager>;
  private _deviceManager:  DeviceManager;
  private _container: Container;

  async connectedCallback() {
    super.connectedCallback();
    console.log('acs-calling-provider is now connected to the DOM');
    this._tokenCredential = new AzureCommunicationTokenCredential(this.accessToken);
    this._callClient = new CallClient();

    this._container = DI.getOrCreateDOMContainer();

    this._unresolvedDeviceManager = this._callClient.getDeviceManager();

    this._container.register(Registration.callback(ACSUnresolvedDeviceManager, () => this._unresolvedDeviceManager));

    console.log('registered promises');

    this._deviceManager = await this._callClient.getDeviceManager();

    this._container.register(Registration.callback(ACSDeviceManager, () => this._deviceManager));

    console.log('registered resolved objects');

    this._container.register(Registration.instance(ACSDeviceManager, () => this._deviceManager));

    console.log('initialized device manager '+this._deviceManager);
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
  }
}
