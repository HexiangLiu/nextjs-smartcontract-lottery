import { Layout } from 'antd';

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <div className='p-5 bg-black flex justify-between items-center'>
      <h1 className='text-white pl-2'>Decentralized Lottery</h1>
      <w3m-button />
    </div>
  );
};

export default CustomHeader;
