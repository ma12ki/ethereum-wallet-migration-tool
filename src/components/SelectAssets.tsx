import { Table, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { useMigrateAssets, useScanAssets, useSelectAssets } from '../hooks';
import { IAsset } from '../types';
import EtherscanLink from './EtherscanLink';

const columns: ColumnsType<IAsset> = [
  {
    title: 'Symbol',
    dataIndex: 'name',
    render: (_, record: IAsset) => (
      <EtherscanLink hash={record.address} type="address">
        {record.name}
      </EtherscanLink>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'kind',
    render: (kind: string) => <Tag>{kind}</Tag>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    align: 'right',
    render: (amount: number) => amount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
  },
  {
    title: 'Value',
    dataIndex: 'value',
    align: 'right',
    render: (value: number) =>
      '$' + value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
  },
];

export default function ScanAndSelectAssets() {
  const { address, isConnected } = useAccount();
  const { assets, loaded } = useScanAssets();
  const { setSelectedAssets, assets: selectedAssets } = useSelectAssets();
  const { assetMigrations } = useMigrateAssets();

  const rowSelection = useMemo(
    () => ({
      onChange: (selectedRowKeys: React.Key[], selectedRows: IAsset[]) => {
        setSelectedAssets(selectedRows);
      },
      getChecboxProps: (record: IAsset) => ({
        checked: !!selectedAssets.find((asset) => asset.address === record.address),
      }),
    }),
    [selectedAssets]
  );

  return (
    <div className="SelectAssets">
      {isConnected && loaded && assetMigrations.length === 0 && (
        <div>
          <Typography.Title level={4}>Select Assets to Migrate</Typography.Title>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={assets}
            rowKey="address"
            pagination={false}
          />
        </div>
      )}
    </div>
  );
}
