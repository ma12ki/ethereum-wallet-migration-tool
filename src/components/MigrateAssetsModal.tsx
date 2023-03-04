import { Modal, Spin } from 'antd';
import { useMemo } from 'react';

import { useMigrateAssets } from '../hooks';
import { MigrationStatus } from '../types';
import EtherscanLink from './EtherscanLink';

interface IProps {
  open: boolean;
}

export default function MigrateAssetsModal({ open }: IProps) {
  const { assetMigrations, loading, migrate } = useMigrateAssets();

  return (
    <div className="MigrateAssetsModal">
      <Modal title="Migration" open={open} closable={false} footer={null}>
        <div className="Migrations">
          <ol>
            {assetMigrations.map((asset) => (
              <li>
                <EtherscanLink hash={asset.address} type="address">
                  {asset.name}
                </EtherscanLink>{' '}
                <MigrationStatusIcon status={asset.status} />
              </li>
            ))}
          </ol>
        </div>

        {!loading && <div>Migration complete! Refresh the page to start another migration</div>}
      </Modal>
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
