# Setup

- run npm install
- Copy the `.env.example` file to `.env`;
- run npm start:dev

To receive real webhooks from the API, you need to expose your local server to
the internet. You can use [ngrok](https://ngrok.com/) for this.

## Environment variables

| Variable          | Description                       | Default           |
| ----------------- | --------------------------------- | ----------------- |
| `PORT`            | Port to run the server on         | `3000`            |
| `MORALIS_API_KEY` | API key to use for authentication | `MORALIS_API_KEY` |

# Receive Webhooks

In this example we will have one endpoint that will receive all streams. Note
that Webhooks are sent to the endpoint as a POST request. So we need to add a
POST route to our controller.

Our endpoint path will be `stream`. Resulting in `YOUR_URL:PORT/stream`.

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
  @Post("stream")
  walletEvent(@Body() body: StreamsTypes.IWebhook) {
    return this.appService.handleStream(body);
  }
}
```

The `handleStream` function is called with the body of the webhook which
contains the transaction details.

## Services

Services are used to handle the webhook data. It contains the business logic of
what to do with the webhook.

### Handle Webhook

```typescript
  handleWebhook(body: IWebhook) {
    console.log(webhook);

    // Check and handle if the transaction contains ERC20/721/1155 events such as transfers or approvals.
    this.checkForErcStandard(body);

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

# Stream

Create a stream in the Moralis dashboard. In case you are using ngrok the
webhook url should be something like this:

`https://<your-ngrok-url>/stream`
