import { FASTElement, customElement, html, css, attr, repeat, when } from '@microsoft/fast-element';
import {
  provideFASTDesignSystem,
  fastSelect,
  fastOption,
} from "@microsoft/fast-components";

import { DeviceManager } from '@azure/communication-calling';
import { ACSDeviceManager, ACSUnresolvedDeviceManager } from './ACSCallingProvider';
import { inject } from '@microsoft/fast-foundation';
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling'

provideFASTDesignSystem().register(fastSelect(), fastOption());

// const speakerAudioListItemTemplate = html<AudioDeviceInfo>`
//   <fast-option selected=${(x, c) => x.id === c.parent.selectedSpeaker.id} value=${x => x.id}>${x => x.name} ${x => x.isSystemDefault ? '(Default)' : ''}<fast-option>
// `;

const speakerAudioListItemTemplate = html<AudioDeviceInfo>`
  <fast-option selected=${(x, c) => x.id === c.parent.deviceManager.selectedSpeaker?.id}>${x => x.name} ${x => x.isSystemDefault ? '(Default)' : ''}<fast-option>
`;

const microphoneAudioListItemTemplate = html<AudioDeviceInfo>`
  <fast-option value=${(x, c) => x.id === c.parent.deviceManager.selectedMicrophone?.id}>${x => x.name} ${x => x.isSystemDefault ? '(Default)' : ''}<fast-option>
`;

const cameraVideoListItemTemplate = html<VideoDeviceInfo>`
  <fast-option value=${(x, c) => x.id === c.parent.selectedCamera?.id}>${x => x.deviceType} ${x => x.id} ${x => x.name}<fast-option>
`;

const microphonesDropdownTemplate = html<ACSMicrophoneSetting>`
  <fast-select id="microphoneList">
    ${repeat(x => x.microphones, microphoneAudioListItemTemplate)}
  </fast-select>
`;

const speakersDropdownTemplate = html<ACSMicrophoneSetting>`
  <fast-select id="speakerList">
    ${repeat(x => x.speakers, speakerAudioListItemTemplate)}
  </fast-select>
`;

const camerasDropdownTemplate = html<ACSMicrophoneSetting>`
  <fast-select id="cameraList">
    ${repeat(x => x.cameras, cameraVideoListItemTemplate)}
  </fast-select>
`;


const template = html<ACSMicrophoneSetting>`
<div>
  <div class="body">
    ${when(x => x, microphonesDropdownTemplate)}
    ${when(x => x, speakersDropdownTemplate)}
    ${when(x => x, camerasDropdownTemplate)}
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
  @attr cameras: VideoDeviceInfo[];
  @attr speakers: AudioDeviceInfo[];
  @attr microphones: AudioDeviceInfo[];
  @attr selectedCamera: VideoDeviceInfo[];
  @inject(ACSDeviceManager) resolvedDeviceManager:DeviceManager;

  // we can't automatically be notified when the device manager is ready so we set it in our getter function
  async get<DeviceManager>() {
    this.deviceManager = this.resolvedDeviceManager;
    this.speakers = await this.deviceManager.getSpeakers();
    this.microphones = await this.deviceManager.getMicrophones();
    this.cameras = await this.deviceManager.getCameras();

    return this.deviceManager;
  }

  async deviceManagerChanged() {
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
