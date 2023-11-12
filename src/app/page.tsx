'use client';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import LotteryApp from '@/segments/app';
import './global.css';

// 1. Get projectId
const projectId = '8490fab7b40aa0caf54f82279ba60eba';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://mainnet.infura.io/v3/c',
};

const testnet = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl:
    'https://eth-sepolia.g.alchemy.com/v2/tGANUOTeFHG7vL3CjCJdqN61iU02WZP3',
};

const localnet = {
  chainId: 31337,
  currency: 'GO',
  name: 'Hardhat',
  explorerUrl: '',
  rpcUrl: 'http://127.0.0.1:8545/',
};

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'http://localhost:3000',
  icons: ['https://avatars.mywebsite.com/'],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet, testnet, localnet],
  projectId,
});

export default function App() {
  return <LotteryApp />;
}
