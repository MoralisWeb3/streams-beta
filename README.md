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

# CREATE A STREAM

### Pre-requisites

Create an account on [Moralis.io](https://moralis.io) or login and get your API
KEY for free! You can find the key [here](http://admin.moralis.io/web3apis)

## Configure Stream Settings

Before we can start any streams we need to setup the stream settings. We need to
specifiy the region and and a secret key for our streams.

Select a region which is closest to your backend. Learn more about the Secret
Key in the Data

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

1. Go to [Settings](http://admin.moralis.io/settings)
2. Choose a region which is closest to your backend
3. Set a secret key for your streams

### Let's go 🚀

In this example we will monitor a wallet. Meaning all incoming and outgoing
transactions of that wallet will be monitored!

NOTE: The following tutorial considers Manual Steps and shows programmatically
steps using JavaScript (TypeScript). If you want to use other languages you can
directly use the API endpoints via HTTP.

[Swagger Docs](https://streams-api.aws-prod-streams-master-1.moralis.io/api-docs/#/)

### Programmatically

We will use Moralis SDK to create a stream. You need an API Key which you will
find your Account Settings.

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
    tag: 'bob', // give it a tag
    type: 'wallet' // can be wallet or contract,
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const newStream = await Moralis.Streams.add(stream);
newStream.toJSON() // { id: 'YOUR_STREAM_ID', ...newStream }
```

### Manually

1. Go to http://admin.moralis.io/streams/wallets/new
2. Click on `New Address Stream`.
3. Fill out the Form:
   - Address: `BOBS_WALLET`
   - Webhook URL: `https://YOUR_WEBHOOK_URL`
   - Tag: `bob`
   - Select Blockchain (e.g. Ethereum Mainnet)
4. Click on `Create Stream`

### We are live! 🎉

Now whenever an ingoing or outgoing transaction involving the address you are
monitoring occurs, you will receive a webhook with the transaction details.

# Webhook Data

## Header

### x-signature

The Webhook will set a `x-signature` header. It is for verifying if the data you
will receive is from Moralis.

You can verify the webhook with the following code:

```typescript
import { sha3 } from "web3-utils";
import { SECRET } from "./env"


const signature = req.headers["x-signature"];
const data = req.body;
/** hash the stringified body and your secret key */
const hash = sha3(JSON.stringify(data) + SECRET_KEY);
/** compare the hash with the signature */
if (hash === signature) // request valid
```

#### Body

The body contains the data you are interested in. Logs is in array containing
raw events and stream information such as tag and the streamId. The body also
contains a chainId, the blocknumber, internal transactions, the abis and a
confirmed field that indicates if the block is confirmed.

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
      "tag": "bob",
      "streamType": "contract",
      "streamId": "c63fff7a-1f49-45d8-ab99-1fe1f3aee449"
    }
  ],
  "txs": [],
  "chainId": "0x1",
  "confirmed": true,
  "block": "15534209"
}
```

### Automatic Parsed Data

In a case where you are receiveng a webhook that monitors a wallet or a contract
and includes ERC Standard Events such as ERC20 transfers and approvals aswell as
ERC115/ERC721 transfers and approvals:

🔥 The Streams API will automatically parse the logs and also adds metadata
information about the contract 🔥

Example Body:

```json
{
  "logs": [
    {
      ...rawLogs,
    }
  ],
  ...,
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

### Custom Parsed Data

If you are monitoring a custom custom contract you can parse the data yourself.
with the following code:

```typescript
// event MyEvent(address indexed from, address indexed to);
import AbiUtils from "web3-eth-abi";

interface MyEvent {
  from: string;
  to: string;
}

const webhook = { ...body, logs: [...logs] };

function decodeLogs<T>() {
  return webhook.logs.map((log) => {
    const { data, topic1, topic2, topic3, streamId } = log;
    const topics = [topic1, topic2, topic3];
    const abi = webhook.abis[streamId];
    return AbiUtils.decodeLog(abi.inputs, data, topics);
  }) as unknown as T[];
}

const decodedLogs = decodeLogs<MyEvent>();

decodedLogs[0]; // { from: '0x...', to: '0x...' }
```

# Filter Streams

In some cases you might want to filter the data you receive from the webhook.
For example you are monitoring a nft collection but you only want to know if a
specific nft is transfered.

You can do this by adding a filter to the stream. Important: You must add a
(valid!) ABI of the event you want to filter! Otherwise the stream will not work

## Programmatically

```typescript
import { Moralis } from "moralis";

const options = {
    address: '0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4' // address to monitor
    chains: ['0x1'] // list of blockchains to monitor
    description: 'monitor one NFT from Collection', // your description
    network: 'evm',
    tag: 'mySpecialNft', // give it a tag
    type: 'contract' // contract as NFT is a contract,
    abi: {}, // abi of the event
    filter: {"eq": ["tokenId", "1"]}, // only receive events where tokenId is 1
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const stream = await Moralis.Streams.add(stream);
```

## Manually

1. Create a new Smart Contract Stream
2. Fill out the form
3. Add the Abi and choose from the topic dropdown
4. Add a filter
   - {"eq": ["tokenId", "1"]}
5. Save the stream

# Get Error

...

# Retry Failed Webhook

...
