import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Typography, Button } from "antd";

import "./styles.css";
import WalletProvider from "./WalletProvider";
import ScanAndSelectAssets from "./ScanAndSelectAssets";

export default function App(): JSX.Element {
  return (
    <WalletProvider>
      <div className="App">
        <Typography.Title level={3}>Step 1: Connect</Typography.Title>
        <ConnectButton showBalance={false} />
        <Typography.Title level={3}>
          Step 2: Select assets to migrate
        </Typography.Title>
        <ScanAndSelectAssets />
      </div>
    </WalletProvider>
  );
}
