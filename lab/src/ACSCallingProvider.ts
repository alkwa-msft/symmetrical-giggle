import { FASTElement, customElement, attr } from '@microsoft/fast-element';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallClient, CallAgent, DeviceManager } from '@azure/communication-calling';
@customElement('acs-calling-provider')
export class ACSCallingProvider extends FASTElement {
    constructor() {
        super();
    }

  @attr communicationUserId: string = 'Hello';
  @attr accessToken: string = 'Token';

  private _tokenCredential: AzureCommunicationTokenCredential;
  private _callClient: CallClient;
  private _callAgent: CallAgent;
  private _deviceManager: DeviceManager;

  // update() {
  //   console.log('updated called')
  //   this.shadowRoot!.innerHTML = `${this.communicationUserId} ${this.accessToken}`;
  // }

  async connectedCallback() {
    super.connectedCallback();
    console.log('acs-calling-provider is now connected to the DOM');
    // this.update();
    this._tokenCredential = new AzureCommunicationTokenCredential(this.accessToken);
    this._callClient = new CallClient();
    this._callAgent = await this._callClient.createCallAgent(this._tokenCredential);
    this._deviceManager = await this._callClient.getDeviceManager();

    if (this._callAgent) {
      console.log('call agent initialized')
    }
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    if (this._callAgent) {
      console.log('call agent existed and I am disposing it now');
      await this._callAgent.dispose();
    }
  }
}
