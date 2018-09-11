import { VidyoClientState, VidyoConnector, VidyoClientInterface, ViewStyle, ScriptModel } from '.';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

const VC_StatusSubject = new Subject<VidyoClientState>();

export class VidyoClient {
    private VIDYOCLIENT = 'https://static.vidyo.io/4.1.22.9/javascript/VidyoClient/VidyoClient.js';
    private _scripts: ScriptModel[] = [];

    private _vidyoConnector: VidyoConnector;
    private _vidyoClientState: VidyoClientState;
    private _vidyoClient: VidyoClientInterface;

    constructor() { }

    public connect(options: { webrtc: boolean, plugin: boolean }): Promise<VidyoClientState> {
        if (this._vidyoClientState) {
            return Promise.resolve(this._vidyoClientState);
        } else {
            return this.loadVidyoClientScript(options);
        }
    }

    public getConnectState(): Promise<VidyoClientState> {
        return Promise.resolve(this._vidyoClientState);
    }

    public createVidyoConnector(options: {
        viewId: string | null,
        viewStyle: ViewStyle,
        remoteParticipants: number,
        logFileFilter: string,
        logFileName: string,
        userData: number
    }): Promise<VidyoConnector> {

        console.log('vidyo.createVidyoConnector', options);

        if (!this._vidyoConnector) {
            return this._vidyoClient.CreateVidyoConnector(options)
                .then(_response => {
                    this._vidyoConnector = _response;
                    return this._vidyoConnector;
                });
        } else {
            return Promise.resolve(this._vidyoConnector);
        }
    }

    private loadVidyoClientScript(options: { webrtc: boolean, plugin: boolean }): Promise<VidyoClientState> {
        console.log('vidyo.loadVidyoClientScript()', options);

        const webrtc = options.plugin ? false : true;
        const plugin = options.plugin || false;

        let webrtcLogLevel = '';
        if (webrtc) {
            // Set the WebRTC log level to either: 'info' (default), 'error', or 'none'
            webrtcLogLevel = '&webrtcLogLevel=error';
        }

        const win: any = window;
        win.vidyoClientReadyStateChanged = this.vidyoClientReadyStateChanged;
        // this is hack... we need a global handler for status and pollute global space
        const src = `${this.VIDYOCLIENT}?onload=vidyoClientReadyStateChanged&webrtc=${webrtc}&plugin=${plugin}${webrtcLogLevel}`;
        const vidyoClient: ScriptModel = { name: 'vidyoClient', src: src, loaded: false };

        return this.loadScript(vidyoClient)
            .then(_data => {
                console.log('vidyo.loadVidyoClientScript(): script loaded... wait for status', src);
                return this.getClientStatusGlobal();
            })
            .then(_state => {
                console.log('vidyo.loadVidyoClientScript(): vidyoClient is ready');
                this._vidyoClientState = _state;
                return this._vidyoClientState;
            });

    }

    private loadScript(script: ScriptModel): Promise<ScriptModel> {

        return new Promise<ScriptModel>((resolve, reject) => {

            const existingScript = this._scripts.find(s => {
                return s.name === script.name;
            });

            // Complete if already loaded
            if (existingScript && existingScript.loaded) {
                resolve(existingScript);
            } else {
                // Add the script
                this._scripts = [...this._scripts, script];

                // Load the script
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                scriptElement.src = script.src;
                scriptElement.async = true;
                scriptElement.onload = () => {
                    script.loaded = true;
                    resolve(script);
                };

                scriptElement.onerror = error => reject(error);

                document.getElementsByTagName('body')[0].appendChild(scriptElement);
            }
        });
    }

    private getClientStatusGlobal(): Promise<VidyoClientState> {

        return new Promise((resolve, reject) => {
            if (this._vidyoClientState) {
                resolve(this._vidyoClientState);
            } else {
                console.log('vidyo.getClientStatusGlobal(): waiting for window.VC to become available');
                let subscription: Subscription;

                subscription = VC_StatusSubject.subscribe((_status) => {
                    console.log('vidyo.getClientStatusGlobal(): status is available', _status);
                    this._vidyoClient = (window as any).VC;
                    this._vidyoClientState = _status;

                    switch (_status.state) {
                        case 'READY':    // The library is operating normally
                            subscription.unsubscribe();
                            resolve(this._vidyoClientState);
                            break;
                        case 'NOTAVAILABLE': // can happen on plugin loading
                        case 'RETRYING': // The library operating is temporarily paused
                            const timeOutSeconds: number = (_status as any).nextTimeout ? (_status as any).nextTimeout / 1000 : 0;
                            console.warn(`vidyo.getClientStatusGlobal(): ${_status.state} Temporarily unavailable retrying in
                                         ${timeOutSeconds} seconds`);
                            break;
                        case 'FAILED':   // The library operating has stopped
                        case 'FAILEDVERSION':   // The library operating has stopped
                            console.error(`vidyo.getClientStatusGlobal(): failure=> ${_status.state} ${_status.description}`);
                            subscription.unsubscribe();
                            reject(_status.description);

                    }
                });
            }
        });
    }

    private vidyoClientReadyStateChanged(status) {
        // this is the global handler that is triggered when the script is loaded
        // it may be triggered more than once in the case of a plugin
        console.log('vidyo.vidyoClientReadyStateChanged', status);
        status.webrtcExtensionPath = status.downloadPathWebRTCExtensionChrome || status.downloadPathWebRTCExtensionFirefox;
        status.webrtc = (window as any).VCUtils.params.webrtc;
        VC_StatusSubject.next(status);
        return true; // Return true to reload the plugins if not available
    }
}
