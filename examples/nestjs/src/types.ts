export interface IWebhook {
  chainId: string;
  logs: ILog[];
  txs: ITransaction[];
  txsInternal: ITransaction[];
  lag: number;
  abis: any;
  retries: any;
  confirmed: boolean;
  erc20Transfers?: IERC20Transfer[];
  erc20Approvals?: IERC20Approval[];
  nftTransfers?: INFTTransfer[];
  nftApprovals?: INFTApproval[];
}

export interface ITransaction extends RootLog {
  hash: string;
  block_number: string;
  gas: string;
  gas_price: string;
  nonce: string;
  input: string;
  transaction_index: string;
  block_timestamp: any;
  block_hash: string;
  from_address: string;
  to_address: string;
  value: string;
  type: string;
  v: string;
  r: string;
  s: string;
}

export interface ILog extends RootLog {
  address: string;
  data: string;
  log_index: number;
  tag: string;
  topic0: string;
  topic1: string;
  topic2: string;
  topic3: string;
}

export interface RootLog {
  block_hash: string;
  hash: string;
  streamId: string;
  streamType: 'contract' | 'wallet';
  tag: string;
  transaction_hash: string;
  transaction_index: string;
}

export interface IERC20Metadata {
  tokenAddress: string;
  tokenDecimals: string;
  tokenName: string;
  tokenSymbol: string;
  valueWithDecimals: string;
}

export interface INFTMetadata {
  tokenAddress: string;
  tokenContractType: 'ERC721 | ERC1155';
  tokenName: string;
  tokenSymbol: string;
}

export interface IERC20Transfer extends RootLog, IERC20Metadata {
  contractAddress: string;
  from: string;
  to: string;
  amount: string;
  valueWithDecimals: string;
}

export interface IERC20Approval extends RootLog, IERC20Metadata {
  contractAddress: string;
  owner: string;
  spender: string;
  value: string;
}
export interface INFTTransfer extends RootLog {
  contractAddress: string;
  from: string;
  to: string;
  tokenId: string;
}

export interface INFTApproval extends RootLog {
  account: string;
  operator: string;
  approved: boolean;
}
export interface Root {
  from: string;
  to: string;
  tokenId: number;
  transaction_hash: string;
  transaction_index: number;
  log_index: number;
  tag: string;
  tokenAddress: string;
  amount: number;
  tokenName: string;
  tokenSymbol: string;
  tokenContractType: string;
}
