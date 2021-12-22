import { FASTElement, customElement, html, css, attr } from '@microsoft/fast-element';
import { DeviceManager } from '@azure/communication-calling';
import { ACSDeviceManager, ACSUnresolvedDeviceManager } from './ACSCallingProvider';
import { inject } from '@microsoft/fast-foundation';

const template = html<ACSMicrophoneSetting>`
<div>
  <div class="body">
  <slot></slot>
  <div>${x => x.selectedMicrophoneName}</div>
  </div>
</div>
`;

const styles = css`
  .body {
    background: lime;
    width: 90%;
    height: 100%;
  }
`;

@customElement({name: 'acs-microphone-setting', template, styles})
export class ACSMicrophoneSetting extends FASTElement {
    constructor() {
        super();
    }

  @attr deviceManager: DeviceManager;
  @attr selectedMicrophoneName: string;
  @inject(ACSDeviceManager) resolvedDeviceManager:DeviceManager;

  // we can't automatically be notified when the device manager is ready so we set it in our getter function
  get<DeviceManager>() {
    this.deviceManager = this.resolvedDeviceManager;
    return this.deviceManager;
  }

  async deviceManagerChanged() {
    this.selectedMicrophoneName = this.deviceManager.selectedMicrophone.name;
    // this.shadowRoot!.innerHTML = this.deviceManager.selectedMicrophone.name;
    console.log('deviceManager changed')
  }

  async connectedCallback() {
    super.connectedCallback();
    console.log('acs-microphone-setting is now connected to the DOM');
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
  }
}
