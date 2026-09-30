import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Deterministic canonical JSON stringifier (sorted keys, stable spacing)
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJson).join(',') + ']';
  }

  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map(k => `${JSON.stringify(k)}:${canonicalizeJson((obj as Record<string, unknown>)[k])}`);
  return '{' + pairs.join(',') + '}';
}

export function computeSha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export interface KeyPair {
  publicKeyDerHex: string;
  privateKeyDerHex: string;
}

const KEYS_FILE = path.resolve(process.cwd(), 'server', 'keys', 'demo_ed25519.json');

export function getOrCreateKeyPair(): { publicKey: crypto.KeyObject; privateKey: crypto.KeyObject; publicKeyHex: string } {
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const raw = fs.readFileSync(KEYS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const publicKey = crypto.createPublicKey({
        key: Buffer.from(parsed.publicKeyDerHex, 'hex'),
        format: 'der',
        type: 'spki'
      });
      const privateKey = crypto.createPrivateKey({
        key: Buffer.from(parsed.privateKeyDerHex, 'hex'),
        format: 'der',
        type: 'pkcs8'
      });
      return { publicKey, privateKey, publicKeyHex: parsed.publicKeyDerHex };
    }
  } catch (err) {
    console.warn('[Crypto] Could not read existing keypair, regenerating local demo keypair:', err);
  }

  // Generate new Ed25519 keypair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const pubDer = publicKey.export({ type: 'spki', format: 'der' });
  const privDer = privateKey.export({ type: 'pkcs8', format: 'der' });

  const dir = path.dirname(KEYS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    KEYS_FILE,
    JSON.stringify(
      {
        publicKeyDerHex: pubDer.toString('hex'),
        privateKeyDerHex: privDer.toString('hex'),
        generatedAt: new Date().toISOString(),
        note: 'LOCAL DEMO ED25519 SIGNING KEYPAIR — NOT A GOVERNMENT-CERTIFIED HARDWARE KEY'
      },
      null,
      2
    ),
    'utf-8'
  );

  return { publicKey, privateKey, publicKeyHex: pubDer.toString('hex') };
}

export function signPayload(payloadStr: string): { digest: string; signatureHex: string; publicKeyHex: string } {
  const { privateKey, publicKeyHex } = getOrCreateKeyPair();
  const digest = computeSha256(payloadStr);
  const sig = crypto.sign(null, Buffer.from(payloadStr, 'utf-8'), privateKey);
  return {
    digest,
    signatureHex: sig.toString('hex'),
    publicKeyHex
  };
}

export function verifyPayloadSignature(
  payloadStr: string,
  signatureHex: string,
  publicKeyHex?: string
): { isValid: boolean; digest: string } {
  const digest = computeSha256(payloadStr);
  try {
    let keyObj: crypto.KeyObject;
    if (publicKeyHex) {
      keyObj = crypto.createPublicKey({
        key: Buffer.from(publicKeyHex, 'hex'),
        format: 'der',
        type: 'spki'
      });
    } else {
      keyObj = getOrCreateKeyPair().publicKey;
    }

    const isValid = crypto.verify(
      null,
      Buffer.from(payloadStr, 'utf-8'),
      keyObj,
      Buffer.from(signatureHex, 'hex')
    );
    return { isValid, digest };
  } catch (err) {
    return { isValid: false, digest };
  }
}
