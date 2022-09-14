## Setup

- run npm install
- Copy the `.env.example` file to `.env`;
- run npm start:dev

To receive real webhooks from the API, you need to expose your local server to
the internet. You can use [ngrok](https://ngrok.com/) for this or deploy to
heroku or production.

NOTE: Heroku free hosting will be discontinued on 28th November

## Receive Webhook

In this example we are receiving a webhook which handles ERC20 Transfers. Every
POST Request to the endpoint `YOUR_URL/token` calls the `handleWebhook`
function.

```typescript
@UseGuards(VerifySignature)
  @Post('token')
  receiveWebhook(@Body() body: IWebhook) {
    return this.appService.handleWebhook(body);
  }
```

The `handleWebhook` function is called with the body of the POST Request. Which
contains the logs of the event(s)

```typescript
@Injectable()
export class AppService {
  handleWebhook(body: IWebhook) {
    const { erc20Transfers } = body;

    erc20Transfers.map(
      ({ from, to, valueWithDecimals, transaction_hash, tokenName }) => {
        console.log(
          `${from} sends ${to} ${valueWithDecimals} ${tokenName} tokens @${transaction_hash}`,
        );
      },
    );

    return { handled: true };
  }
}
```

In this case we are only console logging the events. But you can do whatever you
want with the data. For example you can send an email to the user who received
the tokens or save the data in a database of your choice.

## Guards / Signature Verification

This Guard check if the signature (x-signature). Is valid. If not, it will
return a 403 Forbidden. The verification ensures that the webhook is coming from
the correct source.

```typescript
@Injectable()
export class VerifySignature implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers["x-signature"];
    const body = request.body;
    if (!signature) return false;
    const hash = sha3(JSON.stringify(body) + process.env.SECRET_KEY);
    return signature === hash;
  }
}
```

The signature is defined by your Secret Key and a stringified JSON body which is
hashed with sha3. If this hash matches the signature, the request is valid.

```typescript
const hash = sha3(JSON.stringify(body) + process.env.SECRET_KEY);
hash === signature; // -> valid request;
```
