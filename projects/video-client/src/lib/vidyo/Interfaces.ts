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
    AssignViewToCompositeRenderer(options: { viewId: string, viewStyle: ViewStyle, remoteParticipants: number }): Promise<boolean>;
    AssignViewToLocalCamera(options: { viewId: string, localCamera: VidyoLocalCamera, displayCropped: boolean, allowZoom: boolean })
        : Promise<boolean>;
    AssignViewToRemoteCamera(options: { viewId: string, remoteCamera: VidyoRemoteCamera, displayCropped: boolean, allowZoom: boolean })
        : Promise<boolean>;
    AssignViewToRemoteWindowShare(options: { viewId: string, remoteWindowShare: any, displayCropped: boolean, allowZoom: boolean })
        : Promise<boolean>;
    Connect(options: {
        host: string, token: string, displayName: string, resourceId: string, onSuccess?: () => void,
        onFailure?: (reason) => void, onDisconnected?: (reason) => void
    }): Promise<boolean>;
    CycleCamera(): Promise<boolean>;
    CycleMicrophone(): Promise<boolean>;
    CycleSpeaker(): Promise<boolean>;
    Disable(): Promise<void>;
    DisableDebug(): Promise<void>;
    Disconnect(): void;
    EnableDebug(options: { port: number, logFilter: string }): Promise<boolean>;
    GetCpuTradeOffProfile(): Promise<any>;
    GetState(): Promise<any>;
    GetStatsJson(): Promise<string>;
    GetVersion(): Promise<string>;
    GetVersionWithoutBuildNumber(): Promise<string | null>;
    HideView(options: { viewId: string }): Promise<boolean>;
    RegisterLocalCameraEventListener(options: {
        onAdded?: (localCamera: VidyoLocalCamera) => void,
        onRemoved?: (localCamera: VidyoLocalCamera) => void, onSelected?: (localCamera: VidyoLocalCamera) => void,
        onStateUpdated?: (localCamera: VidyoLocalCamera, state) => void
    }): Promise<boolean>;
    RegisterLocalCameraFrameListener(options: { onFrame, localCamera, width, height, frameInterval }): Promise<boolean>;
    RegisterLocalMicrophoneEventListener(options: {
        onAdded?: (localWindowShare) => void, onRemoved?: (localWindowShare) => void,
        onSelected?: (localWindowShare) => void, onStateUpdated?: (localWindowShare) => void
    }): Promise<boolean>;
    RegisterLocalMicrophoneFrameListener(options: { onFrame, localMicrophone }): Promise<boolean>;
    RegisterLocalMonitorEventListener(options: { onAdded, onRemoved, onSelected, onStateUpdated }): Promise<boolean>;
    RegisterLocalMonitorFrameListener(options: { onFrame, localMonitor, width, height, frameInterval }): Promise<boolean>;
    RegisterLocalWindowShareEventListener(options: {
        onAdded?: (localWindowShare) => void, onRemoved?: (localWindowShare) => void,
        onSelected?: (localWindowShare) => void, onStateUpdated?: (localWindowShare) => void
    }): Promise<boolean>;
    RegisterLocalWindowShareFrameListener(options: { onFrame, localWindowShare, width, height, frameInterval }): Promise<boolean>;
    RegisterLogEventListener(options: { onLog, filter }): Promise<boolean>;
    RegisterMessageEventListener(options: { onChatMessageReceived }): Promise<boolean>;
    RegisterNetworkInterfaceEventListener(options: { onAdded, onRemoved, onSelected, onStateUpdated }): Promise<boolean>;
    RegisterLocalSpeakerEventListener(options: {
        onAdded?: (device) => void, onRemoved?: (device) => void, onSelected?: (device) => void,
        onStateUpdated?: (device) => void
    }): Promise<boolean>;
    RegisterParticipantEventListener(options: {
        onJoined?: (participant) => void, onLeft?: (participant) => void,
        onDynamicChanged?: (participants, remoteCameras) => void, onLoudestChanged?: (participant, audioOnly) => void
    }): Promise<boolean>;
    RegisterRecorderInCallEventListener(options: { onRecorderInCallChanged }): Promise<boolean>;
    RegisterRemoteCameraEventListener(options: {
        onAdded?: (remoteCamera: VidyoRemoteCamera, participant: VidyoParticipant) => void,
        onRemoved?: (remoteCamera: VidyoRemoteCamera, participant: VidyoParticipant) => void,
        onStateUpdated?: (remoteCamera: VidyoRemoteCamera, participant: VidyoParticipant, state: any) => void
    }): Promise<boolean>;
    RegisterRemoteCameraFrameListener(options: { onFrame, remoteCamera, width, height, frameInterval }): Promise<boolean>;
    RegisterRemoteMicrophoneEventListener(options: { onAdded, onRemoved, onStateUpdated }): Promise<boolean>;
    RegisterRemoteWindowShareEventListener(options: { onAdded, onRemoved, onStateUpdated }): Promise<boolean>;
    RegisterRemoteWindowShareFrameListener(options: { onFrame, remoteWindowShare, width, height, frameInterval }): Promise<boolean>;
    RegisterResourceManagerEventListener(options: { onAvailableResourcesChanged, onMaxRemoteSourcesChanged }): Promise<boolean>;
    RegisterWebProxyEventListener(options: { onWebProxyCredentialsRequest }): Promise<boolean>;
    SelectAudioContentShare(options: { localMicrophone }): Promise<boolean>;
    SelectDefaultCamera(): Promise<boolean>;
    SelectDefaultMicrophone(): Promise<boolean>;
    SelectDefaultNetworkInterfaceForMedia(): Promise<boolean>;
    SelectDefaultNetworkInterfaceForSignaling(): Promise<boolean>;
    SelectDefaultSpeaker(): Promise<boolean>;
    SelectLocalCamera(options: { localCamera: any }): Promise<boolean>;
    SelectLocalMicrophone(options: { localMicrophone: any }): Promise<boolean>;
    SelectLocalMonitor(options: { localMonitor }): Promise<boolean>;
    SelectLocalSpeaker(options: { localSpeaker: any }): Promise<boolean>;
    SelectLocalWindowShare(options: { localWindowShare: any }): Promise<boolean>;
    SelectNetworkInterfaceForMedia(options: { networkInterface }): Promise<boolean>;
    SelectNetworkInterfaceForSignaling(options: { networkInterface }): Promise<boolean>;
    SelectVideoContentShare(options: { localCamera }): Promise<boolean>;
    SendChatMessage(options: { message: string }): Promise<boolean>;
    SetAdvancedOptions(options: { options }): Promise<boolean>;
    SetCameraPrivacy(options: { privacy: boolean }): Promise<boolean>;
    SetCertificateAuthorityList(options: { certificateAuthorityList }): Promise<boolean>;
    SetCpuTradeOffProfile(options: { profile }): Promise<boolean>;
    SetLocation(options: { latitude, longitude }): Promise<boolean>;
    SetMicrophonePrivacy(options: { privacy: boolean }): Promise<boolean>;
    SetMode(options: { mode }): Promise<boolean>;
    SetSpeakerPrivacy(options: { privacy: boolean }): Promise<boolean>;
    SetViewAnimationSpeed(options: { viewId, speedPercentage }): Promise<boolean>;
    SetViewBackgroundColor(options: { viewId, red, green, blue }): Promise<boolean>;
    SetWebProxyAddressCredentials(options: { proxyAddress, username, password }): Promise<boolean>;
    ShowAudioMeters(options: { viewId: string, showMeters: boolean }): Promise<boolean>;
    ShowPreview(options: { preview }): Promise<boolean>;
    ShowViewAt(options: { elementId: string, offsetLeft: number, offsetTop: number, offsetWidth: number, offsetHeight: number })
        : Promise<boolean>;
    ShowViewLabel(options: { viewId: string, showLabel: boolean }): Promise<boolean>;
    UnregisterLocalCameraEventListener(): Promise<boolean>;
    UnregisterLocalCameraFrameListener(options: { localCamera }): Promise<boolean>;
    UnregisterLocalMicrophoneEventListener(): Promise<boolean>;
    UnregisterLocalMicrophoneFrameListener(options: { localMicrophone }): Promise<boolean>;
    UnregisterLocalMonitorEventListener(): Promise<boolean>;
    UnregisterLocalMonitorFrameListener(options: { localMonitor }): Promise<boolean>;
    UnregisterLocalSpeakerEventListener(): Promise<boolean>;
    UnregisterLocalWindowShareEventListener(): Promise<boolean>;
    UnregisterLocalWindowShareFrameListener(options: { localWindowShare }): Promise<boolean>;
    UnregisterLogEventListener(): Promise<boolean>;
    UnregisterMessageEventListener(): Promise<boolean>;
    UnregisterNetworkInterfaceEventListener(): Promise<boolean>;
    UnregisterParticipantEventListener(): Promise<boolean>;
    UnregisterRecorderInCallEventListener(): Promise<boolean>;
    UnregisterRemoteCameraEventListener(): Promise<boolean>;
    UnregisterRemoteCameraFrameListener(options: { remoteCamera }): Promise<boolean>;
    UnregisterRemoteMicrophoneEventListener(): Promise<boolean>;
    UnregisterRemoteMicrophoneFrameListener(options: { remoteMicrophone }): Promise<boolean>;
    UnregisterRemoteWindowShareEventListener(): Promise<boolean>;
    UnregisterRemoteWindowShareFrameListener(options: { remoteWindowShare }): Promise<boolean>;
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

export interface ScriptModel {
    name: string;
    src: string;
    loaded: boolean;
}
