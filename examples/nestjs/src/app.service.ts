import { IWebhook } from './types';
import { Injectable } from '@nestjs/common';
import AbiUtils from 'web3-eth-abi';

const { decodeLog } = AbiUtils;

@Injectable()
export class AppService {
  handleContractEvent(body: IWebhook) {
    const { logs, abis } = body;

    // custom parser for contract events

    interface MyContractEvent {
      player: string;
      bet: string;
      win: boolean;
    }

    if (logs.length) {
      logs.forEach((log) => {
        const { bet, player, win } = decodeLog(abis[log.streamId], log.data, [
          log.topic1,
          log.topic2,
          log.topic3,
        ]) as unknown as MyContractEvent;

        console.log('player', player);
        console.log('bet', bet);
        console.log('win', win);
      });
    }

    return { success: true };
  }

  handleWalletEvent(body: IWebhook) {
    const { erc20Transfers, erc20Approvals, nftApprovals, nftTransfers, txs } =
      body;

    if (txs.length) {
      txs.forEach((tx) => {
        console.log('txHash', tx.hash);
        console.log('from', tx.from_address);
        console.log('to', tx.to_address);
        console.log('value', tx.value);
      });
    }

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

    return { success: true };
  }
}
