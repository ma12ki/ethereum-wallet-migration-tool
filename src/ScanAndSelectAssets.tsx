import { useAccount } from "wagmi";

export default function ScanAndSelectAssets() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {address} {isConnected}
    </div>
  );
}
