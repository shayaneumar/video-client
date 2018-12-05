import { Injectable } from '@angular/core';
import {
    VidyoLocalCamera,
    VidyoRemoteCamera,
    CameraEvent,
    ParticipantEvent,
    MicrophoneEvent,
    SpeakerEvent,
    WindowShareEvent
} from './interfaces';
import * as Vidyo from './vidyo';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoClientService {
    private _cameraSubject = new Subject<CameraEvent>();
    private _participantSubject = new Subject<ParticipantEvent>();
    private _microphoneSubject = new Subject<MicrophoneEvent>();
    private _speakerSubject = new Subject<SpeakerEvent>();
    private _windowShareSubject = new Subject<WindowShareEvent>();
    private _joinSubject: Subject<boolean> = new Subject<boolean>();

    microphoneEnabled = false;
    cameraEnabled = false;

    vidyoConnector: Vidyo.VidyoConnector;
    vidyoClient: Vidyo.VidyoClient;

    eventHandler: VidyoEventHandler = {
        vidyoConnector: {
            onSuccess: () => {
                console.log('vidyo.joinRoom():success');
                this._joinSubject.next(true);
            },
            onFailure: reason => {
                console.error('vidyo.joinRoom():failure', reason);
                this._joinSubject.error(reason);
            },
            onDisconnected: reason => {
                console.warn('vidyo.joinRoom():disconnected', reason);
                this._joinSubject.next(false);
            }
        },
        remoteCamera: {
            onAdded: (remoteCamera: Vidyo.VidyoRemoteCamera, participant: any) => {
                console.log('video:registerRemoteCameraEvents.onAdded', remoteCamera);
                const cameraEvent: CameraEvent = {
                    eventType: 'added',
                    camera: remoteCamera,
                    cameraType: 'remote',
                    participant: participant
                };
                this._cameraSubject.next(cameraEvent);
            },
            onRemoved: (remoteCamera: Vidyo.VidyoRemoteCamera, participant: any) => {
                console.log('video:registerRemoteCameraEvents.onRemoved', remoteCamera);
                const cameraEvent: CameraEvent = {
                    eventType: 'removed',
                    camera: remoteCamera,
                    cameraType: 'remote',
                    participant: participant
                };
                this._cameraSubject.next(cameraEvent);
            },
            onStateUpdated: (remoteCamera: Vidyo.VidyoRemoteCamera, participant: any, state: any) => {
                console.log('video:registerRemoteCameraEvents.onStateUpdated', remoteCamera);
                const cameraEvent: CameraEvent = {
                    eventType: 'statechanged',
                    camera: remoteCamera,
                    cameraType: 'remote',
                    state: state,
                    participant: participant
                };
                this._cameraSubject.next(cameraEvent);
            }
        },
        localCamera: {
            onAdded: (localCamera: Vidyo.VidyoLocalCamera) => {
                console.log('video:registerLocalCameraEvents.onAdded', localCamera);
                const cameraEvent: CameraEvent = { eventType: 'added', camera: localCamera, cameraType: 'local' };
                this._cameraSubject.next(cameraEvent);
            },
            onRemoved: (localCamera: Vidyo.VidyoLocalCamera) => {
                console.log('video:registerLocalCameraEvents.onRemoved', localCamera);
                const cameraEvent: CameraEvent = { eventType: 'removed', camera: localCamera, cameraType: 'local' };
                this._cameraSubject.next(cameraEvent);
            },
            onSelected: (localCamera: Vidyo.VidyoLocalCamera) => {
                console.log('video:registerLocalCameraEvents.onSelected', localCamera);
                const cameraEvent: CameraEvent = { eventType: 'selected', camera: localCamera, cameraType: 'local' };
                this._cameraSubject.next(cameraEvent);
            },
            onStateUpdated: (localCamera: Vidyo.VidyoLocalCamera, state: any) => {
                console.log('video:registerLocalCameraEvents.onStateUpdated', localCamera, state);
                const cameraEvent: CameraEvent = { eventType: 'statechanged', camera: localCamera, state: state, cameraType: 'local' };
                this._cameraSubject.next(cameraEvent);
            }
        },
        localMicrophone: {
            onAdded: localMicrophone => {
                console.log('video:registerLocalMicrophoneEvents.onAdded', localMicrophone);
                const microphoneEvent: MicrophoneEvent = { type: 'added', microphone: localMicrophone };
                this._microphoneSubject.next(microphoneEvent);
            },
            onRemoved: localMicrophone => {
                console.log('video:registerLocalMicrophoneEvents.onRemoved', localMicrophone);
                const microphoneEvent: MicrophoneEvent = { type: 'removed', microphone: localMicrophone };
                this._microphoneSubject.next(microphoneEvent);
            },
            onSelected: localMicrophone => {
                console.log('video:registerLocalMicrophoneEvents.onSelected', localMicrophone);
                const microphoneEvent: MicrophoneEvent = { type: 'selected', microphone: localMicrophone };
                this._microphoneSubject.next(microphoneEvent);
            },
            onStateUpdated: localMicrophone => {
                console.log('video:registerLocalMicrophoneEvents.onStateUpdated', localMicrophone);
                const microphoneEvent: MicrophoneEvent = { type: 'statechanged', microphone: localMicrophone };
                this._microphoneSubject.next(microphoneEvent);
            }
        },
        localSpeaker: {
            onAdded: localSpeaker => {
                console.log('video:RegisterLocalSpeakerEventListener.onAdded', localSpeaker);
                const speakerEvent: SpeakerEvent = { type: 'added', speaker: localSpeaker };
                this._speakerSubject.next(speakerEvent);
            },
            onRemoved: localSpeaker => {
                console.log('video:RegisterLocalSpeakerEventListener.onRemoved', localSpeaker);
                const speakerEvent: SpeakerEvent = { type: 'removed', speaker: localSpeaker };
                this._speakerSubject.next(speakerEvent);
            },
            onSelected: localSpeaker => {
                console.log('video:RegisterLocalSpeakerEventListener.onSelected', localSpeaker);
                const speakerEvent: SpeakerEvent = { type: 'selected', speaker: localSpeaker };
                this._speakerSubject.next(speakerEvent);
            },
            onStateUpdated: localSpeaker => {
                console.log('video:RegisterLocalSpeakerEventListener.onStateUpdated', localSpeaker);
                const speakerEvent: SpeakerEvent = { type: 'statechanged', speaker: localSpeaker };
                this._speakerSubject.next(speakerEvent);
            }
        },
        localWindowShare: {
            onAdded: localWindowShare => {
                console.log('video:registerLocalWindowShareEvents.onAdded', localWindowShare);

                this.vidyoClient.getConnectState().then(_status => {
                    if (_status.webrtc) {
                        this.vidyoConnector
                            .SelectLocalWindowShare({ localWindowShare })
                            .then(() => {
                                console.log('video:registerLocalWindowShareEvents.onAdded.SelectLocalWindowShare(): success');
                                const evt: WindowShareEvent = { type: 'added', windowShare: localWindowShare };
                                this._windowShareSubject.next(evt);
                            })
                            .catch(error => {
                                console.log('video:registerLocalWindowShareEvents.onAdded.SelectLocalWindowShare(): failed', error);
                            });
                    }
                });
            },
            onRemoved: localWindowShare => {
                console.log('video:registerLocalWindowShareEvents.onRemoved', localWindowShare);
                const windowShareEvent: WindowShareEvent = { type: 'removed', windowShare: localWindowShare };
                this._windowShareSubject.next(windowShareEvent);
            },
            onSelected: localWindowShare => {
                console.log('video:registerLocalWindowShareEvents.onSelected', localWindowShare);
                const windowShareEvent: WindowShareEvent = { type: 'selected', windowShare: localWindowShare };
                this._windowShareSubject.next(windowShareEvent);
            },
            onStateUpdated: localWindowShare => {
                console.log('video:registerLocalWindowShareEvents.onStateUpdated', localWindowShare);
                const windowShareEvent: WindowShareEvent = { type: 'statechanged', windowShare: localWindowShare };
                this._windowShareSubject.next(windowShareEvent);
            }
        },
        participant: {
            onJoined: participant => {
                const participantEvent: ParticipantEvent = { type: 'joined', participant: participant, audioOnly: false };
                this._participantSubject.next(participantEvent);
                console.log('video:registerParticipantEvents.onJoined', participantEvent);
            },
            onLeft: participant => {
                const participantEvent: ParticipantEvent = { type: 'left', participant: participant, audioOnly: false };
                this._participantSubject.next(participantEvent);
                console.log('video:registerParticipantEvents.onLeft', participantEvent);
            },
            onDynamicChanged: (participants, remoteCameras) => {
                console.log('video:registerParticipantEvents.onDynamicChanged', participants, remoteCameras);
                const participantEvent: ParticipantEvent = {
                    type: 'dynamicchanged',
                    participant: participants[0],
                    dynamicParticipants: participants,
                    dynamicRemoteCameras: remoteCameras
                };
                this._participantSubject.next(participantEvent);
            },
            onLoudestChanged: (participant, audioOnly) => {
                console.log('video:registerParticipantEvents.onLoudestChanged', participant, audioOnly);
                const participantEvent: ParticipantEvent = { type: 'loudestchanged', participant: participant, audioOnly: audioOnly };
                this._participantSubject.next(participantEvent);
            }
        }
    };

    constructor() {
        this.vidyoClient = new Vidyo.VidyoClient();
    }

    public connect(options: { webrtc?: boolean; plugin?: boolean; viewId?: string | null }): Promise<Vidyo.VidyoClientState> {
        console.log('videoClient.connect()', options);

        // setup connect options
        const opts: any = {};
        opts.webrtc = options.plugin ? false : true;
        opts.plugin = options.plugin || false;

        let state: Vidyo.VidyoClientState;
        return this.vidyoClient
            .connect(opts)
            .then(_state => {
                state = _state;
                return this.createVidyoConnector({ viewId: options.viewId || null });
            })
            .then(vc => {
                this.cameraEnabled = true;
                this.microphoneEnabled = true;
                return state;
            });
    }

    public disconnect(): void {
        console.log('videoClient.disconnect()');
        if (this.vidyoConnector) {
            this.vidyoConnector.Disconnect();
            this.vidyoConnector = undefined;
        }
    }

    public getDebugStats(): Promise<any> {
        return this.vidyoConnector.GetStatsJson().then(result => {
            return JSON.parse(result);
        });
    }

    public getParticipants(): Observable<ParticipantEvent> {
        return this._participantSubject as Observable<ParticipantEvent>;
    }

    public getCameras(): Observable<CameraEvent> {
        return this._cameraSubject as Observable<CameraEvent>;
    }

    public getMicrophones(): Observable<MicrophoneEvent> {
        return this._microphoneSubject as Observable<MicrophoneEvent>;
    }

    public getSpeakers(): Observable<SpeakerEvent> {
        return this._speakerSubject as Observable<SpeakerEvent>;
    }

    public getWindowShares(): Observable<WindowShareEvent> {
        return this._windowShareSubject as Observable<WindowShareEvent>;
    }

    public selectCamera(options: { camera: any }): Promise<boolean> {
        return this.vidyoConnector.SelectLocalCamera({ localCamera: options.camera });
    }

    public selectSpeaker(options: { speaker: any }): Promise<boolean> {
        return this.vidyoConnector.SelectLocalSpeaker({ localSpeaker: options.speaker });
    }

    public selectMicrophone(options: { microphone: any }): Promise<boolean> {
        return this.vidyoConnector.SelectLocalMicrophone({ localMicrophone: options.microphone });
    }

    public cycleCamera(): Promise<boolean> {
        return this.vidyoConnector.CycleCamera();
    }

    public getJoinStatus(): Observable<boolean> {
        return this._joinSubject as Observable<boolean>;
    }

    public assignViewToLocalCamera(options: {
        viewId: string;
        localCamera: VidyoLocalCamera;
        displayCropped: boolean;
        allowZoom: boolean;
    }): Promise<boolean> {
        return this.vidyoConnector.AssignViewToLocalCamera({
            viewId: options.viewId,
            localCamera: options.localCamera,
            displayCropped: options.displayCropped,
            allowZoom: options.allowZoom
        });
    }

    public assignViewToRemoteCamera(options: {
        viewId: string;
        remoteCamera: VidyoRemoteCamera;
        displayCropped: boolean;
        allowZoom: boolean;
    }): Promise<boolean> {
        return this.vidyoConnector.AssignViewToRemoteCamera({
            viewId: options.viewId,
            remoteCamera: options.remoteCamera,
            displayCropped: options.displayCropped,
            allowZoom: options.allowZoom
        });
    }

    public assignViewToCompositeRenderer(options: {
        viewId: string;
        viewStyle: Vidyo.ViewStyle;
        remoteParticipants: number;
    }): Promise<boolean> {
        return this.vidyoConnector.AssignViewToCompositeRenderer({
            viewId: options.viewId,
            viewStyle: options.viewStyle,
            remoteParticipants: options.remoteParticipants
        });
    }

    public hideView(options: { viewId: string }): Promise<boolean> {
        return this.vidyoConnector.HideView({ viewId: options.viewId });
    }

    public join(options: { viewId: string; token: string; displayName: string; resourceId: string }): Promise<boolean> {
        console.log('video.join()', options);

        return this.createVidyoConnector({ viewId: options.viewId })
            .then(vidyoConnector => {
                return this.vidyoConnector.Connect({
                    host: 'prod.vidyo.io',
                    token: options.token,
                    displayName: options.displayName,
                    resourceId: options.resourceId,
                    // Define handlers for connection events.
                    onSuccess: this.eventHandler.vidyoConnector.onSuccess,
                    onFailure: this.eventHandler.vidyoConnector.onFailure,
                    onDisconnected: this.eventHandler.vidyoConnector.onDisconnected
                });
            })
            .catch(error => {
                console.error('CreateVidyoConnector Failed');
                return false;
            });
    }

    public toggleCamera(): Promise<boolean> {
        const privacy: boolean = this.cameraEnabled ? true : false;
        return this.vidyoConnector
            .SetCameraPrivacy({ privacy })
            .then(() => {
                this.cameraEnabled = !this.cameraEnabled;
                return this.cameraEnabled;
            })
            .catch(error => {
                console.error('video.toggleCamera(): Failed', error);
                return this.cameraEnabled;
            });
    }

    public toggleMicrophone(): Promise<boolean> {
        const privacy: boolean = this.microphoneEnabled ? true : false;

        return this.vidyoConnector
            .SetMicrophonePrivacy({ privacy })
            .then(() => {
                this.microphoneEnabled = !this.microphoneEnabled;
                return this.microphoneEnabled;
            })
            .catch(error => {
                console.error('video.toggleMicrophone(): Failed', error);
                return this.microphoneEnabled;
            });
    }

    public startWindowShare(): Promise<void> {
        return this.registerLocalWindowShareEvents();
    }

    private createVidyoConnector(options: { viewId: string | null }): Promise<Vidyo.VidyoConnector> {
        console.log('video.createVidyoConnector()', options);
        if (this.vidyoConnector) {
            console.log('video.createVidyoConnector():exists');
            return Promise.resolve(this.vidyoConnector);
        } else {
            console.log('video.createVidyoConnector():creating connector');

            return this.vidyoClient
                .createVidyoConnector({
                    viewId: options.viewId, // Div ID where the composited video will be rendered, see VidyoConnector.html
                    viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default', // Visual style of the composited renderer
                    remoteParticipants: 25, // Maximum number of participants
                    logFileFilter: 'warning',
                    logFileName: '',
                    userData: 0
                })
                .then(vc => {
                    this.vidyoConnector = vc;

                    console.log('video.createVidyoConnector().registerDeviceEvents');
                    this.registerDeviceEvents();

                    console.log('video.createVidyoConnector(): Ready', vc);
                    return vc;
                });
        }
    }

    registerDeviceEvents() {
        this.registerParticipantEvents();
        this.registerLocalCameraEvents();
        this.registerLocalMicrophoneEvents();
        this.registerLocalSpeakerEvents();
        this.registerRemoteCameraEvents();
    }

    unregisterDeviceEvents() {
        this.vidyoConnector.UnregisterParticipantEventListener();
        this.vidyoConnector.UnregisterLocalCameraEventListener();
        this.vidyoConnector.UnregisterLocalMicrophoneEventListener();
        this.vidyoConnector.UnregisterLocalSpeakerEventListener();
        this.vidyoConnector.UnregisterRemoteCameraEventListener();
    }

    registerRemoteCameraEvents() {
        this.vidyoConnector.RegisterRemoteCameraEventListener({
            onAdded: this.eventHandler.remoteCamera.onAdded,
            onRemoved: this.eventHandler.remoteCamera.onRemoved,
            onStateUpdated: this.eventHandler.remoteCamera.onStateUpdated
        });
    }

    registerLocalCameraEvents() {
        this.vidyoConnector
            .RegisterLocalCameraEventListener({
                onAdded: this.eventHandler.localCamera.onAdded,
                onRemoved: this.eventHandler.localCamera.onRemoved,
                onSelected: this.eventHandler.localCamera.onSelected,
                onStateUpdated: this.eventHandler.localCamera.onStateUpdated
            })
            .then(data => {
                console.log('video:registerLocalCameraEvents()', data);
            });
    }

    registerLocalMicrophoneEvents() {
        this.vidyoConnector
            .RegisterLocalMicrophoneEventListener({
                onAdded: this.eventHandler.localMicrophone.onAdded,
                onRemoved: this.eventHandler.localMicrophone.onRemoved,
                onSelected: this.eventHandler.localMicrophone.onSelected,
                onStateUpdated: this.eventHandler.localMicrophone.onStateUpdated
            })
            .then(data => {
                console.log('video:registerLocalMicrophoneEvents()', data);
            });
    }

    registerLocalSpeakerEvents() {
        this.vidyoConnector
            .RegisterLocalSpeakerEventListener({
                onAdded: this.eventHandler.localSpeaker.onAdded,
                onRemoved: this.eventHandler.localSpeaker.onRemoved,
                onSelected: this.eventHandler.localSpeaker.onSelected,
                onStateUpdated: this.eventHandler.localSpeaker.onStateUpdated
            })
            .then(data => {
                console.log('video:RegisterLocalSpeakerEventListener()', data);
            });
    }

    registerParticipantEvents() {
        this.vidyoConnector
            .RegisterParticipantEventListener({
                onJoined: this.eventHandler.participant.onJoined,
                onLeft: this.eventHandler.participant.onLeft,
                onDynamicChanged: this.eventHandler.participant.onDynamicChanged,
                onLoudestChanged: this.eventHandler.participant.onLoudestChanged
            })
            .then(data => {
                console.log('video:registerParticipantEvents()', data);
            });
    }

    private registerLocalWindowShareEvents(): Promise<void> {
        // Register for window share status updates, which operates differently in plugin vs webrtc:
        // plugin: onAdded and onRemoved callbacks are received for each available window
        //  webrtc: a popup is displayed (an extension to Firefox/Chrome) which allows the user to
        //  select a share; once selected, that share will trigger an onAdded event

        return this.vidyoConnector
            .RegisterLocalWindowShareEventListener({
                onAdded: this.eventHandler.localWindowShare.onAdded,
                onRemoved: this.eventHandler.localWindowShare.onRemoved,
                onSelected: this.eventHandler.localWindowShare.onSelected,
                onStateUpdated: this.eventHandler.localWindowShare.onStateUpdated
            })
            .then(result => {
                if (result) {
                    console.log('video:registerLocalWindowShareEvents(): success', result);
                } else {
                    throw new Error('Cannot start sharing... ensure your browser supports webrtc and or install the extension');
                }
            });
    }
}

interface VidyoEventHandler {
    vidyoConnector: VidyoConnectorEventHandler;
    remoteCamera: VidyoRemoteCameraEventHandler;
    localCamera: VidyoLocalCameraEventHandler;
    localMicrophone: VidyoLocalMicrophoneEventHandler;
    localSpeaker: VidyoLocalSpeakerEventHandler;
    localWindowShare: VidyoLocalWindowEventHandler;
    participant: VidyoParticipantEventHandler;
}

interface VidyoConnectorEventHandler {
    onSuccess();
    onFailure(reason);
    onDisconnected(reason);
}

interface VidyoRemoteCameraEventHandler {
    onAdded(remoteCamera: Vidyo.VidyoRemoteCamera, participant: any);
    onRemoved(remoteCamera: Vidyo.VidyoRemoteCamera, participant: any);
    onStateUpdated(remoteCamera: Vidyo.VidyoRemoteCamera, participant: any, state: any);
}

interface VidyoLocalCameraEventHandler {
    onAdded(localCamera: Vidyo.VidyoLocalCamera);
    onRemoved(localCamera: Vidyo.VidyoLocalCamera);
    onSelected(localCamera: Vidyo.VidyoLocalCamera);
    onStateUpdated(localCamera: Vidyo.VidyoLocalCamera, state: any);
}

interface VidyoLocalMicrophoneEventHandler {
    onAdded(localMicrophone);
    onRemoved(localMicrophone);
    onSelected(localMicrophone);
    onStateUpdated(localMicrophone);
}

interface VidyoLocalSpeakerEventHandler {
    onAdded(localSpeaker);
    onRemoved(localSpeaker);
    onSelected(localSpeaker);
    onStateUpdated(localSpeaker);
}

interface VidyoLocalWindowEventHandler {
    onAdded(localWindowShare);
    onRemoved(localWindowShare);
    onSelected(localWindowShare);
    onStateUpdated(localWindowShare);
}

interface VidyoParticipantEventHandler {
    onJoined(participant);
    onLeft(participant);
    onDynamicChanged(participants, remoteCameras);
    onLoudestChanged(participant, audioOnly);
}
