## Moralis Streams API

An enterprise-grade API for monitoring assets, contracts and all kinds of events
on the blockchain.

# Table of Contents

[About](#headers)

- [Streams](#header-1)
- [Example Scenario](#header-2)

[API](#emphasis)

- [Streams](#header-3)
  - [Create](#header-33)
  - [Get](#header-4)
  - [Update](#header-5)
  - [Delete](#header-6)

# STREAMS

Streams are a way to monitor events on the blockchain in real-time. You can
create a stream to monitor a specific contract, asset, wallet or nft.

### Example Scenario

- Alice monitors all transactions from Bob's wallet with Moralis Streams API
- Bob buys a new NFT
- Alice gets a message that Bob bought a new NFT
- Bob sends USDT to Charlie
- Alice gets a message that Bob sent USDT to Charlie

## TUTORIALS

- [How to monitor a wallet with Moralis Streams API]("")

## EXAMPLES

[NestJS](https://github.com/MoralisWeb3/streams-beta/tree/main/examples/nestjs)

## CREATE A STREAM

### Pre-requisites

Create an account on https://moralis.io/ or login if you already have an
account. Before you can create a stream you need to configure your settings.

#### Programmatically

```typescript
import Moralis from "moralis";

Moralis.start({
  apiKey: "YOUR_API_KEY",
});

await Moralis.Streams.setSettings({
  secretKey: "notsosecret", // to validate incoming webhooks
  region: "eu-central-1", // choose the region closest to your backend
});
```

#### Manually

Log in to your Moralis Account. Click on Settings on the left side, choose the
(nearest) region to your backend and specify a secret key which is used to
validate incoming webhooks.

### Let's go 🚀

In this example we are going to monitor all transactions from a wallet. We will
use Moralis SDK to create a stream. You will find your API Key in your Account
Settings.

### Programmatically

```typescript
import Moralis from 'moralis';

Moralis.start({
  apiKey: 'YOUR_API_KEY',
});

const stream = {
    address: '0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4' // address to monitor
    chains: ['0x1'] // list of blockchains to monitor
    description: 'monitor Bobs wallet', // your description
    network: 'evm',
    tag: 'test', // give it a tag
    type: 'wallet' // can be wallet or contract,
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const newStream = await Moralis.Streams.add(stream);
newStream.toJSON() // { id: 'YOUR_STREAM_ID', ...newStream }
```

### Manually

Click on the Streams tab in the left sidebar. You will see a list of your
streams. Press the `Addresses` tab and click on `New Address Stream`.

Fill in the Address you wish to monitor, your webhook URL and a tag.

Select the blockchains where you want to monitor the address. Optionally, you
can include Native Transactions associated to contract events to be included in
the stream.

Click on `Create Stream`.

Now whenever an ingoing or outgoing transaction involving the address you are
monitoring occurs, you will receive a webhook with the transaction details.

## DATA MODEL

The Webhook will set a `x-singature` header. It is for verifying if the data you
will receive is from Moralis.

You can verify the webhook with the following code:

```typescript
import { sha3 } from "web3-utils";
import { SECRET } from "./env"


const signature = req.headers["x-signature"];
const data = req.body;
/** hash the stringified the body and your secret key */
const hash = sha3(JSON.stringify(data) + SECRET_KEY);
/** compare the hash with the signature */
if (hash === signature) // request valid
```

### Automatic Parsed Data

Example of a Webhook Body that's monitoring all transfers of a token.

🔥 If an event matches a erc standard, the event will be parsed and the data will
contain the metadata such as NFT name or Token Name and much more! 🔥

```json
{
  "logs": [
    {
      "log_index": "48",
      "transaction_hash": "0xb9730dd1b49061f3b5a6f93e0a66a03be199cad6f21ba5e8747a8087754e3e",
      "transaction_index": "40",
      "transaction_value": "0",
      "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "data": "0x0000000000000000000000000000000000000000204f8a5f22b432605d238000",
      "topic0": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "topic1": "0x00000000000000000000000068b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4",
      "topic2": "0x0000000000000000000000002faf487a4414fe77e2327f0bf4ae2a264a776ad2",
      "topic3": null,
      "tag": "shib_transfers",
      "streamType": "contract",
      "streamId": "c63fff7a-1f49-45d8-ab99-1fe1f3aee449"
    }
  ],
  "txs": [],
  "chainId": "0x1",
  "confirmed": true,
  "abis": {
    "c63fff7a-1f49-45d8-ab99-1fe1f3aee449": {
      "anonymous": false,
      "inputs": [
        null
      ],
      "name": "Transfer",
      "type": "event"
    }
  },
  "block": "15533549",
  "erc20Transfers": [
    {
      "from": "0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4",
      "to": "0x2faf487a4414fe77e2327f0bf4ae2a264a776ad2",
      "value": "9999678895548600000000000000",
      "transaction_hash": "0xb9730dd1b49061f3b5a6f93e0a66a03be199cad6f21ba5e8747a8087754e3e",
      "transaction_index": "40",
      "log_index": "48",
      "tag": "shib_transfers",
      "tokenAddress": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "tokenName": "SHIBA INU",
      "tokenSymbol": "SHIB",
      "tokenDecimals": "18",
      "valueWithDecimals": "9999678895.5486"
    }
  ],
  "erc20Approvals": [],
  "nftTransfers": [],
  "nftApprovals": []
}
```

### Custom Parsed Data (NOT YET IMPLEMENTED)

If you are monitoring a custom custom contract you can parse the data yourself
with the following code:

```typescript
// event MyEvent(address indexed from, address indexed to);
import Moralis from "moralis";

interface MyEvent {
  from: string;
  to: string;
}

const webhook = { ...body, logs: [...logs] };

const decodedLogs = Moralis.Streams.decodeLog<MyEvent>(webhook.logs);

decodedLogs.forEach((log) => {
  const { from, to } = log.params;
  console.log(from, to);
});
```
