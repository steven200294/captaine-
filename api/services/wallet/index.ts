import { generateApplePass } from './apple-wallet';
import { generateGoogleWalletUrl } from './google-wallet';
import type { WalletPassData, WalletPassResult } from './types';

export type { WalletPassData, WalletPassResult };

export async function generateWalletPasses(data: WalletPassData): Promise<WalletPassResult> {
  const [applePassBuffer, googleWalletUrl] = await Promise.allSettled([
    generateApplePass(data),
    generateGoogleWalletUrl(data),
  ]);

  return {
    applePassBuffer:
      applePassBuffer.status === 'fulfilled' && applePassBuffer.value
        ? applePassBuffer.value
        : undefined,
    googleWalletUrl:
      googleWalletUrl.status === 'fulfilled' && googleWalletUrl.value
        ? googleWalletUrl.value
        : undefined,
  };
}
