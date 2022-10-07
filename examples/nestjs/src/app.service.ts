import { Types as StreamsTypes } from '@moralisweb3/streams';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  handleStream(webhook: StreamsTypes.IWebhook) {
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

    if (nftApprovals.ERC1155.length) {
      nftApprovals.ERC1155.forEach((tx) => {
        console.log(tx);
        console.log('account', tx.account);
        console.log('operator', tx.operator);
        console.log('approved', tx.approved);
        console.log('txHash', tx.transactionHash);
      });
    }
  }
}
