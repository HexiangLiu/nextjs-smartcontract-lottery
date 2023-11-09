import { useCallback, useEffect, useState } from 'react';
import { Layout, Button, message } from 'antd';
import {
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from '@web3modal/ethers5/react';
import { Contract, ethers } from 'ethers';
import abi from '@/constants/abi.json';
import contractAddress from '@/constants/contractAddress.json';

const { Content } = Layout;

const ContentWrapper = () => {
  const [entranceFee, setEntranceFee] = useState<string>('0');
  const [contract, setContract] = useState<Contract>();
  const [numPlayer, setNumPlayer] = useState<string>('0');
  const [recentWinner, setRecentWinner] = useState<string>('0');
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { signer } = useWeb3ModalSigner();
  //@ts-ignore
  const raffleAddress = contractAddress[chainId];

  const init = useCallback(async () => {
    if (!isConnected) return;
    if (raffleAddress) {
      const contract = new ethers.Contract(raffleAddress, abi, signer);
      setContract(contract);
      const entranceFee = await contract.getEntrancFee();
      const numPlayer = await contract.getNumberOfPlayers();
      const recentWinner = await contract.getRecentWinner();
      setNumPlayer(numPlayer.toString());
      setRecentWinner(recentWinner);
      setEntranceFee(ethers.utils.formatUnits(entranceFee));
      contract.on('WinnerPicked', () => {
        init();
      });
    } else {
      message.error('No Contract Found!');
    }
  }, [isConnected, chainId]);

  const enterRaffle = async () => {
    try {
      const transRes = await contract?.enterRaffle({
        value: ethers.utils.parseEther(entranceFee),
      });
      await transRes.wait(1);
      message.success('Transaction Completed');
      init();
    } catch (e) {
      console.error(e);
      message.error('Transaction Declined');
    }
  };

  useEffect(() => {
    init();
    return () => {
      contract?.removeAllListeners();
    };
  }, [init]);

  return (
    <Content>
      <div>Contract Address: {address}</div>
      {raffleAddress && (
        <div>
          <div>EntranceFee: {entranceFee}ETH</div>
          <div>Number Of Players: {numPlayer}</div>
          <div>Recent Winner: {recentWinner}</div>
          <Button type='primary' onClick={enterRaffle}>
            EnterRaffle
          </Button>
        </div>
      )}
    </Content>
  );
};

export default ContentWrapper;
