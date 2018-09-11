export interface LocalCamera {
    id: string;
    name: string;
    AllowRemoteCameraControl(allow: boolean): Promise<boolean>;
    GetBacklightCompensation(): Promise<boolean>;
    GetFramerateTradeOffProfile(): Promise<any>;
    GetPreviewLabel(): Promise<string>;
    GetResolutionTradeOffProfile(): Promise<any>;
    IsControlDigital(): Promise<boolean>;
    IsSuspended(): Promise<boolean>;
    SetAspectRatioConstraint(aspectRatioWidth: number, aspectRatioHeight: number): Promise<boolean>;
    SetBacklightCompensation(backlightCompensation: boolean): Promise<boolean>;
    SetControlDigital(digital: boolean): Promise<boolean>;
    SetFramerateTradeOffProfile(profile: string): Promise<boolean>;
    SetMaxBitRate(bitRate: number): Promise<void>;
    SetMaxConstraint(width: number, height: number, frameInterval: number): Promise<boolean>;
    SetNudgeTimes(panTime: number, tiltTime: number, zoomTime: number): Promise<boolean>;
    SetPreviewLabel(label: string): Promise<boolean>;
    SetResolutionTradeOffProfile(profile: string): Promise<boolean>;
    ControlPTZ(pan: number, tilt: number, zoom: number): boolean;
    GetId(): string;
    GetName(): string;
    GetPosition(): any;
    ShowCameraControl(show: boolean): boolean;
}

export interface RemoteCamera {
    id: string;
    name: string;
    IsControllable(): boolean;
    ControlPTZ(pan: number, tilt: number, zoom: number): boolean;
    GetId(): string;
    GetName(): string;
    GetPosition(): any;
    ShowCameraControl(show: boolean): boolean;
}

export interface Participant {
    id: string;
    name: string;
    userId: string;
    GetId(): string;
    GetName(): string;
    GetUserId(): string;
    IsHidden(): boolean;
    IsRecording(): boolean;
    IsSelectable(): boolean;
}

export interface LocalMicrophone {
    id: string;
    name: string;
    PlayTone(dtmfTone: any);
    SetVolume(volumePercent: any);
    ShowDebugDialog();
    GetId(): string;
    GetName(): string;
    GetSignalType(): any;
    SetSignalType(signalType: string): Promise<boolean>;
}

export interface LocalSpeaker {
    id: string;
    name: string;
    GetId(): string;
    GetName(): string;
}

export interface CameraEvent {
    eventType: CameraEventType;
    camera: LocalCamera | RemoteCamera;
    cameraType: CameraType;
    state?: any;
    participant?: Participant;
}

export type CameraEventType = 'added' | 'removed' | 'selected' | 'statechanged';
export type CameraType = 'local' | 'remote';

export interface MicrophoneEvent {
    type: MicrophoneEventType;
    microphone: LocalMicrophone;
}

export type MicrophoneEventType = 'added' | 'removed' | 'selected' | 'statechanged';

export interface SpeakerEvent {
    type: SpeakerEventType;
    speaker: LocalSpeaker;
}

export type SpeakerEventType = 'added' | 'removed' | 'selected' | 'statechanged';

export interface WindowShareEvent {
    type: WindowShareEventType;
    windowShare: any;
}

export type WindowShareEventType = 'added' | 'removed' | 'selected' | 'statechanged';

export type ParticipantEventType = 'joined' | 'left' | 'dynamicchanged' | 'loudestchanged';

export interface ParticipantEvent {
    type: ParticipantEventType;
    participant: Participant;
    audioOnly?: boolean;
    dynamicParticipants?: Participant[];
    dynamicRemoteCameras?: RemoteCamera[];
}
