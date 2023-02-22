import { useAccount } from 'wagmi';

import { useScanAssets } from './hooks';

export default function ScanAndSelectAssets() {
  const { address, isConnected } = useAccount();
  const { assets } = useScanAssets();

  return (
    <div>
      {address} {isConnected}
    </div>
  );
}
