import Moralis from 'moralis';
import { Types as StreamsTypes } from '@moralisweb3/streams';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  handleContractEvent(webhook: StreamsTypes.IWebhook) {
    // Check and handle if the event contains ERC20/721/1155 events such as transfers or approvals.
    this.checkForErcStandard(webhook);

    // if the event contains custom events, you can decode the logs using the abi and a typed interface.
    interface MyCustomEvent {
      player: string;
      bet: string;
      win: boolean;
    }

    const logs = Moralis.Streams.parsedLogs<MyCustomEvent>({
      webhookData: webhook,
      tag: 'myCustomEvent',
    });

    logs[0]; // { player: '0x...', bet: '1000000000000000000', win: true }

    return { success: true };
  }

  handleWalletEvent(body: StreamsTypes.IWebhook) {
    const { erc20Transfers, erc20Approvals, nftApprovals, nftTransfers, txs } =
      body;

    if (txs.length) {
      txs.forEach((tx) => {
        console.log('txHash', tx.hash);
        console.log('from', tx.fromAddress);
        console.log('to', tx.toAddress);
        console.log('value', tx.value);
      });
    }

    // Check and handle if the transaction contains ERC20/721/1155 events such as transfers or approvals.
    this.checkForErcStandard(body);

    return { success: true };
  }

  private checkForErcStandard(body) {
    const { erc20Transfers, erc20Approvals, nftApprovals, nftTransfers } = body;

    if (erc20Transfers.length) {
      erc20Transfers.forEach((tx) => {
        console.log('from', tx.from);
        console.log('to', tx.to);
        console.log('amount', tx.amount);
      });
    }

    if (erc20Approvals.length) {
      erc20Approvals.forEach((tx) => {
        console.log('owner', tx.owner);
        console.log('spender', tx.spender);
        console.log('value', tx.value);
        console.log('txHash', tx.transaction_hash);
      });
    }

    if (nftTransfers.length) {
      nftTransfers.forEach((tx) => {
        console.log('from', tx.from);
        console.log('to', tx.to);
        console.log('tokenId', tx.tokenId);
        console.log('txHash', tx.transaction_hash);
      });
    }

    if (nftApprovals.length) {
      nftApprovals.forEach((tx) => {
        console.log('owner', tx.account);
        console.log('spender', tx.operator);
        console.log('is Allowed', tx.approved);
        console.log('txHash', tx.transaction_hash);
      });
    }
  }
}
