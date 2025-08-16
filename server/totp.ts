import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export interface TOTPSetup {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export async function generateTOTPSecret(userId: string, email: string, storage: any): Promise<TOTPSetup> {
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `Catalyst IA (${email})`,
    issuer: 'Catalyst IA',
    length: 32,
  });

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  // Generate backup codes
  const backupCodes = generateBackupCodes();

  // Save secret temporarily (will be confirmed after verification)
  await storage.saveTempTOTPSecret(userId, secret.base32);

  return {
    secret: secret.base32,
    qrCode,
    manualEntryKey: secret.base32,
    backupCodes,
  };
}

export function verifyTOTPToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time windows before/after for clock drift
  });
}

export async function enableTOTP(userId: string, token: string, storage: any): Promise<boolean> {
  const tempSecret = await storage.getTempTOTPSecret(userId);
  if (!tempSecret) {
    throw new Error('Nenhuma configuração 2FA pendente encontrada');
  }

  if (!verifyTOTPToken(tempSecret, token)) {
    throw new Error('Código de verificação inválido');
  }

  // Save the secret permanently and enable 2FA
  await storage.saveTOTPSecret(userId, tempSecret);
  await storage.updateUser2FA(userId, true);
  await storage.deleteTempTOTPSecret(userId);

  return true;
}

export async function disableTOTP(userId: string, storage: any): Promise<void> {
  await storage.deleteTOTPSecret(userId);
  await storage.updateUser2FA(userId, false);
}

export async function verifyUserTOTP(userId: string, token: string, storage: any): Promise<boolean> {
  const secret = await storage.getTOTPSecret(userId);
  if (!secret) {
    return false;
  }

  return verifyTOTPToken(secret, token);
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character codes with mixed case and numbers
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

export async function regenerateBackupCodes(userId: string, storage: any): Promise<string[]> {
  const codes = generateBackupCodes();
  await storage.saveBackupCodes(userId, codes);
  return codes;
}

export async function verifyBackupCode(userId: string, code: string, storage: any): Promise<boolean> {
  const backupCodes = await storage.getBackupCodes(userId);
  if (!backupCodes.includes(code.toUpperCase())) {
    return false;
  }

  // Remove used backup code
  await storage.removeBackupCode(userId, code.toUpperCase());
  return true;
}