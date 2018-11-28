import { VideoClientService } from './video-client.service';

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
});
