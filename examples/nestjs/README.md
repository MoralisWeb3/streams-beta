# Setup

- run npm install
- Copy the `.env.example` file to `.env`;
- run npm start:dev

To receive real webhooks from the API, you need to expose your local server to
the internet. You can use [ngrok](https://ngrok.com/) for this or deploy to
heroku or production.

NOTE: Heroku free hosting will be discontinued on 28th November

# Receive Webhooks

In this example we will receive to webhooks. One for handling transactions of a
specific wallet and on for handling events of a random ERC20 token contract.

For this we will have 2 controllers. One for each webhook.

## Controller

```typescript
import { Types as StreamsTypes } from "@moralisweb3/streams";
import { AppService } from "./app.service";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { VerifySignature } from "./guards/VerifySignature";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(VerifySignature)
  @Post("wallet")
  walletEvent(@Body() body: StreamsTypes.IWebhook) {
    return this.appService.handleWalletEvent(body);
  }

  @UseGuards(VerifySignature)
  @Post("contract")
  contractEvent(@Body() body: StreamsTypes.IWebhook) {
    return this.appService.handleContractEvent(body);
  }
}
```

The `walletEvent` function is called with the body of the webhook which contains
the transaction details.

The `contractEvent` function is called with the body of the webhook which
contains the event details.

## Services

Services are used to handle the webhook data.

### Wallet Transactions

```typescript
  handleWalletEvent(body: IWebhook) {
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
```

### Smart Contract Events

The handler for a contract event can look like this.

```typescript
  handleContractEvent(body: StreamsTypes.IWebhook) {
    const webhook = body;

    // Check and handle if the event contains ERC20/721/1155 events such as transfers or approvals.
    this.checkForErcStandard(webhook);

    // event MyEvent(address indexed player, bet string, win bool);
    interface MyContractEvent {
      player: string;
      bet: string;
      win: boolean;
    }

    const logs = Moralis.Streams.parsedLogs<MyContractEvent>({
      webhookData: webhook,
      tag: 'myCustomContract',
    }) as MyContractEvent[];

    logs[0]; // { player: '0x...', bet: '1000000000000000000', win: true }

    return { success: true };
  }
```

### ERC Checker

This function checks and handles if the webhook you are receiving includes
ERC20/1155/721 Transaction details

```typescript
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
```

In these cases we are only console logging the events. But you can do whatever
you want with the data. For example you can send an email to the user who
received the tokens or save the data in a database of your choice.

## Guards / Signature Verification

Here is an example of a simple and straightforward signature verification of
webhooks.

```typescript
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import Moralis from "moralis";

@Injectable()
export class VerifySignature implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers["x-signature"];
    const body = request.body;
    Moralis.Streams.verifySignature({
      body,
      signature,
    });
    return true;
  }
}
```
