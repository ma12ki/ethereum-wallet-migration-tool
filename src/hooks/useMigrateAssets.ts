import { create } from 'zustand';
import { ethers } from 'ethers';
import { erc20ABI } from 'wagmi';

import { IAsset, IAssetMigration } from '../types';

interface IMigrateAssetsState {
  loading: boolean;
  done: boolean;
  assetMigrations: IAssetMigration[];
}

interface IMigrateAssetParams {
  asset: IAsset;
  from: string;
  to: string;
  signer: ethers.Signer;
}

interface IMigrateAssetsParams {
  assets: IAsset[];
  from: string;
  to: string;
  migrateEth: boolean;
  signer: ethers.Signer;
}

interface IMigrateAssetsMethods {
  migrate: (params: IMigrateAssetsParams) => Promise<void>;
}

interface IMigrateAssetsHook extends IMigrateAssetsState, IMigrateAssetsMethods {}

const defaultState: IMigrateAssetsState = {
  loading: false,
  done: false,
  assetMigrations: [],
};

export const useMigrateAssetsStore = create<IMigrateAssetsState>(() => defaultState);

export const useMigrateAssetsMethods: IMigrateAssetsMethods = {
  migrate: async ({ assets, from, to, migrateEth, signer }: IMigrateAssetsParams) => {
    const assetMigrations = assets.map((asset) => ({ ...asset, status: 'pending' } as IAssetMigration));
    if (migrateEth) {
      assetMigrations.push({
        address: 'ETH',
        name: 'ETH',
        amount: 0,
        value: 0,
        kind: 'ETH',
        status: 'pending',
      });
    }
    useMigrateAssetsStore.setState({ loading: true, assetMigrations });

    for (const migration of assetMigrations) {
      migration.status = 'migrating';
      useMigrateAssetsStore.setState({ assetMigrations });
      try {
        const receipt = await migrateAsset({ asset: migration, from, to, signer });
        if (receipt.status === 1) {
          migration.status = 'migrated';
        } else {
          migration.status = 'failed';
        }
        migration.txHash = receipt.transactionHash;
      } catch (e) {
        migration.status = 'failed';
        useMigrateAssetsStore.setState({ assetMigrations });
      }
      useMigrateAssetsStore.setState({ assetMigrations });
    }

    useMigrateAssetsStore.setState({ loading: false, done: true });
  },
};

async function migrateAsset({
  asset,
  from,
  to,
  signer,
}: IMigrateAssetParams): Promise<ethers.providers.TransactionReceipt> {
  let receipt = null;
  if (asset.kind === 'ERC20') {
    receipt = await migrateErc20({ asset, from, to, signer });
  } else if (asset.kind === 'ETH') {
    receipt = await migrateEth({ asset, from, to, signer });
  } else {
    throw new Error('Unsupported asset kind: ' + asset.kind);
  }

  return receipt;
}

async function migrateErc20({ asset, from, to, signer }: IMigrateAssetParams) {
  const contract = new ethers.Contract(asset.address, erc20ABI, signer);
  const balance = await contract.balanceOf(from);
  const tx = await contract.transfer(to, balance);
  return await tx.wait();
}

async function migrateEth({ asset, from, to, signer }: IMigrateAssetParams) {
  const gasPrice = await signer.getGasPrice();
  const balance = await signer.getBalance();
  const gasLimit = ethers.BigNumber.from(21000);
  const gasCost = gasPrice.mul(gasLimit);
  const amountToSend = balance.sub(gasCost);
  const tx = await signer.sendTransaction({
    from,
    to,
    value: amountToSend,
    gasLimit,
    gasPrice,
  });
  return await tx.wait();
}

export function useMigrateAssets(): IMigrateAssetsHook {
  const storeState = useMigrateAssetsStore();

  return { ...storeState, ...useMigrateAssetsMethods };
}
