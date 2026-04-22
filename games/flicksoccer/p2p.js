/**
 * p2p.js — Minimal WebRTC DataChannel library with built-in UI
 *
 * Usage:
 *   const p2p = new P2P();
 *   p2p.onConnected(() => console.log('connected'));
 *   p2p.onMessage((msg) => console.log('received:', msg));
 *   p2p.send('hello!');
 */

class P2P {
    constructor() {
        this._pc = null;
        this._dc = null;
        this._isHost = false;
        this._onConnectedCb = null;
        this._onMessageCb = null;
        this._onDisconnectedCb = null;

        this._injectStyles();
        this._createOverlay();
        this._renderRoleScreen();
    }

    // ── Public API ──────────────────────────────────────────────────────────────

    onConnected(cb) { this._onConnectedCb = cb; }
    onMessage(cb) { this._onMessageCb = cb; }
    onDisconnected(cb) { this._onDisconnectedCb = cb; }

    send(msg) {
        if (this._dc && this._dc.readyState === 'open') {
            this._dc.send(msg);
        } else {
            console.warn('P2P: not connected yet.');
        }
    }

    isConnected() {
        return !!(this._dc && this._dc.readyState === 'open');
    }

    // ── Overlay ─────────────────────────────────────────────────────────────────

    _createOverlay() {
        this._overlay = document.createElement('div');
        this._overlay.id = 'p2p-overlay';
        document.body.appendChild(this._overlay);
    }

    _hideUI() {
        this._overlay.style.display = 'none';
    }

    _setStatus(msg, type = '') {
        const el = this._overlay.querySelector('.p2p-status');
        if (!el) return;
        el.textContent = msg;
        el.className = 'p2p-status ' + type;
    }

    // ── ICE / WebRTC ────────────────────────────────────────────────────────────

    _iceConfig() {
        return {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
    }

    _waitForIce(pc) {
        return new Promise(resolve => {
            if (pc.iceGatheringState === 'complete') {
                resolve(btoa(JSON.stringify(pc.localDescription)));
                return;
            }
            pc.onicegatheringstatechange = () => {
                if (pc.iceGatheringState === 'complete') {
                    resolve(btoa(JSON.stringify(pc.localDescription)));
                }
            };
        });
    }

    _decode(str) {
        return JSON.parse(atob(str.trim()));
    }

    _setupChannel(channel) {
        this._dc = channel;
        this._dc.onopen = () => {
            this._hideUI();
            this._onConnectedCb && this._onConnectedCb(this._isHost);
        };
        this._dc.onclose = () => {
            this._onDisconnectedCb && this._onDisconnectedCb();
        };
        this._dc.onmessage = (e) => {
            this._onMessageCb && this._onMessageCb(e.data);
        };
    }

    // ── Host flow ───────────────────────────────────────────────────────────────

    async _startHost() {
        this._pc = new RTCPeerConnection(this._iceConfig());
        this._setupChannel(this._pc.createDataChannel('p2p'));
        this._pc.onconnectionstatechange = () => {
            if (this._pc.connectionState === 'failed')
                this._setStatus('❌ Connection failed.', 'error');
        };

        const offer = await this._pc.createOffer();
        await this._pc.setLocalDescription(offer);
        this._setStatus('Gathering candidates…', 'pending');

        const code = await this._waitForIce(this._pc);
        this._renderHostStep2(code);
    }

    async _setAnswer(code) {
        try {
            await this._pc.setRemoteDescription(this._decode(code));
            this._setStatus('Waiting for connection…', 'pending');
        } catch (e) {
            this._setStatus('❌ Invalid answer code.', 'error');
            console.error(e);
        }
    }

    // ── Join flow ───────────────────────────────────────────────────────────────

    async _processOffer(code) {
        try {
            this._pc = new RTCPeerConnection(this._iceConfig());
            this._pc.ondatachannel = (e) => this._setupChannel(e.channel);
            this._pc.onconnectionstatechange = () => {
                if (this._pc.connectionState === 'failed')
                    this._setStatus('❌ Connection failed.', 'error');
            };

            await this._pc.setRemoteDescription(this._decode(code));
            const answer = await this._pc.createAnswer();
            await this._pc.setLocalDescription(answer);
            this._setStatus('Gathering candidates…', 'pending');

            const answerCode = await this._waitForIce(this._pc);
            this._renderJoinStep2(answerCode);
        } catch (e) {
            this._setStatus('❌ Invalid offer code.', 'error');
            console.error(e);
        }
    }

    // ── UI rendering ────────────────────────────────────────────────────────────

    _renderRoleScreen() {
        this._overlay.innerHTML = `
      <div class="p2p-box">
        <div class="p2p-title">P2P Connect</div>
        <div class="p2p-row">
          <button class="p2p-btn" id="p2p-host-btn">Host</button>
          <button class="p2p-btn" id="p2p-join-btn">Join</button>
        </div>
        <div class="p2p-status"></div>
      </div>
    `;
        this._overlay.querySelector('#p2p-host-btn').addEventListener('click', () => {
            this._isHost = true;
            this._renderHostStep1();
            this._startHost();
        });
        this._overlay.querySelector('#p2p-join-btn').addEventListener('click', () => {
            this._isHost = false;
            this._renderJoinStep1();
        });
    }

    _renderHostStep1() {
        this._overlay.innerHTML = `
      <div class="p2p-box">
        <div class="p2p-title">Host</div>
        <div class="p2p-status pending">Generating offer…</div>
      </div>
    `;
    }

    _renderHostStep2(offerCode) {
        this._overlay.innerHTML = `
      <div class="p2p-box">
        <div class="p2p-title">Host</div>
        <label class="p2p-label">① Copy and send this to the other person:</label>
        <div class="p2p-code-wrap">
          <textarea class="p2p-code" readonly>${offerCode}</textarea>
          <button class="p2p-copy-btn" id="p2p-copy-offer">Copy</button>
        </div>
        <label class="p2p-label">② Paste their answer here:</label>
        <textarea class="p2p-input" id="p2p-answer-input" placeholder="Paste answer…"></textarea>
        <button class="p2p-btn" id="p2p-connect-btn">Connect</button>
        <div class="p2p-status"></div>
      </div>
    `;
        this._overlay.querySelector('#p2p-copy-offer').addEventListener('click', (e) => {
            navigator.clipboard.writeText(offerCode);
            e.target.textContent = 'Copied!';
            setTimeout(() => e.target.textContent = 'Copy', 1500);
        });
        this._overlay.querySelector('#p2p-connect-btn').addEventListener('click', () => {
            const code = this._overlay.querySelector('#p2p-answer-input').value.trim();
            if (code) this._setAnswer(code);
        });
    }

    _renderJoinStep1() {
        this._overlay.innerHTML = `
      <div class="p2p-box">
        <div class="p2p-title">Join</div>
        <label class="p2p-label">① Paste the host's offer code:</label>
        <textarea class="p2p-input" id="p2p-offer-input" placeholder="Paste offer…"></textarea>
        <button class="p2p-btn" id="p2p-answer-btn">Generate Answer</button>
        <div class="p2p-status"></div>
      </div>
    `;
        this._overlay.querySelector('#p2p-answer-btn').addEventListener('click', () => {
            const code = this._overlay.querySelector('#p2p-offer-input').value.trim();
            if (code) this._processOffer(code);
        });
    }

    _renderJoinStep2(answerCode) {
        this._overlay.innerHTML = `
      <div class="p2p-box">
        <div class="p2p-title">Join</div>
        <label class="p2p-label">② Copy this and send it back to the host:</label>
        <div class="p2p-code-wrap">
          <textarea class="p2p-code" readonly>${answerCode}</textarea>
          <button class="p2p-copy-btn" id="p2p-copy-answer">Copy</button>
        </div>
        <div class="p2p-status pending">Waiting for host to connect…</div>
      </div>
    `;
        this._overlay.querySelector('#p2p-copy-answer').addEventListener('click', (e) => {
            navigator.clipboard.writeText(answerCode);
            e.target.textContent = 'Copied!';
            setTimeout(() => e.target.textContent = 'Copy', 1500);
        });
    }

    // ── Styles ──────────────────────────────────────────────────────────────────

    _injectStyles() {
        if (document.getElementById('p2p-styles')) return;
        const style = document.createElement('style');
        style.id = 'p2p-styles';
        style.textContent = `
      #p2p-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
      .p2p-box {
        font-family: monospace;
        background: #111;
        border: 1px solid #333;
        padding: 28px;
        width: 100%;
        max-width: 420px;
        color: #eee;
        box-sizing: border-box;
        margin: 16px;
      }
      .p2p-title {
        font-size: 1rem;
        font-weight: bold;
        color: #0f0;
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .p2p-label {
        display: block;
        font-size: 0.76rem;
        color: #888;
        margin: 14px 0 6px;
      }
      .p2p-row {
        display: flex;
        gap: 10px;
      }
      .p2p-btn {
        padding: 9px 20px;
        background: #1a1a1a;
        color: #0f0;
        border: 1px solid #0f0;
        font-family: monospace;
        font-size: 0.88rem;
        cursor: pointer;
        margin-top: 12px;
      }
      .p2p-btn:hover { background: #0f0; color: #111; }
      .p2p-code-wrap { position: relative; }
      .p2p-code {
        width: 100%;
        background: #0a0a0a;
        color: #0f0;
        border: 1px solid #2a2a2a;
        font-family: monospace;
        font-size: 0.7rem;
        padding: 8px 64px 8px 8px;
        resize: none;
        height: 68px;
        box-sizing: border-box;
      }
      .p2p-copy-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        padding: 4px 10px;
        background: #222;
        color: #0f0;
        border: 1px solid #0f0;
        font-family: monospace;
        font-size: 0.72rem;
        cursor: pointer;
      }
      .p2p-copy-btn:hover { background: #0f0; color: #111; }
      .p2p-input {
        width: 100%;
        background: #0a0a0a;
        color: #eee;
        border: 1px solid #333;
        font-family: monospace;
        font-size: 0.78rem;
        padding: 8px;
        height: 68px;
        resize: none;
        box-sizing: border-box;
      }
      .p2p-status {
        margin-top: 14px;
        font-size: 0.8rem;
        min-height: 1.2em;
        color: #555;
      }
      .p2p-status.pending { color: #fa0; }
      .p2p-status.error   { color: #f44; }
    `;
        document.head.appendChild(style);
    }
}
