export type ClientState = 'READY' | 'RETRYING' | 'FAILED' | 'FAILEDVERSION' | 'NOTAVAILABLE';
export type DownloadType = 'MOBILE' | 'PLUGIN' | 'APP';
export type ViewStyle = 'VIDYO_CONNECTORVIEWSTYLE_Default' | 'VIDYO_CONNECTORVIEWSTYLE_Tiles';

export interface VidyoClientState {
    state: ClientState;
    description: string;
    downloadType: DownloadType;   // Available download types with possible values of "MOBILE" "PLUGIN" "APP"
    downloadPathApp: string; // Path to the application installer for the app which could be invoked with a protocol handler
    downloadPathPlugIn: string; // Path to the Plugin that can be installed
    downloadPathWebRTCExtensionChrome?: string; // Path to the optional Chrome extension required for Screen Sharing in WebRTC
    downloadPathWebRTCExtensionFirefox?: string; // Path to the optional Firefox extension required for Screen Sharing in WebRTC
    webrtcExtensionPath?: string; // composite path depending on browser
    webrtc?: boolean;
}

export interface VidyoConnector {
    AssignViewToCompositeRenderer(viewId: string, viewStyle: ViewStyle, remoteParticipants: number): Promise<boolean>;
    AssignViewToLocalCamera(viewId: string, localCamera: LocalCamera, displayCropped: boolean, allowZoom: boolean): Promise<boolean>;
    AssignViewToRemoteCamera(viewId: string, remoteCamera: RemoteCamera, displayCropped: boolean, allowZoom: boolean): Promise<boolean>;
    AssignViewToRemoteWindowShare(viewId: string, remoteWindowShare: any, displayCropped: boolean, allowZoom: boolean): Promise<boolean>;
    Connect(host: string, token: string, displayName: string, resourceId: string, onSuccess?: () => void, onFailure?: (reason) => void,
            onDisconnected?: (reason) => void): Promise<boolean>;
    CycleCamera(): Promise<boolean>;
    CycleMicrophone(): Promise<boolean>;
    CycleSpeaker(): Promise<boolean>;
    Disable(): Promise<void>;
    DisableDebug(): Promise<void>;
    Disconnect(): void;
    EnableDebug(port: number, logFilter: string): Promise<boolean>;
    GetCpuTradeOffProfile(): Promise<any>;
    GetState(): Promise<any>;
    GetStatsJson(): Promise<string>;
    GetVersion(): Promise<string>;
    GetVersionWithoutBuildNumber(): Promise<string | null>;
    HideView(viewId: string): Promise<boolean>;
    RegisterLocalCameraEventListener(onAdded?: (localCamera: LocalCamera) => void, onRemoved?: (localCamera: LocalCamera) => void,
        onSelected?: (localCamera: LocalCamera) => void, onStateUpdated?: (localCamera: LocalCamera, state) => void): Promise<boolean>;
    RegisterLocalCameraFrameListener(onFrame, localCamera, width, height, frameInterval): Promise<boolean>;
    RegisterLocalMicrophoneEventListener(onAdded?: (localWindowShare) => void, onRemoved?: (localWindowShare) => void,
        onSelected?: (localWindowShare) => void, onStateUpdated?: (localWindowShare) => void): Promise<boolean>;
    RegisterLocalMicrophoneFrameListener(onFrame, localMicrophone): Promise<boolean>;
    RegisterLocalMonitorEventListener(onAdded, onRemoved, onSelected, onStateUpdated): Promise<boolean>;
    RegisterLocalMonitorFrameListener(onFrame, localMonitor, width, height, frameInterval): Promise<boolean>;
    RegisterLocalWindowShareEventListener(onAdded?: (localWindowShare) => void, onRemoved?: (localWindowShare) => void,
        onSelected?: (localWindowShare) => void, onStateUpdated?: (localWindowShare) => void): Promise<boolean>;
    RegisterLocalWindowShareFrameListener(onFrame, localWindowShare, width, height, frameInterval): Promise<boolean>;
    RegisterLogEventListener(onLog, filter): Promise<boolean>;
    RegisterMessageEventListener(onChatMessageReceived): Promise<boolean>;
    RegisterNetworkInterfaceEventListener(onAdded, onRemoved, onSelected, onStateUpdated): Promise<boolean>;
    RegisterLocalSpeakerEventListener(onAdded?: (device) => void, onRemoved?: (device) => void, onSelected?: (device) => void,
        onStateUpdated?: (device) => void): Promise<boolean>;
    RegisterParticipantEventListener(onJoined?: (participant) => void, onLeft?: (participant) => void,
        onDynamicChanged?: (participants, remoteCameras) => void, onLoudestChanged?: (participant, audioOnly) => void): Promise<boolean>;
    RegisterRecorderInCallEventListener(onRecorderInCallChanged): Promise<boolean>;
    RegisterRemoteCameraEventListener(onAdded?: (remoteCamera: RemoteCamera, participant: Participant) => void,
            onRemoved?: (remoteCamera: RemoteCamera, participant: Participant) => void, onStateUpdated?: (remoteCamera: RemoteCamera,
            participant: Participant, state: any) => void): Promise<boolean>;
    RegisterRemoteCameraFrameListener(onFrame, remoteCamera, width, height, frameInterval): Promise<boolean>;
    RegisterRemoteMicrophoneEventListener(onAdded, onRemoved, onStateUpdated): Promise<boolean>;
    RegisterRemoteWindowShareEventListener(onAdded, onRemoved, onStateUpdated): Promise<boolean>;
    RegisterRemoteWindowShareFrameListener(onFrame, remoteWindowShare, width, height, frameInterval): Promise<boolean>;
    RegisterResourceManagerEventListener(onAvailableResourcesChanged, onMaxRemoteSourcesChanged): Promise<boolean>;
    RegisterWebProxyEventListener(onWebProxyCredentialsRequest): Promise<boolean>;
    SelectAudioContentShare(localMicrophone): Promise<boolean>;
    SelectDefaultCamera(): Promise<boolean>;
    SelectDefaultMicrophone(): Promise<boolean>;
    SelectDefaultNetworkInterfaceForMedia(): Promise<boolean>;
    SelectDefaultNetworkInterfaceForSignaling(): Promise<boolean>;
    SelectDefaultSpeaker(): Promise<boolean>;
    SelectLocalCamera(localCamera: any): Promise<boolean>;
    SelectLocalMicrophone(localMicrophone: any): Promise<boolean>;
    SelectLocalMonitor(localMonitor): Promise<boolean>;
    SelectLocalSpeaker(localSpeaker: any): Promise<boolean>;
    SelectLocalWindowShare(localWindowShare: any): Promise<boolean>;
    SelectNetworkInterfaceForMedia(networkInterface): Promise<boolean>;
    SelectNetworkInterfaceForSignaling(networkInterface): Promise<boolean>;
    SelectVideoContentShare(localCamera): Promise<boolean>;
    SendChatMessage(message: string): Promise<boolean>;
    SetAdvancedOptions(options): Promise<boolean>;
    SetCameraPrivacy(privacy: boolean): Promise<boolean>;
    SetCertificateAuthorityList(certificateAuthorityList): Promise<boolean>;
    SetCpuTradeOffProfile(profile): Promise<boolean>;
    SetLocation(latitude, longitude): Promise<boolean>;
    SetMicrophonePrivacy(privacy: boolean): Promise<boolean>;
    SetMode(mode): Promise<boolean>;
    SetSpeakerPrivacy(privacy: boolean): Promise<boolean>;
    SetViewAnimationSpeed(viewId, speedPercentage): Promise<boolean>;
    SetViewBackgroundColor(viewId, red, green, blue): Promise<boolean>;
    SetWebProxyAddressCredentials(proxyAddress, username, password): Promise<boolean>;
    ShowAudioMeters(viewId: string, showMeters: boolean): Promise<boolean>;
    ShowPreview(preview): Promise<boolean>;
    ShowViewAt(elementId: string, offsetLeft: number, offsetTop: number, offsetWidth: number, offsetHeight: number): Promise<boolean>;
    ShowViewLabel(viewId: string, showLabel: boolean): Promise<boolean>;
    UnregisterLocalCameraEventListener(): Promise<boolean>;
    UnregisterLocalCameraFrameListener(localCamera): Promise<boolean>;
    UnregisterLocalMicrophoneEventListener(): Promise<boolean>;
    UnregisterLocalMicrophoneFrameListener(localMicrophone): Promise<boolean>;
    UnregisterLocalMonitorEventListener(): Promise<boolean>;
    UnregisterLocalMonitorFrameListener(localMonitor): Promise<boolean>;
    UnregisterLocalSpeakerEventListener(): Promise<boolean>;
    UnregisterLocalWindowShareEventListener(): Promise<boolean>;
    UnregisterLocalWindowShareFrameListener(localWindowShare): Promise<boolean>;
    UnregisterLogEventListener(): Promise<boolean>;
    UnregisterMessageEventListener(): Promise<boolean>;
    UnregisterNetworkInterfaceEventListener(): Promise<boolean>;
    UnregisterParticipantEventListener(): Promise<boolean>;
    UnregisterRecorderInCallEventListener(): Promise<boolean>;
    UnregisterRemoteCameraEventListener(): Promise<boolean>;
    UnregisterRemoteCameraFrameListener(remoteCamera): Promise<boolean>;
    UnregisterRemoteMicrophoneEventListener(): Promise<boolean>;
    UnregisterRemoteMicrophoneFrameListener(remoteMicrophone): Promise<boolean>;
    UnregisterRemoteWindowShareEventListener(): Promise<boolean>;
    UnregisterRemoteWindowShareFrameListener(remoteWindowShare): Promise<boolean>;
    UnregisterResourceManagerEventListener(): Promise<boolean>;
    UnregisterWebProxyEventListener(): Promise<boolean>;
}

export interface VidyoClientInterface {
    CreateVidyoConnector(options: {
        viewId: string | null,
        viewStyle: ViewStyle,
        remoteParticipants: number,
        logFileFilter: string,
        logFileName: string,
        userData: number
    }): Promise<VidyoConnector | any>;
}

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

export interface ScriptModel {
    name: string;
    src: string;
    loaded: boolean;
}
