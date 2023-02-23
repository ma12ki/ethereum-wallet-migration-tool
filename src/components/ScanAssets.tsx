import { Button } from 'antd';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { useScanAssets } from '../hooks';

export default function ScanAssets() {
  const { address, isConnected } = useAccount();
  const { scan, loaded, loading } = useScanAssets();

  const handleScan = useCallback(() => {
    scan(address!);
  }, []);

  return (
    <div className="ScanAssets">
      {!loaded && (
        <Button size="large" type="primary" onClick={handleScan} loading={loading} disabled={!isConnected}>
          Scan Wallet
        </Button>
      )}
    </div>
  );
}
