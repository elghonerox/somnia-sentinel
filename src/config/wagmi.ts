// src/config/wagmi.ts
import { http, createConfig } from 'wagmi';
import { metaMask } from 'wagmi/connectors';

// Define Somnia Testnet
export const somniaTestnet = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: { http: ['https://dream-rpc.somnia.network/'] },
    public: { http: ['https://dream-rpc.somnia.network/'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://shannon-explorer.somnia.network' },
  },
} as const;

export const config = createConfig({
  chains: [somniaTestnet],
  connectors: [
    metaMask(), // Use metaMask from wagmi/connectors
  ],
  transports: {
    [somniaTestnet.id]: http('https://dream-rpc.somnia.network/'),
  },
});