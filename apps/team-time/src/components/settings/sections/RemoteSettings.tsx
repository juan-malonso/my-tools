import React, { useState } from 'react';
import { FormField, Input } from '@component/forms';

import { CloudIcon } from '@/components';
import { type Config } from '@/models';

interface RemoteSettingsProps {
  version: number;
  setVersion: (version: number) => void;
  onConfigChange: (newConfig: Config) => void;
  onConfigExport: () => { payload: string; version: number };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function deriveDeterministicId(username: string, key: CryptoKey): Promise<string> {
  const enc = new TextEncoder();
  const rawKey = await window.crypto.subtle.exportKey('raw', key);
  const hmacKey = await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await window.crypto.subtle.sign('HMAC', hmacKey, enc.encode(username));
  return arrayBufferToBase64(signature);
}

async function encrypt(data: string, key: CryptoKey): Promise<string> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(data)
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return arrayBufferToBase64(combined.buffer);
}

async function decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
  const data = new Uint8Array(base64ToArrayBuffer(encryptedData));
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);

  const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

export const RemoteSettings: React.FC<RemoteSettingsProps> = ({
  version,
  setVersion,
  onConfigChange,
  onConfigExport
}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'download' | 'upload' | null>(null);

  const performUpload = async (key: CryptoKey) => {
    const hmacId = await deriveDeterministicId(username, key);
    const previousVersion = version;
    const { payload, version: exportedVersion } = onConfigExport();
    const encryptedText = await encrypt(payload, key);

    const response = await fetch('/api/remote', {
      method: 'POST',
      headers: {
        ['Content-Type']: 'application/json',
        ['X-Config-Version']: exportedVersion.toString()
      },
      body: JSON.stringify({
        id: hmacId,
        text: encryptedText
      })
    });

    if (response.ok) {
      setSuccess('Configuration uploaded successfully!');
    } else {
      setVersion(previousVersion); // Revert optimistic update
      const errorData = (await response.json()) as { error?: string; remoteVersion?: number };
      if (response.status === 409 && errorData.remoteVersion !== undefined) {
        setError(
          `Conflict: The currently saved version (v${errorData.remoteVersion.toString()}) is higher than your current version (v${previousVersion.toString()}). It is recommended to export as JSON and perform a merge.`
        );
      } else {
        setError(`Upload failed: ${errorData.error ?? response.statusText}`);
      }
    }
  };

  const performDownload = async (key: CryptoKey) => {
    const hmacId = await deriveDeterministicId(username, key);

    const response = await fetch('/api/remote', {
      method: 'GET',
      headers: { id: hmacId }
    });

    if (response.ok) {
      const data = (await response.json()) as { content: string };
      const decryptedText = await decrypt(data.content, key);
      const newConfig = JSON.parse(decryptedText) as Config;
      setSuccess('Configuration downloaded successfully!');
      onConfigChange(newConfig);
    } else {
      const errorData = (await response.json()) as { error?: string };
      setError(`Download failed: ${errorData.error ?? response.statusText}`);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || !username || !password) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const key = await deriveKey(password, username);

      if (pendingAction === 'upload') {
        await performUpload(key);
      } else {
        await performDownload(key);
      }
    } catch (err) {
      console.error('Crypto error:', err);
      setError('Error: Check your credentials. Decryption might have failed.');
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
          <CloudIcon className="w-6 h-6 text-sky-500" />
          Remote Configuration
        </h3>
      </div>
      <hr className="border-slate-600" />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-slate-300">Credentials</h3>
              <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-sky-900/30 text-sky-400 rounded-full border border-sky-800/50">
                current v{version.toString()}
              </span>
            </div>
            <CredentialsForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
            <div className="flex justify-between items-center p-2 mt-2 min-h-12">
              <StatusMessages error={error} success={success} />
              <div className="flex justify-end gap-4 shrink-0">
                <button
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  onClick={() => {
                    setPendingAction('upload');
                  }}
                  disabled={!username.trim() || !password.trim() || isLoading}
                >
                  {isLoading && pendingAction === 'upload' ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  onClick={() => {
                    setPendingAction('download');
                  }}
                  disabled={!username.trim() || !password.trim() || isLoading}
                >
                  {isLoading && pendingAction === 'download' ? 'Downloading...' : 'Download'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        action={pendingAction}
        isLoading={isLoading}
        onCancel={() => {
          setPendingAction(null);
        }}
        onConfirm={() => void handleConfirmAction()}
      />
    </div>
  );
};

const CredentialsForm: React.FC<{
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}> = ({ username, setUsername, password, setPassword }) => (
  <div className="grid grid-cols-2 gap-6 p-2">
    <FormField label="Username">
      <Input
        type="text"
        size="sm"
        value={username}
        placeholder="Enter username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
    </FormField>
    <FormField label="Password">
      <Input
        type="password"
        size="sm"
        value={password}
        placeholder="Enter password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
    </FormField>
  </div>
);

const StatusMessages: React.FC<{ error: string | null; success: string | null }> = ({
  error,
  success
}) => (
  <div className="flex-1 mr-4">
    {error && (
      <div className="text-sm font-medium text-red-400 bg-red-400/10 px-3 py-2 rounded border border-red-400/20">
        {error}
      </div>
    )}
    {success && (
      <div className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded border border-emerald-400/20">
        {success}
      </div>
    )}
  </div>
);

const ConfirmModal: React.FC<{
  action: 'download' | 'upload' | null;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ action, isLoading, onCancel, onConfirm }) => {
  if (!action) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Action</h3>
        <p className="text-slate-300 mb-6">
          Are you sure you want to {action} with these credentials?
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-slate-300 disabled:opacity-50"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-50"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
