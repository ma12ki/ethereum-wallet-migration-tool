import { Button, Checkbox, Form, Input, Spin } from 'antd';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { useMigrateAssets, useScanAssets, useSelectAssets } from '../hooks';
import { MigrationStatus } from '../types';
import EtherscanLink from './EtherscanLink';

export default function MigrateAssets() {
  const { address, isConnected } = useAccount();
  const { assets } = useSelectAssets();
  const { assetMigrations, loading, migrate } = useMigrateAssets();
  const [form] = Form.useForm();

  const handleMigrate = useCallback(async () => {
    const { targetAddress, migrateEth } = await form.validateFields();

    await migrate({
      assets,
      sourceAddress: address!,
      targetAddress,
      migrateEth,
    });
  }, [address]);

  return (
    <div className="MigrateAssets">
      {assets.length > 0 && (
        <Form form={form}>
          <Form.Item name="targetAddress" rules={[{ required: true }]}>
            <Input type="text" placeholder="Target address" />
          </Form.Item>
          <Form.Item name="migrateEth">
            <Checkbox>Migrate ETH too</Checkbox>
          </Form.Item>
          <Button size="large" type="primary" onClick={handleMigrate} loading={loading} disabled={loading}>
            Migrate
          </Button>
        </Form>
      )}
      <div className="Migrations">
        {assetMigrations.map((asset) => (
          <div>
            <EtherscanLink hash={asset.address} type="address">
              {asset.name}
            </EtherscanLink>{' '}
            <MigrationStatusIcon status={asset.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MigrationStatusIcon({ status, txHash }: { status: MigrationStatus; txHash?: string }) {
  const statusIcon = useMemo(() => {
    switch (status) {
      case 'pending': {
        return <span>🕒</span>;
      }
      case 'migrating': {
        return <Spin />;
      }
      case 'migrated': {
        return (
          <EtherscanLink hash={txHash!} type="tx">
            ✅
          </EtherscanLink>
        );
      }
      case 'failed': {
        return (
          <EtherscanLink hash={txHash!} type="tx">
            ❌
          </EtherscanLink>
        );
      }
    }
  }, [status]);

  return statusIcon;
}
