export interface VidyoLocalCamera {
    id: string;
    name: string;
    AllowRemoteCameraControl(options: { allow: boolean }): Promise<boolean>;
    GetBacklightCompensation(): Promise<boolean>;
    GetFramerateTradeOffProfile(): Promise<any>;
    GetPreviewLabel(): Promise<string>;
    GetResolutionTradeOffProfile(): Promise<any>;
    IsControlDigital(): Promise<boolean>;
    IsSuspended(): Promise<boolean>;
    SetAspectRatioConstraint(options: { aspectRatioWidth: number, aspectRatioHeight: number }): Promise<boolean>;
    SetBacklightCompensation(options: { backlightCompensation: boolean }): Promise<boolean>;
    SetControlDigital(options: { digital: boolean }): Promise<boolean>;
    SetFramerateTradeOffProfile(options: { profile: string }): Promise<boolean>;
    SetMaxBitRate(options: { bitRate: number }): Promise<void>;
    SetMaxConstraint(options: { width: number, height: number, frameInterval: number }): Promise<boolean>;
    SetNudgeTimes(options: { panTime: number, tiltTime: number, zoomTime: number }): Promise<boolean>;
    SetPreviewLabel(options: { label: string }): Promise<boolean>;
    SetResolutionTradeOffProfile(options: { profile: string }): Promise<boolean>;
    ControlPTZ(options: { pan: number, tilt: number, zoom: number }): boolean;
    GetId(): string;
    GetName(): string;
    GetPosition(): any;
    ShowCameraControl(options: { show: boolean }): boolean;
}

export interface VidyoRemoteCamera {
    id: string;
    name: string;
    IsControllable(): boolean;
    ControlPTZ(options: { pan: number, tilt: number, zoom: number }): boolean;
    GetId(): string;
    GetName(): string;
    GetPosition(): any;
    ShowCameraControl(options: { show: boolean }): boolean;
}

export interface VidyoParticipant {
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

export interface VidyoLocalMicrophone {
    id: string;
    name: string;
    PlayTone(options: { dtmfTone: any });
    SetVolume(options: { volumePercent: any });
    ShowDebugDialog();
    GetId(): string;
    GetName(): string;
    GetSignalType(): any;
    SetSignalType(options: { signalType: string }): Promise<boolean>;
}

export interface VidyoLocalSpeaker {
    id: string;
    name: string;
    GetId(): string;
    GetName(): string;
}

export interface CameraEvent {
    eventType: CameraEventType;
    camera: VidyoLocalCamera | VidyoRemoteCamera;
    cameraType: CameraType;
    state?: any;
    participant?: VidyoParticipant;
}

export type CameraEventType = 'added' | 'removed' | 'selected' | 'statechanged';
export type CameraType = 'local' | 'remote';

export interface MicrophoneEvent {
    type: MicrophoneEventType;
    microphone: VidyoLocalMicrophone;
}

export type MicrophoneEventType = 'added' | 'removed' | 'selected' | 'statechanged';

export interface SpeakerEvent {
    type: SpeakerEventType;
    speaker: VidyoLocalSpeaker;
}

export type SpeakerEventType = 'added' | 'removed' | 'selected' | 'statechanged';

export interface VidyoLocalWindowShare {
    id: string;
    name: string;
    GetId(): string;
    GetName(): string;
}

export interface WindowShareEvent {
    type: WindowShareEventType;
    windowShare: VidyoLocalWindowShare;
}

export type WindowShareEventType = 'added' | 'removed' | 'selected' | 'statechanged';

export type ParticipantEventType = 'joined' | 'left' | 'dynamicchanged' | 'loudestchanged';

export interface ParticipantEvent {
    type: ParticipantEventType;
    participant: VidyoParticipant;
    audioOnly?: boolean;
    dynamicParticipants?: VidyoParticipant[];
    dynamicRemoteCameras?: VidyoRemoteCamera[];
}
