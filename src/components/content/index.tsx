import { useCallback, useEffect, useState } from 'react';
import { Layout, Button, message, List } from 'antd';
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
  const [loading, setLoading] = useState<boolean>(false);
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
      setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    init();
    return () => {
      contract?.removeAllListeners();
    };
  }, [init]);

  return (
    <Content className='p-5'>
      {raffleAddress && (
        <List>
          <List.Item>Contract Address: {address}</List.Item>
          <List.Item>EntranceFee: {entranceFee}ETH</List.Item>
          <List.Item>Number Of Players: {numPlayer}</List.Item>
          <List.Item>Recent Winner: {recentWinner}</List.Item>
          <Button
            loading={loading}
            type='primary'
            onClick={enterRaffle}
            className='mt-2'
            size='large'
          >
            EnterRaffle
          </Button>
        </List>
      )}
    </Content>
  );
};

export default ContentWrapper;
