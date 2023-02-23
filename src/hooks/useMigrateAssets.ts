import { create } from 'zustand';

import { IAsset, IAssetMigration } from '../types';

interface IMigrateAssetsState {
  loading: boolean;
  done: boolean;
  assetMigrations: IAssetMigration[];
}

interface IMigrateParams {
  assets: IAsset[];
  sourceAddress: string;
  targetAddress: string;
  migrateEth: boolean;
}

interface IMigrateAssetsMethods {
  migrate: (params: IMigrateParams) => Promise<void>;
}

interface IMigrateAssetsHook extends IMigrateAssetsState, IMigrateAssetsMethods {}

const defaultState: IMigrateAssetsState = {
  loading: false,
  done: false,
  assetMigrations: [],
};

export const useMigrateAssetsStore = create<IMigrateAssetsState>(() => defaultState);

export const useMigrateAssetsMethods: IMigrateAssetsMethods = {
  migrate: async ({ assets, sourceAddress, targetAddress, migrateEth }: IMigrateParams) => {
    const assetMigrations = assets.map((asset) => ({ ...asset, status: 'pending' } as IAssetMigration));
    useMigrateAssetsStore.setState({ loading: true, assetMigrations });

    useMigrateAssetsStore.setState({ loading: false, done: true });
  },
};

export function useMigrateAssets(): IMigrateAssetsHook {
  const storeState = useMigrateAssetsStore();

  return { ...storeState, ...useMigrateAssetsMethods };
}
