import { VidyoClient } from './vidyo-client';
import { VidyoClientState } from '.';

describe('VidyoClient', () => {
    describe('connect', () => {
        it('returns the saved state when vidyo client is already initialize', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            vidyoClient.vidyoClientState = <VidyoClientState>{ state: 'READY' };

            // Act + Assert
            vidyoClient.connect({ webrtc: true, plugin: false }).then(vidyoClientState => {
                expect(vidyoClientState.state).toBe('READY');
            });
        });
    });

    describe('getConnectState', () => {
        it('returns status of vidyo client', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            vidyoClient.vidyoClientState = <VidyoClientState>{ state: 'READY' };

            // Act + Assert
            vidyoClient.getConnectState().then(vidyoClientState => {
                expect(vidyoClientState.state).toBe('READY');
            });
        });
    });

    describe('createVidyoConnector', () => {
        it('creates a new connector object', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            vidyoClient.vidyoClient = <any>{
                CreateVidyoConnector() {
                    return Promise.resolve({});
                }
            };

            // Act + Assert
            vidyoClient
                .createVidyoConnector({
                    viewId: null,
                    viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default',
                    remoteParticipants: 25,
                    logFileFilter: undefined,
                    logFileName: undefined,
                    userData: null
                })
                .then(() => {
                    expect(vidyoClient.vidyoConnector).toBeDefined();
                });
        });

        it('returns connector which is already defined', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            const vidyoConnector = <any>{ Connect: Function };
            vidyoClient.vidyoConnector = vidyoConnector;

            // Act + Assert
            vidyoClient
                .createVidyoConnector({
                    viewId: null,
                    viewStyle: 'VIDYO_CONNECTORVIEWSTYLE_Default',
                    remoteParticipants: 25,
                    logFileFilter: undefined,
                    logFileName: undefined,
                    userData: null
                })
                .then(vc => expect(vc).toBe(vidyoConnector));
        });
    });

    describe('getClientStatusGlobal', () => {
        it('returns status vidyo client state', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            vidyoClient.vidyoClientState = <VidyoClientState>{ state: 'READY' };

            // Act + Assert
            vidyoClient.getClientStatusGlobal().then(vidyoClientState => {
                expect(vidyoClientState.state).toBe('READY');
            });
        });

        it('returns error with state FAILED', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            window['VCUtils'] = { params: { webrtc: true } };

            // Act + Assert
            vidyoClient.getClientStatusGlobal().catch(error => {
                expect(error).toBe('error');
            });

            vidyoClient.vidyoClientReadyStateChanged({ state: 'FAILED', description: 'error' });
        });

        it('returns error with state FAILEDVERSION', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            window['VCUtils'] = { params: { webrtc: true } };

            // Act + Assert
            vidyoClient.getClientStatusGlobal().catch(error => {
                expect(error).toBe('error');
            });

            vidyoClient.vidyoClientReadyStateChanged({ state: 'FAILEDVERSION', description: 'error' });
        });
    });

    describe('vidyoClientReadyStateChanged', () => {
        it('sets vidyo client state', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            window['VCUtils'] = { params: { webrtc: true } };
            vidyoClient.getClientStatusGlobal();

            // Act
            vidyoClient.vidyoClientReadyStateChanged({ state: 'a-state' });

            // Assert
            expect(vidyoClient.vidyoClientState.state).toBe('a-state');
        });

        it('returns true', () => {
            // Arrange
            const vidyoClient = new VidyoClient();
            window['VCUtils'] = { params: { webrtc: true } };

            // Act + Assert
            expect(vidyoClient.vidyoClientReadyStateChanged({})).toBeTruthy();
        });
    });
});
