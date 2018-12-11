import { VideoClientService } from './video-client.service';
import { VidyoRemoteCamera } from './interfaces';
import * as Vidyo from './vidyo';
import { VidyoParticipant } from './vidyo';

describe('VideoClientService: ', () => {
    describe('constructor: ', () => {
        it('constructor created vidyo client', () => {
            // Arrenge + Act
            const service = new VideoClientService();

            // Assert
            expect(service.vidyoClient).toBeDefined();
        });
    });

    describe('connect: ', () => {
        let service;

        beforeEach(() => {
            service = new VideoClientService();
            spyOn(service.vidyoClient, 'connect').and.returnValue(Promise.resolve({ state: 'READY' }));
            spyOn(service, 'createVidyoConnector').and.returnValue(Promise.resolve());
        });

        it('with empty parameter connects vidyo client with webrtc', () => {
            // Arrenge
            // Act
            service.connect({});

            // Assert
            expect(service.vidyoClient.connect).toHaveBeenCalledWith({ webrtc: true, plugin: false });
        });

        it('ignore paramter webrtc', () => {
            // Arrenge
            // Act
            service.connect({ webrtc: false });

            // Assert
            expect(service.vidyoClient.connect).toHaveBeenCalledWith({ webrtc: true, plugin: false });
        });

        it('with plugin false, connects vidyo client with webrtc', () => {
            // Arrenge
            // Act
            service.connect({ plugin: false });

            // Assert
            expect(service.vidyoClient.connect).toHaveBeenCalledWith({ webrtc: true, plugin: false });
        });

        it('with plugin true, connects vidyo client with plugin', () => {
            // Arrenge
            // Act
            service.connect({ plugin: true });

            // Assert
            expect(service.vidyoClient.connect).toHaveBeenCalledWith({ webrtc: false, plugin: true });
        });

        it('set cameraEnabled to true on successful connection', () => {
            // Arrenge
            // Act
            service.connect({}).then(() => {
                // Assert
                expect(service.cameraEnabled).toBeTruthy();
            });
        });

        it('set microphoneEnabled to true on successful connection', () => {
            // Arrenge
            // Act
            service.connect({}).then(() => {
                // Assert
                expect(service.microphoneEnabled).toBeTruthy();
            });
        });

        it('returns vidyo client state', () => {
            // Arrenge
            // Act
            service.connect({}).then(state => {
                // Assert
                expect(state.state).toBe('READY');
            });
        });
    });

    describe('disconnect: ', () => {
        it('resets vidyoConnector', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ Disconnect: Function };

            // Act
            service.disconnect();

            // Assert
            expect(service.vidyoConnector).toBeUndefined();
        });
    });

    describe('getDebugStats: ', () => {
        it('calls vidyoConnector GetStatsJson method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ GetStatsJson: Function };
            spyOn(service.vidyoConnector, 'GetStatsJson').and.returnValue(Promise.resolve(`{ "x": 1}`));

            // Act
            service.getDebugStats();

            // Assert
            expect(service.vidyoConnector.GetStatsJson).toHaveBeenCalled();
        });

        it('returns debug stats', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ GetStatsJson: Function };
            spyOn(service.vidyoConnector, 'GetStatsJson').and.returnValue(Promise.resolve(`{ "x": 1}`));

            // Act
            service.getDebugStats().then(result => {
                // Assert
                expect(result.x).toBe(1);
            });
        });
    });

    describe('selectCamera: ', () => {
        it('calls vidyoConnector SelectLocalCamera method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ SelectLocalCamera: Function };
            spyOn(service.vidyoConnector, 'SelectLocalCamera');

            // Act
            service.selectCamera({ camera: true });

            // Assert
            expect(service.vidyoConnector.SelectLocalCamera).toHaveBeenCalledWith({ localCamera: true });
        });
    });

    describe('selectSpeaker: ', () => {
        it('calls vidyoConnector SelectLocalSpeaker method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ SelectLocalSpeaker: Function };
            spyOn(service.vidyoConnector, 'SelectLocalSpeaker');

            // Act
            service.selectSpeaker({ speaker: true });

            // Assert
            expect(service.vidyoConnector.SelectLocalSpeaker).toHaveBeenCalledWith({ localSpeaker: true });
        });
    });

    describe('selectMicrophone: ', () => {
        it('calls vidyoConnector SelectLocalMicrophone method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ SelectLocalMicrophone: Function };
            spyOn(service.vidyoConnector, 'SelectLocalMicrophone');

            // Act
            service.selectMicrophone({ microphone: true });

            // Assert
            expect(service.vidyoConnector.SelectLocalMicrophone).toHaveBeenCalledWith({ localMicrophone: true });
        });
    });

    describe('cycleCamera: ', () => {
        it('calls vidyoConnector CycleCamera method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ CycleCamera: Function };
            spyOn(service.vidyoConnector, 'CycleCamera');

            // Act
            service.cycleCamera();

            // Assert
            expect(service.vidyoConnector.CycleCamera).toHaveBeenCalled();
        });
    });

    describe('assignViewToLocalCamera: ', () => {
        it('calls vidyoConnector AssignViewToLocalCamera method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ AssignViewToLocalCamera: Function };
            spyOn(service.vidyoConnector, 'AssignViewToLocalCamera');

            // Act
            service.assignViewToLocalCamera({
                viewId: 'view1',
                localCamera: <any>{},
                displayCropped: true,
                allowZoom: true
            });

            // Assert
            expect(service.vidyoConnector.AssignViewToLocalCamera).toHaveBeenCalledWith({
                viewId: 'view1',
                localCamera: <any>{},
                displayCropped: true,
                allowZoom: true
            });
        });
    });

    describe('assignViewToCompositeRenderer: ', () => {
        it('calls vidyoConnector AssignViewToCompositeRenderer method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ AssignViewToCompositeRenderer: Function };
            spyOn(service.vidyoConnector, 'AssignViewToCompositeRenderer');

            // Act
            service.assignViewToCompositeRenderer({
                viewId: 'view1',
                viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default',
                remoteParticipants: 10
            });

            // Assert
            expect(service.vidyoConnector.AssignViewToCompositeRenderer).toHaveBeenCalledWith({
                viewId: 'view1',
                viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default',
                remoteParticipants: 10
            });
        });
    });

    describe('hideView: ', () => {
        it('calls vidyoConnector HideView method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ HideView: Function };
            spyOn(service.vidyoConnector, 'HideView');

            // Act
            service.hideView({ viewId: 'view1' });

            // Assert
            expect(service.vidyoConnector.HideView).toHaveBeenCalledWith({ viewId: 'view1' });
        });
    });

    describe('join: ', () => {
        it('calls vidyoConnector Connect method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ Connect: Function };
            spyOn(service.vidyoConnector, 'Connect');

            // Act
            service.join({ viewId: 'view1', token: 'vidyo-token', displayName: 'John', resourceId: 'meeting1' }).then(() => {
                // Assert
                expect(service.vidyoConnector.Connect).toHaveBeenCalledWith({
                    host: 'prod.vidyo.io',
                    token: 'vidyo-token',
                    displayName: 'John',
                    resourceId: 'meeting1',
                    onSuccess: jasmine.any(Function),
                    onFailure: jasmine.any(Function),
                    onDisconnected: jasmine.any(Function)
                });
            });
        });
    });

    describe('toggleCamera: ', () => {
        it('mutes camera when it is unmuted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = true;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleCamera();

            // Assert
            expect(service.vidyoConnector.SetCameraPrivacy).toHaveBeenCalledWith({ privacy: true });
        });

        it('unmutes camera when it is muted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = false;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleCamera();

            // Assert
            expect(service.vidyoConnector.SetCameraPrivacy).toHaveBeenCalledWith({ privacy: false });
        });

        it('set cameraEnabled to true when it is false', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = false;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleCamera().then(() => {
                // Assert
                expect(service.cameraEnabled).toBeTruthy();
            });
        });

        it('set cameraEnabled to false when it is true', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = true;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleCamera().then(() => {
                // Assert
                expect(service.cameraEnabled).toBeFalsy();
            });
        });

        it('returns false when camera is unmuted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = true;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleCamera().then(cameraEnabled => {
                // Assert
                expect(cameraEnabled).toBeFalsy();
            });
        });

        it('returns true when camera is muted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = false;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleCamera().then(cameraEnabled => {
                // Assert
                expect(cameraEnabled).toBeTruthy();
            });
        });

        it('does not change cameraEnabled state on failure', () => {
            // Arrenge
            const service = new VideoClientService();
            service.cameraEnabled = true;
            service.vidyoConnector = <any>{ SetCameraPrivacy: Function };
            spyOn(service.vidyoConnector, 'SetCameraPrivacy').and.returnValue(Promise.reject());

            // Act
            service.toggleCamera().catch(() => {
                // Assert
                expect(service.cameraEnabled).toBeTruthy();
            });
        });
    });

    describe('toggleMicrophone: ', () => {
        it('mutes microphone when it is unmuted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = true;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleMicrophone();

            // Assert
            expect(service.vidyoConnector.SetMicrophonePrivacy).toHaveBeenCalledWith({ privacy: true });
        });

        it('unmutes microphone when it is muted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = false;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleMicrophone();

            // Assert
            expect(service.vidyoConnector.SetMicrophonePrivacy).toHaveBeenCalledWith({ privacy: false });
        });

        it('set microphoneEnabled to true when it is false', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = false;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleMicrophone().then(() => {
                // Assert
                expect(service.microphoneEnabled).toBeTruthy();
            });
        });

        it('set microphoneEnabled to false when it is true', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = true;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleMicrophone().then(() => {
                // Assert
                expect(service.microphoneEnabled).toBeFalsy();
            });
        });

        it('returns false when microphone is unmuted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = true;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleMicrophone().then(microphoneEnabled => {
                // Assert
                expect(microphoneEnabled).toBeFalsy();
            });
        });

        it('returns true when microphone is muted', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = false;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.resolve());

            // Act
            service.toggleMicrophone().then(microphoneEnabled => {
                // Assert
                expect(microphoneEnabled).toBeTruthy();
            });
        });

        it('does not change microphoneEnabled state on failure', () => {
            // Arrenge
            const service = new VideoClientService();
            service.microphoneEnabled = false;
            service.vidyoConnector = <any>{ SetMicrophonePrivacy: Function };
            spyOn(service.vidyoConnector, 'SetMicrophonePrivacy').and.returnValue(Promise.reject());

            // Act
            service.toggleMicrophone().catch(() => {
                // Assert
                expect(service.microphoneEnabled).toBeFalsy();
            });
        });
    });

    describe('startWindowShare', () => {
        it('calls vidyoConnector RegisterLocalWindowShareEventListener method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterLocalWindowShareEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterLocalWindowShareEventListener').and.returnValue(Promise.resolve());

            // Act
            service.startWindowShare();

            // Assert
            expect(service.vidyoConnector.RegisterLocalWindowShareEventListener).toHaveBeenCalledWith({
                onAdded: jasmine.any(Function),
                onRemoved: jasmine.any(Function),
                onSelected: jasmine.any(Function),
                onStateUpdated: jasmine.any(Function)
            });
        });

        it('throws error when promise resolved with result', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterLocalWindowShareEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterLocalWindowShareEventListener').and.returnValue(Promise.resolve());

            // Act
            // Assert
            expect(service.startWindowShare).toThrowError();
        });
    });

    describe('registerDeviceEvents', () => {
        it('calls all devices registered method', () => {
            // Arrenge
            const service = new VideoClientService();

            spyOn(service, 'registerParticipantEvents');
            spyOn(service, 'registerLocalCameraEvents');
            spyOn(service, 'registerLocalMicrophoneEvents');
            spyOn(service, 'registerLocalSpeakerEvents');
            spyOn(service, 'registerRemoteCameraEvents');

            // Act
            service.registerDeviceEvents();

            // Assert
            expect(service.registerParticipantEvents).toHaveBeenCalled();
            expect(service.registerLocalCameraEvents).toHaveBeenCalled();
            expect(service.registerLocalMicrophoneEvents).toHaveBeenCalled();
            expect(service.registerLocalSpeakerEvents).toHaveBeenCalled();
            expect(service.registerRemoteCameraEvents).toHaveBeenCalled();
        });
    });

    describe('registerRemoteCameraEvents', () => {
        it('calls vidyoConnector RegisterRemoteCameraEventListener method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterRemoteCameraEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterRemoteCameraEventListener').and.returnValue(Promise.resolve());

            // Act
            service.registerRemoteCameraEvents();

            // Assert
            expect(service.vidyoConnector.RegisterRemoteCameraEventListener).toHaveBeenCalledWith({
                onAdded: jasmine.any(Function),
                onRemoved: jasmine.any(Function),
                onStateUpdated: jasmine.any(Function)
            });
        });
    });

    describe('registerLocalCameraEvents', () => {
        it('calls vidyoConnector RegisterLocalCameraEventListener method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterLocalCameraEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterLocalCameraEventListener').and.returnValue(Promise.resolve());

            // Act
            service.registerLocalCameraEvents();

            // Assert
            expect(service.vidyoConnector.RegisterLocalCameraEventListener).toHaveBeenCalledWith({
                onAdded: jasmine.any(Function),
                onRemoved: jasmine.any(Function),
                onSelected: jasmine.any(Function),
                onStateUpdated: jasmine.any(Function)
            });
        });
    });

    describe('registerLocalMicrophoneEvents', () => {
        it('calls vidyoConnector RegisterLocalMicrophoneEventListener method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterLocalMicrophoneEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterLocalMicrophoneEventListener').and.returnValue(Promise.resolve());

            // Act
            service.registerLocalMicrophoneEvents();

            // Assert
            expect(service.vidyoConnector.RegisterLocalMicrophoneEventListener).toHaveBeenCalledWith({
                onAdded: jasmine.any(Function),
                onRemoved: jasmine.any(Function),
                onSelected: jasmine.any(Function),
                onStateUpdated: jasmine.any(Function)
            });
        });
    });

    describe('registerLocalSpeakerEvents', () => {
        it('calls vidyoConnector RegisterLocalSpeakerEventListener method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterLocalSpeakerEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterLocalSpeakerEventListener').and.returnValue(Promise.resolve());

            // Act
            service.registerLocalSpeakerEvents();

            // Assert
            expect(service.vidyoConnector.RegisterLocalSpeakerEventListener).toHaveBeenCalledWith({
                onAdded: jasmine.any(Function),
                onRemoved: jasmine.any(Function),
                onSelected: jasmine.any(Function),
                onStateUpdated: jasmine.any(Function)
            });
        });
    });

    describe('registerParticipantEvents', () => {
        it('calls vidyoConnector RegisterParticipantEventListener method', () => {
            // Arrenge
            const service = new VideoClientService();
            service.vidyoConnector = <any>{ RegisterParticipantEventListener: Function };
            spyOn(service.vidyoConnector, 'RegisterParticipantEventListener').and.returnValue(Promise.resolve());

            // Act
            service.registerParticipantEvents();

            // Assert
            expect(service.vidyoConnector.RegisterParticipantEventListener).toHaveBeenCalledWith({
                onJoined: jasmine.any(Function),
                onLeft: jasmine.any(Function),
                onDynamicChanged: jasmine.any(Function),
                onLoudestChanged: jasmine.any(Function)
            });
        });
    });

    describe('eventHandler-vidyo event handlers', () => {
        describe('vidyoConnector', () => {
            it('onSuccess publish join status true', () => {
                // Arrenge
                const service = new VideoClientService();

                service.getJoinStatus().subscribe(status => {
                    // Assert
                    expect(status).toBeTruthy();
                });

                // Act
                service.eventHandler.vidyoConnector.onSuccess();
            });

            it('onFailure publish error with error message', () => {
                // Arrenge
                const service = new VideoClientService();

                service.getJoinStatus().subscribe(null, reason => {
                    // Assert
                    expect(reason).toBe('error occured');
                });

                // Act
                service.eventHandler.vidyoConnector.onFailure('error occured');
            });

            it('onDisconnected publish join status false', () => {
                // Arrenge
                const service = new VideoClientService();

                service.getJoinStatus().subscribe(() => {
                    // Assert
                    expect(status).toBeFalsy();
                });

                // Act
                service.eventHandler.vidyoConnector.onDisconnected('disconnected');
            });
        });

        describe('remoteCamera', () => {
            it('onAdded raises remote camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const remoteCamera = <Vidyo.VidyoRemoteCamera>{ id: 'camera1' };
                const participant = { id: 'participant1' };

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('added');
                    expect(cameraEvent.camera.id).toBe('camera1');
                    expect(cameraEvent.cameraType).toBe('remote');
                    expect(cameraEvent.participant.id).toBe('participant1');
                });

                // Act
                service.eventHandler.remoteCamera.onAdded(remoteCamera, participant);
            });

            it('onRemoved raises remote camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const remoteCamera = <Vidyo.VidyoRemoteCamera>{ id: 'camera1' };
                const participant = { id: 'participant1' };

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('removed');
                    expect(cameraEvent.camera.id).toEqual('camera1');
                    expect(cameraEvent.cameraType).toBe('remote');
                    expect(cameraEvent.participant.id).toEqual('participant1');
                });

                // Act
                service.eventHandler.remoteCamera.onRemoved(remoteCamera, participant);
            });

            it('onStateUpdated raises remote camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const remoteCamera = <Vidyo.VidyoRemoteCamera>{ id: 'camera1' };
                const participant = { id: 'participant1' };
                const state = 'connected';

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('statechanged');
                    expect(cameraEvent.camera.id).toEqual('camera1');
                    expect(cameraEvent.cameraType).toBe('remote');
                    expect(cameraEvent.state).toEqual('connected');
                    expect(cameraEvent.participant.id).toEqual('participant1');
                });

                // Act
                service.eventHandler.remoteCamera.onStateUpdated(remoteCamera, participant, state);
            });
        });

        describe('localCamera', () => {
            it('onAdded raises local camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localCamera = <Vidyo.VidyoLocalCamera>{ id: 'camera1' };

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('added');
                    expect(cameraEvent.camera.id).toBe('camera1');
                    expect(cameraEvent.cameraType).toBe('local');
                });

                // Act
                service.eventHandler.localCamera.onAdded(localCamera);
            });

            it('onRemoved raises local camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localCamera = <Vidyo.VidyoLocalCamera>{ id: 'camera1' };

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('removed');
                    expect(cameraEvent.camera.id).toBe('camera1');
                    expect(cameraEvent.cameraType).toBe('local');
                });

                // Act
                service.eventHandler.localCamera.onRemoved(localCamera);
            });

            it('onSelected raises local camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localCamera = <Vidyo.VidyoLocalCamera>{ id: 'camera1' };

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('selected');
                    expect(cameraEvent.camera.id).toBe('camera1');
                    expect(cameraEvent.cameraType).toBe('local');
                });

                // Act
                service.eventHandler.localCamera.onSelected(localCamera);
            });

            it('onStateUpdated raises local camera event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localCamera = <Vidyo.VidyoLocalCamera>{ id: 'camera1' };
                const state = 'connected';

                service.getCameras().subscribe(cameraEvent => {
                    // Assert
                    expect(cameraEvent.eventType).toBe('statechanged');
                    expect(cameraEvent.camera.id).toBe('camera1');
                    expect(cameraEvent.cameraType).toBe('local');
                    expect(cameraEvent.state).toBe('connected');
                });

                // Act
                service.eventHandler.localCamera.onStateUpdated(localCamera, state);
            });
        });

        describe('localMicrophone', () => {
            it('onAdded raises local microphone event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localMicrophone = { id: 'microphone1' };

                service.getMicrophones().subscribe(microphoneEvent => {
                    // Assert
                    expect(microphoneEvent.type).toBe('added');
                    expect(microphoneEvent.microphone.id).toBe('microphone1');
                });

                // Act
                service.eventHandler.localMicrophone.onAdded(localMicrophone);
            });

            it('onRemoved raises local microphone event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localMicrophone = { id: 'microphone1' };

                service.getMicrophones().subscribe(microphoneEvent => {
                    // Assert
                    expect(microphoneEvent.type).toBe('removed');
                    expect(microphoneEvent.microphone.id).toBe('microphone1');
                });

                // Act
                service.eventHandler.localMicrophone.onRemoved(localMicrophone);
            });

            it('onSelected raises local microphone event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localMicrophone = { id: 'microphone1' };

                service.getMicrophones().subscribe(microphoneEvent => {
                    // Assert
                    expect(microphoneEvent.type).toBe('selected');
                    expect(microphoneEvent.microphone.id).toBe('microphone1');
                });

                // Act
                service.eventHandler.localMicrophone.onSelected(localMicrophone);
            });

            it('onStateUpdated raises local microphone event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localMicrophone = { id: 'microphone1' };

                service.getMicrophones().subscribe(microphoneEvent => {
                    // Assert
                    expect(microphoneEvent.type).toBe('statechanged');
                    expect(microphoneEvent.microphone.id).toBe('microphone1');
                });

                // Act
                service.eventHandler.localMicrophone.onStateUpdated(localMicrophone);
            });
        });

        describe('localSpeaker', () => {
            it('onAdded raises local speaker event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localSpeaker = { id: 'speaker1' };

                service.getSpeakers().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('added');
                    expect(speakerEvent.speaker.id).toBe('speaker1');
                });

                // Act
                service.eventHandler.localSpeaker.onAdded(localSpeaker);
            });

            it('onRemoved raises local speaker event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localSpeaker = { id: 'speaker1' };

                service.getSpeakers().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('removed');
                    expect(speakerEvent.speaker.id).toBe('speaker1');
                });

                // Act
                service.eventHandler.localSpeaker.onRemoved(localSpeaker);
            });

            it('onSelected raises local speaker event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localSpeaker = { id: 'speaker1' };

                service.getSpeakers().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('selected');
                    expect(speakerEvent.speaker.id).toBe('speaker1');
                });

                // Act
                service.eventHandler.localSpeaker.onSelected(localSpeaker);
            });

            it('onStateUpdated raises local speaker event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localSpeaker = { id: 'speaker1' };

                service.getSpeakers().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('statechanged');
                    expect(speakerEvent.speaker.id).toBe('speaker1');
                });

                // Act
                service.eventHandler.localSpeaker.onStateUpdated(localSpeaker);
            });
        });

        describe('localWindowShare', () => {
            it('calls vidyoClient getConnectState method', () => {
                // Arrenge
                const service = new VideoClientService();
                spyOn(service.vidyoClient, 'getConnectState').and.returnValue(Promise.resolve());

                // Act
                service.eventHandler.localWindowShare.onAdded({});

                // Assert
                expect(service.vidyoClient.getConnectState).toHaveBeenCalled();
            });

            it('does not call SelectLocalWindowShare method on vidyoConnector', () => {
                // Arrenge
                const service = new VideoClientService();
                service.vidyoConnector = <any>{ SelectLocalWindowShare: Function };

                spyOn(service.vidyoClient, 'getConnectState').and.returnValue(Promise.resolve({ webrtc: false }));
                spyOn(service.vidyoConnector, 'SelectLocalWindowShare').and.returnValue(Promise.resolve());

                // Act
                service.eventHandler.localWindowShare.onAdded({});

                // Assert
                expect(service.vidyoConnector.SelectLocalWindowShare).not.toHaveBeenCalled();
            });

            xit('calls SelectLocalWindowShare method on vidyoConnector', () => {
                // Arrenge
                const service = new VideoClientService();
                service.vidyoConnector = <any>{ SelectLocalWindowShare: Function };

                spyOn(service.vidyoClient, 'getConnectState').and.returnValue(Promise.resolve({ webrtc: true }));
                spyOn(service.vidyoConnector, 'SelectLocalWindowShare').and.returnValue(Promise.resolve());

                // Act
                service.eventHandler.localWindowShare.onAdded({});

                // Assert
                expect(service.vidyoConnector.SelectLocalWindowShare).toHaveBeenCalled();
            });

            it('onAdded raises local window share event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localWindowShare = { id: 'windowshare1' };
                service.vidyoConnector = <any>{ SelectLocalWindowShare: Function };

                spyOn(service.vidyoClient, 'getConnectState').and.returnValue(Promise.resolve({ webrtc: true }));
                spyOn(service.vidyoConnector, 'SelectLocalWindowShare').and.returnValue(Promise.resolve());

                service.getWindowShares().subscribe(windowShareEvent => {
                    // Assert
                    expect(windowShareEvent.type).toBe('added');
                    expect(windowShareEvent.windowShare.id).toBe('windowshare1');
                });

                // Act
                service.eventHandler.localSpeaker.onAdded(localWindowShare);
            });

            it('onRemoved raises local window share event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localWindowShare = { id: 'windowshare1' };

                service.getWindowShares().subscribe(windowShareEvent => {
                    // Assert
                    expect(windowShareEvent.type).toBe('removed');
                    expect(windowShareEvent.windowShare.id).toBe('windowshare1');
                });

                // Act
                service.eventHandler.localSpeaker.onRemoved(localWindowShare);
            });

            it('onSelected raises local window share event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localWindowShare = { id: 'windowshare1' };

                service.getWindowShares().subscribe(windowShareEvent => {
                    // Assert
                    expect(windowShareEvent.type).toBe('selected');
                    expect(windowShareEvent.windowShare.id).toBe('windowshare1');
                });

                // Act
                service.eventHandler.localSpeaker.onSelected(localWindowShare);
            });

            it('onStateUpdated raises local window share event', () => {
                // Arrenge
                const service = new VideoClientService();
                const localWindowShare = { id: 'windowshare1' };

                service.getWindowShares().subscribe(windowShareEvent => {
                    // Assert
                    expect(windowShareEvent.type).toBe('statechanged');
                    expect(windowShareEvent.windowShare.id).toBe('windowshare1');
                });

                // Act
                service.eventHandler.localSpeaker.onStateUpdated(localWindowShare);
            });
        });

        describe('participant', () => {
            it('onJoined raises participant event', () => {
                // Arrenge
                const service = new VideoClientService();
                const participant = { id: 'participant1' };

                service.getParticipants().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('joined');
                    expect(speakerEvent.participant.id).toBe('participant1');
                    expect(speakerEvent.audioOnly).toBeFalsy();
                });

                // Act
                service.eventHandler.participant.onJoined(participant);
            });

            it('onLeft raises participant event', () => {
                // Arrenge
                const service = new VideoClientService();
                const participant = { id: 'participant1' };

                service.getParticipants().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('left');
                    expect(speakerEvent.participant.id).toBe('participant1');
                    expect(speakerEvent.audioOnly).toBeFalsy();
                });

                // Act
                service.eventHandler.participant.onLeft(participant);
            });

            it('onDynamicChanged raises participant event', () => {
                // Arrenge
                const service = new VideoClientService();
                const participants = [{ id: 'participant1' }, { id: 'participant2' }];
                const remoteCameras = [{ id: 'camera1' }];

                service.getParticipants().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('dynamicchanged');
                    expect(speakerEvent.participant.id).toBe('participant1');
                    expect(speakerEvent.dynamicParticipants).toBe(<VidyoParticipant[]>participants);
                    expect(speakerEvent.dynamicRemoteCameras).toBe(<VidyoRemoteCamera[]>remoteCameras);
                });

                // Act
                service.eventHandler.participant.onDynamicChanged(participants, remoteCameras);
            });

            it('onLoudestChanged raises participant event', () => {
                // Arrenge
                const service = new VideoClientService();
                const participant = { id: 'participant1' };

                service.getParticipants().subscribe(speakerEvent => {
                    // Assert
                    expect(speakerEvent.type).toBe('loudestchanged');
                    expect(speakerEvent.participant.id).toBe('participant1');
                    expect(speakerEvent.audioOnly).toBeTruthy();
                });

                // Act
                service.eventHandler.participant.onLoudestChanged(participant, true);
            });
        });
    });
});
