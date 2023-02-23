import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Typography } from 'antd';

import './styles.css';
import WalletProvider from './WalletProvider';
import { MigrateAssets, ScanAssets, SelectAssets } from './components';

export default function App(): JSX.Element {
  return (
    <WalletProvider>
      <div className="App">
        <Typography.Title level={3}>Ethereum Wallet Migration Tool</Typography.Title>
        <ConnectButton showBalance={true} />
        <br />
        <br />
        <ScanAssets />
        <br />
        <br />
        <SelectAssets />
        <br />
        <br />
        <MigrateAssets />
      </div>
    </WalletProvider>
  );
}
