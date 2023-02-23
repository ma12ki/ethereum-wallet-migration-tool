import { create } from 'zustand';

import { IAsset } from '../types';

interface ISelectAssetsState {
  assets: IAsset[];
}

interface ISelectAssetsMethods {
  setSelectedAssets: (assets: IAsset[]) => void;
}

interface ISelectAssetsHook extends ISelectAssetsState, ISelectAssetsMethods {}

const defaultState: ISelectAssetsState = {
  assets: [],
};

export const useSelectAssetsStore = create<ISelectAssetsState>(() => defaultState);

export const useSelectAssetsMethods: ISelectAssetsMethods = {
  setSelectedAssets: (assets: IAsset[]) => {
    useSelectAssetsStore.setState({ assets });
  },
};

export function useSelectAssets(): ISelectAssetsHook {
  const storeState = useSelectAssetsStore();

  return { ...storeState, ...useSelectAssetsMethods };
}
