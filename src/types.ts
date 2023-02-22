export interface IAsset {
  address: string;
  name: string;
  amount: number;
  value: number;
  kind: 'ERC20' | 'ERC721' | 'ERC1155' | '-';
}
