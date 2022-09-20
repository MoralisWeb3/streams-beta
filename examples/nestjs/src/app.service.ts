import Moralis from 'moralis';
import { Types as StreamsTypes } from '@moralisweb3/streams';
import { Injectable } from '@nestjs/common';
import { TEST_PAYLOAD } from './utils';

@Injectable()
export class AppService {
  handleContractEvent(webhook: StreamsTypes.IWebhook) {
    if (webhook === TEST_PAYLOAD) return { success: true };
    console.log(webhook);
    return { success: true };
  }

  handleWalletEvent(webhook: StreamsTypes.IWebhook) {
    if (webhook === TEST_PAYLOAD) return { success: true };
    console.log(webhook);
    return { success: true };
  }

  private checkForErcStandard(body: StreamsTypes.IWebhook) {
    const { erc20Transfers, erc20Approvals, nftApprovals, nftTransfers } = body;

    if (erc20Transfers.length) {
      erc20Transfers.forEach((tx) => {
        console.log('from', tx.from);
        console.log('to', tx.to);
        console.log('amount', tx.valueWithDecimals);
      });
    }

    if (erc20Approvals.length) {
      erc20Approvals.forEach((tx) => {
        console.log('owner', tx.owner);
        console.log('spender', tx.spender);
        console.log('value', tx.value);
        console.log('txHash', tx.transactionHash);
      });
    }

    if (nftTransfers.length) {
      nftTransfers.forEach((tx) => {
        console.log('from', tx.from);
        console.log('to', tx.to);
        console.log('tokenId', tx.tokenId);
        console.log('txHash', tx.transactionHash);
      });
    }

    if (nftApprovals.ERC721.length) {
      nftApprovals.ERC721.forEach((tx) => {
        console.log('owner', tx.owner);
        console.log('spender', tx.spender);
        console.log('value', tx.value);
        console.log('txHash', tx.transactionHash);
      });
    }
  }
}
