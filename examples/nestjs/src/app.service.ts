import { IWebhook } from './types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  handleWebhook(body: IWebhook) {
    const { erc20Transfers } = body;

    erc20Transfers?.map(
      ({ from, to, valueWithDecimals, transaction_hash, tokenName }) => {
        console.log(
          `${from} sends ${to} ${valueWithDecimals} ${tokenName} tokens @${transaction_hash}`,
        );
      },
    );

    return { handled: true };
  }
}
