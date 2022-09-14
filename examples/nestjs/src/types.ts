export interface IWebhook {
  chainId: string;
  logs: ILog[];
  txs: ITransaction[];
  lag: number;
  abis: any;
  retries: any;
  confirmed: boolean;
  erc20Transfers?: IERC20Transfer[];
  erc20Approvals?: IERC20Approval[];
  nftTransfers?: INFTTransfer[];
  nftApprovals?: INFTApproval[];
}

export interface ITransaction {
  [key: string]: string;
}

export interface ILog extends RootLog {
  address: string;
  topic0: string;
  topic1: string;
  topic2: string;
  topic3: string;
  data: string;
  streamId: string;
}

export interface RootLog {
  transaction_hash: string;
  transaction_index: number;
  log_index: number;
  tag: string;
}
export interface IERC20Transfer extends RootLog, IERC20Metadata {
  contractAddress: string;
  from: string;
  to: string;
  amount: string;
  valueWithDecimals: string;
}

export interface IERC20Metadata {
  tokenAddress: string;
  tokenDecimals: string;
  tokenName: string;
  tokenSymbol: string;
}

export interface INFTMetadata {
  tokenAddress: string;
  tokenContractType: 'ERC721 | ERC1155';
  tokenName: string;
  tokenSymbol: string;
}
export interface IERC20Approval extends RootLog {
  contractAddress: string;
  owner: string;
  spender: string;
  value: string;
  valueWithDecimals: string;
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
