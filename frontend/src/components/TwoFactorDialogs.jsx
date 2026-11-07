import { useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, ShieldCheck, ShieldOff } from 'lucide-react';
import { api } from '../api/client.js';
import { useToast } from './Toast.jsx';
import Modal from './Modal.jsx';
import OtpInput from './forms/OtpInput.jsx';

/*
 * 2FA įjungimas: 1) serveris sugeneruoja slaptą raktą, 2) parodome QR kodą,
 * 3) naudotojas nuskenuoja jį Google/Microsoft Authenticator programėle ir įveda 6 skaitmenų kodą.
 */
export function EnableTwoFactorDialog({ open, onClose, onEnabled }) {
  const toast = useToast();
  const [setup, setSetup] = useState(null); // { secret, qr }
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function close() {
    setSetup(null);
    setCode('');
    setError('');
    onClose();
  }

  async function startSetup() {
    setBusy(true);
    try {
      const result = await api('/auth/two-factor', { method: 'POST' });
      const qr = await QRCode.toDataURL(result.data.otpauth_url, {
        margin: 1,
        width: 220,
        color: { dark: '#17130e', light: '#fbf6ec' },
      });
      setSetup({ secret: result.data.secret, qr });
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function confirm(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/auth/two-factor/confirm', { method: 'POST', body: { code } });
      toast.success('Two-factor authentication is on. Your seat is reserved.');
      close();
      onEnabled();
    } catch (requestError) {
      setError(requestError.errors?.code?.[0] || requestError.message);
      setCode('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title="Two-factor authentication" kicker="Security" onClose={close}>
      {!setup ? (
        <div className="twofa">
          <p>
            Protect your account with a 6-digit code from an authenticator app
            (Google Authenticator, Microsoft Authenticator, 1Password…) every time you log in.
          </p>
          <div className="form-actions">
            <button type="button" className="btn" onClick={close}>Not now</button>
            <button type="button" className="btn btn--primary" onClick={startSetup} disabled={busy}>
              <QrCode aria-hidden="true" /> {busy ? 'Generating…' : 'Generate QR code'}
            </button>
          </div>
        </div>
      ) : (
        <form className="twofa" onSubmit={confirm}>
          <ol className="twofa__steps">
            <li>Scan this code with your authenticator app.</li>
            <li>Enter the 6-digit code the app shows.</li>
          </ol>
          <img className="twofa__qr" src={setup.qr} alt="QR code for the authenticator app" />
          <p className="twofa__secret">
            Can&apos;t scan? Enter this key manually: <code>{setup.secret}</code>
          </p>
          <OtpInput value={code} onChange={setCode} />
          {error && <p className="field__error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn" onClick={close}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={busy || code.length !== 6}>
              <ShieldCheck aria-hidden="true" /> Turn on 2FA
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export function DisableTwoFactorDialog({ open, onClose, onDisabled }) {
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function close() {
    setCode('');
    setError('');
    onClose();
  }

  async function disable(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/auth/two-factor', { method: 'DELETE', body: { code } });
      toast.info('Two-factor authentication was turned off.');
      close();
      onDisabled();
    } catch (requestError) {
      setError(requestError.errors?.code?.[0] || requestError.message);
      setCode('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title="Turn off 2FA?" kicker="Security" onClose={close} size="sm">
      <form className="twofa" onSubmit={disable}>
        <p>Enter a current code from your authenticator app to confirm.</p>
        <OtpInput value={code} onChange={setCode} />
        {error && <p className="field__error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn" onClick={close}>Keep it on</button>
          <button type="submit" className="btn btn--danger" disabled={busy || code.length !== 6}>
            <ShieldOff aria-hidden="true" /> Turn off
          </button>
        </div>
      </form>
    </Modal>
  );
}
