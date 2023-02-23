export interface IAsset {
  address: string;
  name: string;
  amount: number;
  value: number;
  kind: 'ERC20' | 'ERC721' | 'ERC1155' | '-';
}

export interface IAssetMigration extends IAsset {
  status: MigrationStatus;
  txHash?: string;
}

export type MigrationStatus = 'pending' | 'migrating' | 'migrated' | 'failed';
