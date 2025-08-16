import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server';
import { v4 as uuidv4 } from 'uuid';

const rpName = 'Catalyst IA';
const rpID = process.env.NODE_ENV === 'production' 
  ? process.env.REPLIT_DEV_DOMAIN?.replace('https://', '') || 'localhost'
  : 'localhost';
const origin = process.env.NODE_ENV === 'production'
  ? `https://${rpID}`
  : `http://localhost:5000`;

export interface WebAuthnCredential {
  id: string;
  userId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceType: string;
  backedUp: boolean;
  transports?: string;
  name?: string;
}

export async function generateRegistrationOpts(userId: string, username: string, storage: any) {
  // Get existing credentials for this user
  const existingCredentials = await storage.getWebAuthnCredentials(userId);
  
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: username,
    attestationType: 'none',
    excludeCredentials: existingCredentials.map(cred => ({
      id: Buffer.from(cred.credentialId, 'base64'),
      type: 'public-key',
      transports: cred.transports ? JSON.parse(cred.transports) : undefined,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
  });

  return options;
}

export async function verifyRegistrationOpts(
  userId: string,
  response: any,
  expectedChallenge: string,
  storage: any,
  deviceName?: string
) {
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credentialPublicKey, credentialID, counter, credentialBackedUp, credentialDeviceType } = verification.registrationInfo;

    // Save the credential to database
    const credential: WebAuthnCredential = {
      id: uuidv4(),
      userId,
      credentialId: Buffer.from(credentialID).toString('base64'),
      publicKey: Buffer.from(credentialPublicKey).toString('base64'),
      counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      name: deviceName || 'Dispositivo Biométrico',
    };

    await storage.saveWebAuthnCredential(credential);

    // Enable biometric authentication for the user
    await storage.updateUserBiometric(userId, true);
  }

  return verification;
}

export async function generateAuthenticationOpts(storage: any, userId?: string) {
  let allowCredentials: any[] | undefined;

  if (userId) {
    const userCredentials = await storage.getWebAuthnCredentials(userId);
    allowCredentials = userCredentials.map(cred => ({
      id: Buffer.from(cred.credentialId, 'base64'),
      type: 'public-key',
      transports: cred.transports ? JSON.parse(cred.transports) : undefined,
    }));
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: 'preferred',
  });

  return options;
}

export async function verifyAuthenticationOpts(
  response: any,
  expectedChallenge: string,
  storage: any,
  userId?: string
) {
  // Get the credential from database
  const credentialID = Buffer.from(response.id, 'base64url').toString('base64');
  const credential = await storage.getWebAuthnCredential(credentialID);
  
  if (!credential) {
    throw new Error('Credencial não encontrada');
  }

  if (userId && credential.userId !== userId) {
    throw new Error('Credencial não pertence ao usuário');
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: Buffer.from(credential.credentialId, 'base64'),
      credentialPublicKey: Buffer.from(credential.publicKey, 'base64'),
      counter: credential.counter,
      transports: credential.transports ? JSON.parse(credential.transports) : undefined,
    },
    requireUserVerification: true,
  });

  if (verification.verified) {
    // Update counter
    await storage.updateWebAuthnCredentialCounter(credential.credentialId, verification.authenticationInfo.newCounter);
  }

  return {
    verified: verification.verified,
    userId: credential.userId,
    credentialId: credential.credentialId,
  };
}

export async function deleteWebAuthnCredential(userId: string, credentialId: string, storage: any) {
  await storage.deleteWebAuthnCredential(userId, credentialId);
  
  // Check if user has any remaining credentials
  const remainingCredentials = await storage.getWebAuthnCredentials(userId);
  if (remainingCredentials.length === 0) {
    await storage.updateUserBiometric(userId, false);
  }
}