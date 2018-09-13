import { Injectable } from '@angular/core';
import { LocalCamera, RemoteCamera, CameraEvent, ParticipantEvent, MicrophoneEvent, SpeakerEvent, WindowShareEvent } from './interfaces';
import * as Vidyo from './vidyo';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class VideoClientService {
    public microphoneEnabled: boolean;
    public cameraEnabled: boolean;

    private _vidyoConnector: Vidyo.VidyoConnector;
    private _vidyoClient: Vidyo.VidyoClient;

    private _cameraSubject = new Subject<CameraEvent>();
    private _participantSubject = new Subject<ParticipantEvent>();
    private _microphoneSubject = new Subject<MicrophoneEvent>();
    private _speakerSubject = new Subject<SpeakerEvent>();
    private _windowShareSubject = new Subject<WindowShareEvent>();
    private _joinSubject: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this._vidyoClient = new Vidyo.VidyoClient();
    }

    public connect(options: { webrtc?: boolean, plugin?: boolean, viewId?: string | null }): Promise<Vidyo.VidyoClientState> {
        console.log('videoClient.connect()', options);

        // setup connect options
        const opts: any = {};
        opts.webrtc = options.plugin ? false : true;
        opts.plugin = options.plugin || false;

        let state: Vidyo.VidyoClientState;
        return this._vidyoClient.connect(opts)
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
        if (this._vidyoConnector) {
            this._vidyoConnector.Disconnect();
            this._vidyoConnector = undefined;
        }
    }

    public getDebugStats(): Promise<any> {
        return this._vidyoConnector.GetStatsJson()
            .then(result => {
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

    public selectCamera(camera: any): Promise<boolean> {
        return this._vidyoConnector.SelectLocalCamera({ localCamera: camera });
    }

    public selectSpeaker(speaker: any): Promise<boolean> {
        return this._vidyoConnector.SelectLocalSpeaker({ localSpeaker: speaker });
    }

    public selectMicrophone(microphone: any): Promise<boolean> {
        return this._vidyoConnector.SelectLocalMicrophone({ localMicrophone: microphone });
    }

    public cycleCamera(): Promise<boolean> {
        return this._vidyoConnector.CycleCamera();
    }

    public getJoinStatus(): Observable<boolean> {
        return this._joinSubject as Observable<boolean>;
    }

    public assignViewToLocalCamera(viewId: string, localCamera: LocalCamera, displayCropped: boolean,
        allowZoom: boolean): Promise<boolean> {
        return this._vidyoConnector.AssignViewToLocalCamera({ viewId, localCamera, displayCropped, allowZoom });
    }

    public assignViewToRemoteCamera(viewId: string, remoteCamera: RemoteCamera, displayCropped: boolean,
        allowZoom: boolean): Promise<boolean> {
        return this._vidyoConnector.AssignViewToRemoteCamera({ viewId, remoteCamera, displayCropped, allowZoom });
    }

    public assignViewToCompositeRenderer(viewId: string, viewStyle: Vidyo.ViewStyle, remoteParticipants: number): Promise<boolean> {
        return this._vidyoConnector.AssignViewToCompositeRenderer({ viewId, viewStyle, remoteParticipants });
    }

    public hideView(viewId: string): Promise<boolean> {
        return this._vidyoConnector.HideView({ viewId });
    }

    public join(options: { viewId: string, token: string, displayName: string, resourceId: string }): Promise<boolean> {

        console.log('video.join()', options);

        return this.createVidyoConnector({ viewId: options.viewId })
            .then((vidyoConnector) => {
                return this._vidyoConnector.Connect(
                    {
                        host: 'prod.vidyo.io',
                        token: options.token,
                        displayName: options.displayName,
                        resourceId: options.resourceId,
                        // Define handlers for connection events.
                        onSuccess: () => {
                            console.log('vidyo.joinRoom():success');
                            this._joinSubject.next(true);
                        },
                        onFailure: (reason) => {
                            console.error('vidyo.joinRoom():failure', reason);
                            this._joinSubject.error(reason);
                        },
                        onDisconnected: (reason) => {
                            console.warn('vidyo.joinRoom():disconnected', reason);
                            this._joinSubject.next(false);
                        }
                    }
                );
            })
            .catch(error => {
                console.error('CreateVidyoConnector Failed');
                return false;
            });
    }

    public toggleCamera(): Promise<boolean> {

        const privacy: boolean = this.cameraEnabled ? true : false;
        return this._vidyoConnector.SetCameraPrivacy({ privacy })
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

        return this._vidyoConnector.SetMicrophonePrivacy({ privacy })
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
        if (this._vidyoConnector) {
            console.log('video.createVidyoConnector():exists');
            return Promise.resolve(this._vidyoConnector);
        } else {

            console.log('video.createVidyoConnector():creating connector');

            return this._vidyoClient.createVidyoConnector({
                viewId: options.viewId, // Div ID where the composited video will be rendered, see VidyoConnector.html
                viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default', // Visual style of the composited renderer
                remoteParticipants: 25, // Maximum number of participants
                logFileFilter: 'warning',
                logFileName: '',
                userData: 0
            })
                .then(vc => {
                    this._vidyoConnector = vc;

                    console.log('video.createVidyoConnector().registerDeviceEvents');
                    this.registerParticipantEvents();
                    this.registerLocalCameraEvents();
                    this.registerLocalMicrophoneEvents();
                    this.registerLocalSpeakerEvents();
                    this.registerRemoteCameraEvents();

                    console.log('video.createVidyoConnector(): Ready', vc);
                    return vc;
                });
        }
    }

    private registerRemoteCameraEvents() {
        this._vidyoConnector.RegisterRemoteCameraEventListener(
            {
                onAdded: (remoteCamera: Vidyo.RemoteCamera, participant: any) => {
                    console.log('video:registerRemoteCameraEvents.onAdded', remoteCamera);
                    const cameraEvent: CameraEvent = {
                        eventType: 'added', camera: remoteCamera, cameraType: 'remote',
                        participant: participant
                    };
                    this._cameraSubject.next(cameraEvent);
                },
                onRemoved: (remoteCamera: Vidyo.RemoteCamera, participant: any) => {
                    console.log('video:registerRemoteCameraEvents.onRemoved', remoteCamera);
                    const cameraEvent: CameraEvent = {
                        eventType: 'removed', camera: remoteCamera, cameraType: 'remote',
                        participant: participant
                    };
                    this._cameraSubject.next(cameraEvent);
                },
                onStateUpdated: (remoteCamera: Vidyo.RemoteCamera, participant: any, state: any) => {
                    console.log('video:registerRemoteCameraEvents.onStateUpdated', remoteCamera);
                    const cameraEvent: CameraEvent = {
                        eventType: 'statechanged', camera: remoteCamera,
                        cameraType: 'remote', state: state, participant: participant
                    };
                    this._cameraSubject.next(cameraEvent);
                }
            }
        );
    }

    private registerLocalCameraEvents() {
        this._vidyoConnector.RegisterLocalCameraEventListener(
            {
                onAdded: (localCamera: Vidyo.LocalCamera) => {
                    console.log('video:registerLocalCameraEvents.onAdded', localCamera);
                    const cameraEvent: CameraEvent = { eventType: 'added', camera: localCamera, cameraType: 'local' };
                    this._cameraSubject.next(cameraEvent);
                },
                onRemoved: (localCamera: Vidyo.LocalCamera) => {
                    console.log('video:registerLocalCameraEvents.onRemoved', localCamera);
                    const cameraEvent: CameraEvent = { eventType: 'removed', camera: localCamera, cameraType: 'local' };
                    this._cameraSubject.next(cameraEvent);
                },
                onSelected: (localCamera: Vidyo.LocalCamera) => {
                    console.log('video:registerLocalCameraEvents.onSelected', localCamera);
                    const cameraEvent: CameraEvent = { eventType: 'selected', camera: localCamera, cameraType: 'local' };
                    this._cameraSubject.next(cameraEvent);
                },
                onStateUpdated: (localCamera: Vidyo.LocalCamera, state: any) => {
                    console.log('video:registerLocalCameraEvents.onStateUpdated', localCamera, state);
                    const cameraEvent: CameraEvent = { eventType: 'statechanged', camera: localCamera, state: state, cameraType: 'local' };
                    this._cameraSubject.next(cameraEvent);
                }
            }
        )
            .then(data => {
                console.log('video:registerLocalCameraEvents()', data);
            });
    }

    private registerLocalMicrophoneEvents() {
        this._vidyoConnector.RegisterLocalMicrophoneEventListener(
            {
                onAdded:
                    (localMicrophone) => {
                        console.log('video:registerLocalMicrophoneEvents.onAdded', localMicrophone);
                        const microphoneEvent: MicrophoneEvent = { type: 'added', microphone: localMicrophone };
                        this._microphoneSubject.next(microphoneEvent);
                    },
                onRemoved: (localMicrophone) => {
                    console.log('video:registerLocalMicrophoneEvents.onRemoved', localMicrophone);
                    const microphoneEvent: MicrophoneEvent = { type: 'removed', microphone: localMicrophone };
                    this._microphoneSubject.next(microphoneEvent);
                },
                onSelected: (localMicrophone) => {
                    console.log('video:registerLocalMicrophoneEvents.onSelected', localMicrophone);
                    const microphoneEvent: MicrophoneEvent = { type: 'selected', microphone: localMicrophone };
                    this._microphoneSubject.next(microphoneEvent);
                },
                onStateUpdated: (localMicrophone) => {
                    console.log('video:registerLocalMicrophoneEvents.onStateUpdated', localMicrophone);
                    const microphoneEvent: MicrophoneEvent = { type: 'statechanged', microphone: localMicrophone };
                    this._microphoneSubject.next(microphoneEvent);
                }
            }
        ).then(data => {
            console.log('video:registerLocalMicrophoneEvents()', data);
        });
    }

    private registerLocalSpeakerEvents() {
        this._vidyoConnector.RegisterLocalSpeakerEventListener(
            {
                onAdded: (localSpeaker) => {
                        console.log('video:RegisterLocalSpeakerEventListener.onAdded', localSpeaker);
                        const speakerEvent: SpeakerEvent = { type: 'added', speaker: localSpeaker };
                        this._speakerSubject.next(speakerEvent);
                    },
                onRemoved: (localSpeaker) => {
                    console.log('video:RegisterLocalSpeakerEventListener.onRemoved', localSpeaker);
                    const speakerEvent: SpeakerEvent = { type: 'removed', speaker: localSpeaker };
                    this._speakerSubject.next(speakerEvent);
                },
                onSelected: (localSpeaker) => {
                    console.log('video:RegisterLocalSpeakerEventListener.onSelected', localSpeaker);
                    const speakerEvent: SpeakerEvent = { type: 'selected', speaker: localSpeaker };
                    this._speakerSubject.next(speakerEvent);
                },
                onStateUpdated: (localSpeaker) => {
                    console.log('video:RegisterLocalSpeakerEventListener.onStateUpdated', localSpeaker);
                    const speakerEvent: SpeakerEvent = { type: 'statechanged', speaker: localSpeaker };
                    this._speakerSubject.next(speakerEvent);
                }
            }
        ).then(data => {
            console.log('video:RegisterLocalSpeakerEventListener()', data);
        });
    }

    private registerParticipantEvents() {
        this._vidyoConnector.RegisterParticipantEventListener(
            {
                onJoined:
                    (participant) => {
                        const participantEvent: ParticipantEvent = { type: 'joined', participant: participant, audioOnly: false };
                        this._participantSubject.next(participantEvent);
                        console.log('video:registerParticipantEvents.onJoined', participantEvent);
                    },
                onLeft: (participant) => {
                    const participantEvent: ParticipantEvent = { type: 'left', participant: participant, audioOnly: false };
                    this._participantSubject.next(participantEvent);
                    console.log('video:registerParticipantEvents.onLeft', participantEvent);
                },
                onDynamicChanged: (participants, remoteCameras) => {
                    console.log('video:registerParticipantEvents.onDynamicChanged', participants, remoteCameras);
                    const participantEvent: ParticipantEvent = {
                        type: 'dynamicchanged', participant: participants[0],
                        dynamicParticipants: participants, dynamicRemoteCameras: remoteCameras
                    };
                    this._participantSubject.next(participantEvent);
                },
                onLoudestChanged: (participant, audioOnly) => {
                    console.log('video:registerParticipantEvents.onLoudestChanged', participant, audioOnly);
                    const participantEvent: ParticipantEvent = { type: 'loudestchanged', participant: participant, audioOnly: audioOnly };
                    this._participantSubject.next(participantEvent);
                }
            }
        ).then(data => {
            console.log('video:registerParticipantEvents()', data);
        });
    }

    private registerLocalWindowShareEvents(): Promise<void> {
        // Register for window share status updates, which operates differently in plugin vs webrtc:
        // plugin: onAdded and onRemoved callbacks are received for each available window
        //  webrtc: a popup is displayed (an extension to Firefox/Chrome) which allows the user to
        //  select a share; once selected, that share will trigger an onAdded event

        return this._vidyoConnector.RegisterLocalWindowShareEventListener(
            {
                onAdded:
                    (localWindowShare) => {
                        console.log('video:registerLocalWindowShareEvents.onAdded', localWindowShare);

                        this._vidyoClient.getConnectState()
                            .then(_status => {
                                if (_status.webrtc) {
                                    this._vidyoConnector.SelectLocalWindowShare(localWindowShare)
                                        .then(() => {
                                            console.log('video:registerLocalWindowShareEvents.onAdded.SelectLocalWindowShare(): success');
                                            const evt: WindowShareEvent = { type: 'added', windowShare: localWindowShare };
                                            this._windowShareSubject.next(evt);
                                        })
                                        .catch(error => {
                                            console.log('video:registerLocalWindowShareEvents.onAdded.SelectLocalWindowShare(): failed',
                                                error);
                                        });
                                }
                            });


                    },
                onRemoved: (localWindowShare) => {
                    console.log('video:registerLocalWindowShareEvents.onRemoved', localWindowShare);
                    const windowShareEvent: WindowShareEvent = { type: 'removed', windowShare: localWindowShare };
                    this._windowShareSubject.next(windowShareEvent);
                },
                onSelected: (localWindowShare) => {
                    console.log('video:registerLocalWindowShareEvents.onSelected', localWindowShare);
                    const windowShareEvent: WindowShareEvent = { type: 'selected', windowShare: localWindowShare };
                    this._windowShareSubject.next(windowShareEvent);
                },
                onStateUpdated: (localWindowShare) => {
                    console.log('video:registerLocalWindowShareEvents.onStateUpdated', localWindowShare);
                    const windowShareEvent: WindowShareEvent = { type: 'statechanged', windowShare: localWindowShare };
                    this._windowShareSubject.next(windowShareEvent);
                }
            }
        )
            .then(result => {
                if (result) {
                    console.log('video:registerLocalWindowShareEvents(): success', result);
                } else {
                    throw new Error('Cannot start sharing... ensure your browser supports webrtc and or install the extension');
                }
            });
    }
}

