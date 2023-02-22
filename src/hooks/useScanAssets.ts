import { create } from 'zustand';

import { IAsset } from '../types';
import { scrapeAssets } from '../utils';

interface IScanAssetsState {
  loading: boolean;
  loaded: boolean;
  assets: IAsset[];
}

interface IScanAssetsMethods {
  scan: (address: string) => Promise<IAsset[]>;
}

interface IScanAssetsHook extends IScanAssetsState, IScanAssetsMethods {}

const defaultState: IScanAssetsState = {
  loading: false,
  loaded: false,
  assets: [],
};

export const useScanAssetsStore = create<IScanAssetsState>(() => defaultState);

export const useScanAssetsMethods: IScanAssetsMethods = {
  scan: async (address: string) => {
    useScanAssetsStore.setState({ loading: true, assets: [] });
    const assets = await scrapeAssets(address);
    useScanAssetsStore.setState({ loading: false, loaded: true, assets });

    return assets;
  },
};

export function useScanAssets(): IScanAssetsHook {
  const storeState = useScanAssetsStore();

  return { ...storeState, ...useScanAssetsMethods };
}
