# Moralis Streams API Beta ⚡️

Stream blockchain data into your backend via webhooks. Ethereum, Polygon,
Avalanche, BNB Chain, Fantom, Cronos and all testnets are supported. More
networks are added soon.

- An address sends, receives, stakes, swaps or burns assets
- An asset is being sent, received, staked, swaped or burned
- A battle starts in your web3 game
- Someone participates in your token sale
- Any other smart contract event fires on-chain based on your filters
- Fully typed
- Contract Factories supported
- Filters supported 🔥 [see examples](https://github.com/MoralisWeb3/streams-beta/blob/main/README.md#filter-streams)
- Internal transactions supported 🥃

This README will intorduce you to Moralis Streams API.

## Supported Chains

|    Chain    | Streams | Blocks Until Confirmed | Internal Tx (all will be supported at launch) |
| :---------: | :-----: | :--------------------: | :---------: |
|     ETH     |    ✅    |           12           |      ✅      |
|   ROPSTEN   |    ✅    |           12           |      ❌      |
|   GOERLI    |    ✅    |           12           |      ❌      |
|     BSC     |    ✅    |           18           |      ✅      |
|  BSC TEST   |    ✅    |           18           |      ✅      |
|   POLYGON   |    ✅    |          100           |      ✅      |
|   MUMBAI    |    ✅    |          100           |      ✅      |
|   FANTOM    |    ✅    |          100           |      ❌      |
|    AVAX     |    ✅    |          100           |      ❌      |
|  AVAX TEST  |    ✅    |          100           |      ❌      |
|   CRONOS    |    ✅    |          100           |      ❌      |
| CRONOS TEST |    ✅    |          100           |      ❌      |

### Useful links

- This guide will be using Moralis SDK to interact with Moralis Streams API. But
  you can interact directly with with Streams API using these
  [Swagger Docs](https://api.moralis-streams.com/api-docs/)
- [NestJS Demo](https://github.com/MoralisWeb3/streams-beta/tree/main/examples/nestjs)

## Pre-requisites

- [x] Create an account on [Moralis.io](https://moralis.io)
- [x] Get your API key [here](http://admin.moralis.io/web3apis)

## Beta Limitations

This is not a finished product but a preview.

- High availability is not deployed yet
- We may have to purge the history and logs
- You may experience some bugs
- The UI is not fully built out or polished - slick dashboards soon ftw 🤩
- The response structure may change
- We are still collecting feedback and may adjust according to it

We expect a full production ready roll-out in October.

## Bug reports and Questions

If you experience any issues - please let us know
[in this dedicated Moralis Forum](https://forum.moralis.io/t/streams-api-beta/19664).

## Roadmap 🚴‍♀️

These are features that are not included in this beta but that will be out in
the near future:

- [ ] Including multiple assets or addresses in the same stream
- [ ] Mempool support
- [ ] Automatic retries (browsing failed deliveries and manually retrying is
      possible in beta)

# Your first stream 🚀

In this example we will monitor a wallet.

Meaning all incoming and outgoing transactions of that wallet will be monitored!

### Programmatically

We will use Moralis SDK to create a stream.

You can install the Moralis SDK

```typescript
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils'

Moralis.start({
  apiKey: 'YOUR_API_KEY',
});

const stream = {
    address: '0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4' // address to monitor
    chains: [EvmChain.ETHEREUM, EvmChain.POLYGON] // list of blockchains to monitor
    description: 'monitor Bobs wallet', // your description
    network: 'evm',
    tag: 'bob', // give it a tag
    type: 'wallet' // can be wallet or contract,
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const newStream = await Moralis.Streams.add(stream);
newStream.toJSON() // { id: 'YOUR_STREAM_ID', ...newStream }
```

### Via WebUI

1. Go to http://admin.moralis.io/streams/wallets/new
2. Click on `New Address Stream`.
3. Fill out the Form:
   - Address: `BOBS_WALLET`
   - Webhook URL: `https://YOUR_WEBHOOK_URL`
   - Tag: `bob`
   - Select Blockchain (e.g. Ethereum Mainnet)
4. Click on `Create Stream`

### Mandatory Test Webhook 🚨

Whenever you create or update a stream you will receive a test webhook.

**You have to return status code 200 for the stream to be start.**

The test body will look like this:

```json
{
  "abis": {},
  "block": {
    "hash": "",
    "number": "",
    "timestamp": ""
  },
  "txs": [],
  "txsInternal": [],
  "logs": [],
  "chainId": "",
  "confirmed": true,
  "retries": 0,
  "erc20Approvals": [],
  "erc20Transfers": [],
  "nftApprovals": [],
  "nftTransfers": []
}
```

## We are live! 🎉

Now whenever an ingoing or outgoing transaction involving the address you are
monitoring occurs, you will receive a webhook with the transaction details.

### Two webhooks for each block

You will receive two webhooks for each block that contains the events you are
interested in.

The first webhook will come as soon as the block is mined and have
`confirmed:false`. This means that the block in which the events you are
interested in is still running the risk of being dropped due to a reorganization
of the blockchain.

The second webhook will come once the block has very minimal chance of being
dropped (the chance is never zero as it is all probabalistic). This second
webhook will have `confirmed:true`.

### Edge cases

In rare cases the webhook with `confirmed: true` may come before the one with
`confirmed:false`, please ensure to handle this scenario on your end.

# Webhook Data

## Header

### Verify Webhooks

The Webhook will set a `x-signature` in the header. It is for verifying if the
data you will receive is from Moralis. Essentially it is a hash (sha3) of the
body and your API Key.

You can verify the webhook with the following code:

```typescript
import Moralis from "moralis";

const { headers, body } = request;

Moralis.Streams.verifySignature({
  body,
  signature: headers["x-signature"],
}); // throws error if not valid
```

## Body

The body contains the data you are interested in. Logs is in array containing
raw events and stream information such as tag and the streamId. The body also
contains a chainId, the blocknumber, internal transactions, the abis and a
confirmed field that indicates if the block is confirmed.

### Wallet Transaction

```json
{
  "txs": [
    {
      "hash": "0x9e77b2e848c5bfa67cdd46a4fsd12df0daa2e8fde18f35db58c0406fe43e766f",
      "gas": "21000",
      "gasPrice": "1000000006",
      "nonce": "13",
      "input": "0x",
      "transactionIndex": "3",
      "fromAddress": "0x32ba4825204dce15c7147ea89b31178a00750f81",
      "toAddress": "0x0e1458c4b529f564a14ec8fc3ae7369786a1625d",
      "value": "241000000000000000",
      "type": "2",
      "v": "0",
      "r": "576982745954673806006784990416278341842152496504273944233060992947236722288",
      "s": "22542532798662050842266238043505315399614658322386149246105065480312118160986",
      "tag": "WALLET_1",
      "streamType": "wallet",
      "streamId": "4f08e7df-3753-41f0-83ff-3fb24f7d0266"
    },
    ...
  ],
  "logs": [],
  "chainId": "0x1",
  "confirmed": true,
  "block": {
    "hash": "0x9e77b2e848c5bfa67cdd46a4fsd12df0daa2e8fde18f35db58c0406fe43e766f",
    "timestamp": "1627400000",
    "number": "12990639",
  }
}
```

#### Smart Contract Events

```json
{
  "abis": {
    "d63fff7a-1f49-45d8-ab99-1fe1f3aee449": {
      // ... event abi
    }
  },
  "logs": [
    {
      "logIndex": "48",
      "transactionHash": "0xb9730dd1b49061f3b5a6f93e0a66a03be199cad6f21ba5e8747a8087754e3e",
      "transactionIndex": "40",
      "transactionValue": "0",
      "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "data": "0x0000000000000000000000000000000000000000204f8a5f22b432605d238000",
      "topic0": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "topic1": "0x00000000000000000000000068b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4",
      "topic2": "0x0000000000000000000000002faf487a4414fe77e2327f0bf4ae2a264a776ad2",
      "topic3": null,
      "tag": "bob",
      "streamType": "contract",
      "streamId": "d63fff7a-1f49-45d8-ab99-1fe1f3aee449"
    }
  ],
  "txs": [],
  "txsInternal": [],
  "chainId": "0x1",
  "confirmed": true,
  "block": {
    "hash": "0x9e77b2e848c5bfa67cdd46a4fsd12df0daa2e8fde18f35db58c0406fe43e766f",
    "timestamp": "1627400000",
    "number": "12990639"
  }
}
```

### Automatically Parsed Data 🔥

Moralis automatically parses the following data for you:

- [x] ERC20 Transfers and Approvals
- [x] NFT Transfers and Approvals

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
      "transactionHash": "0xb9730dd1b49061f3b5a6f93e0a66a03be199cad6f21ba5e8747a8087754e3e",
      "transactionIndex": "40",
      "logIndex": "48",
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

### Parsing Smart Contract Events

If you are streaming a smart contract event you can use the code below to
extract the data from the webhook into a typed data structure.

```typescript
// event MyEvent(address indexed from, address indexed to);

interface MyEvent {
  from: string;
  to: string;
}

const decodedLogs = Moralis.Streams.parsedLogs<MyEvent>({ webhook, tag });

decodedLogs[0]; // { from: '0x...', to: '0x...' }
```

# Stream Management

## GET Streams

You can see a list of all your streams by calling the following method:

```typescript
const streams = await Moralis.Streams.getAll({
    limit: 100 // limit the number of streams to return
    network: 'evm', // filter by network
});
```

Or you can see all streams in the [Admin Panel](http://admin.moralis.io/streams)

### Response

```json
{
  "result": [
    {
      "webhookUrl": "string",
      "description": "string",
      "tag": "string",
      "tokenAddress": "string",
      "topic0": "string",
      "includeNativeTxs": true,
      "abi": "string",
      "filter": "string",
      "address": "string",
      "chainIds": [
        "string"
      ],
      "type": "wallet",
      "id": "3fa84f64-5717-4562-b3fc-2c963f66afa6",
      "status": "active",
      "statusMessage": "string"
    }
  ],
  "cursor": "string",
  "total": 1
}
```

## Monitor Stream

Sometimes you want to check if a stream is still active or if something went
wrong. When you [query all your streams](#get-streams) you can see the status of
the stream. There are three possible states: `active`, `paused` and `error`.

## Stream Settings

Moralis sets a default region for your stream. You can change the region
anytime. Choose the region that is closest to your backend for the best
performance.

### Set Settings

#### Programmatically

```typescript
import Moralis from "moralis";

Moralis.start({
  apiKey: "YOUR_API_KEY",
});

await Moralis.Streams.setSettings({
  region: "eu-central-1", // 'us-east-1' | 'us-west-2' | 'eu-central-1'
});
```

#### Manually

1. Go to [Settings](http://admin.moralis.io/settings)
2. Choose a region which is closest to your backend
3. Click on Save Changes

## Update Stream

In some cases you want to add a chain to an already existing stream or change
the webhook url. Luckily you can easily update your streams.

### Programmatically

Example on how to update the webhook url of a stream:

```typescript
import Moralis from "moralis";

Moralis.start({
  apiKey: "YOUR_API_KEY",
});

await Moralis.Streams.update({
  id: "STREAM_ID",
  webhook: "https://YOUR_NEW_WEBHOOK_URL",
});
```

### Manually

1. Go to [Streams](http://admin.moralis.io/streams)
2. Click the `Edit` Button on the stream you want to update
3. Change the things you want to update
4. Click on `Save Changes`

# Filter Streams

## Operators

| Filter | Function                          | Note                    | Example                                 | Demo                                         |
| ------ | --------------------------------- | ----------------------- | --------------------------------------- | -------------------------------------------- |
| or     | either ... or ...                 | Need at least 2 filters | { "or" : [ {..filter1}, {...filter2} ]} |                                              |
| and    | all filters must satisfy          | Need at least 2 filters | { "or" : [ {..filter1}, {...filter2} ]} |                                              |
| eq     | checks for equality               |                         | { "eq": ["value", "1000"] }             | [Specifc NFT](#example-monitor-specific-nft) |
| ne     | checks for inequality             |                         | { "ne": ["address", "0x...325"] }      |                                              |
| lt     | value is less than                | Value must be a number  | { "lt": ["amount", "50"] }              |                                              |
| gt     | value is greater than             | Value must be a number  | { "gt": ["price", "500000"] }           |                                              |
| lte    | value is less than or equal to    | Value must be a number  | { "lte": ["value", "100"] }             |                                              |
| gte    | value is greater than or equal to | Value must be a number  | { "gte": ["value", "100"] }             |                                              |
| in     | value is in array                 | Must provide an array   | { "in": ["city": ["berlin", "paris"]]}  |                                              |
| nin    | value is not in array             | Must provide an array   | { "nin": ["name": ["bob", "alice"]]}    |                                              |

In some cases you might want to filter the data you receive from the webhook.
You can do this by adding a filter to the stream. Important: You must add a
(valid!) ABI of the event you want to filter! Otherwise the stream will not work

## Example: Monitor Specific NFT Based on Token ID

### Programmatically

```typescript
import { Moralis } from "moralis";
import { EvmChain } from '@moralisweb3/evm-utils'

const options = {
    address: '0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4' // address to monitor
    chains: [EvmChain.ETHEREUM] // list of blockchains to monitor
    description: 'monitor one NFT from Collection', // your description
    network: 'evm',
    tag: 'mySpecialNft', // give it a tag
    type: 'contract' // contract as NFT is a contract,
    abi: {}, // valid abi of the event
    filter: {"eq": ["tokenId", "1"]}, // only receive events where tokenId is 1
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const stream = await Moralis.Streams.add(stream);
```

### Manually

1. Create a new Smart Contract Stream
2. Fill out the form
3. Add the Abi and choose from the topic dropdown
4. Add a filter
   - {"eq": ["tokenId", "1"]}
5. Save the stream

## Example: Get USDT Transfers above 100K USDT

### Programmatically

```typescript
const transferAbi = 
{
  "anonymous":false,
  "inputs":[
    {"indexed":true,"name":"from","type":"address"},
    {"indexed":true,"name":"to","type":"address"},
    {"indexed":false,"name":"value","type":"uint256"}
  ],
  "name":"Transfer",
  "type":"event"
} // valid abi of the event

const options = {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' // address to monitor
    chains: [EvmChain.ETHEREUM] // list of blockchains to monitor
    description: 'whale transactions', // your description
    network: 'evm',
    tag: 'usdtwhale', // give it a tag
    type: 'contract' // contract as USDT is a contract,
    abi: transferAbi,
    filter: {"gt": ["value", "100000000000"]}, // only receive events where the value is above 100k USDT
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const stream = await Moralis.Streams.add(stream);
```

### Manually

1. Create a new Smart Contract Stream
2. Fill out the form
3. Add the Abi and choose from the topic dropdown
4. Add a filter
   - {"gt": ["value", "100000000000"]}
5. Save the stream

## Example: Monitor specific CryptoPunk NFTs Based on an array of Token IDs

### Programmatically

```typescript
const punkTransferAbi = 
{
  "anonymous":false,
  "inputs":
  [
    {"indexed":true,"name":"from","type":"address"},
    {"indexed":true,"name":"to","type":"address"},
    {"indexed":false,"name":"punkIndex","type":"uint256"}
  ],
  "name":"PunkTransfer",
  "type":"event"
} // valid abi of the event

const options = {
    address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB' // crypto punks address
    chains: [EvmChain.ETHEREUM] // list of blockchains to monitor
    description: '1000 to 1002 cryptopunks', // your description
    network: 'evm',
    tag: 'cryptoPunks', // give it a tag
    type: 'contract' // contract as CryptoPunks is a contract,
    abi: punkTransferAbi,
    filter: { "in" : ["punkIndex", ["1000", "1001", "1002"]]}, // only receive transfer events if the token id is 1000/1001/1002
    webhookUrl: 'https://YOUR_WEBHOOK_URL' // webhook url to receive events,
  }

const stream = await Moralis.Streams.add(stream);
```

### Manually

1. Create a new Smart Contract Stream
2. Fill out the form
3. Add the Abi and choose from the topic dropdown
4. Add a filter
   - { "or": [ { "eq": ["punkIndex", "1000"] }, { "eq": ["punkIndex", "1001"] }
     { "eq": ["punkIndex", "1002"] } ] }
5. Save the stream

# Update/Pause a Stream

You can update the status of a stream at any time. Possible values for status
are `active`, `paused` and `error`.

For example: In some cases you might want to pause a stream. You can do this by
calling the specific endpoint.

## Programmatically

```typescript
await Moralis.Streams.updateStatus({
  network: 'evm';
  id: 'YOUR_STREAM_ID',
  status: 'paused'
})
```

## Manually

```curl
curl -X 'POST' \
  'https://api.moralis-streams.com/streams/evm/STREAM_ID/status' \
  -H 'accept: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"status": "paused"}'
```

# See failed webhooks

The Streams API provides an endpoint to get all failed webhooks. It is useful to
replay the failed webhooks.

## Programmatically

```typescript
const history = await Moralis.Streams.getHistory({ limit: 100 });
```

## Manually

The UI for this feature is still under development.

## Response

The Response is a list of failed webhooks that are uniquely identified by id.
The payload contains the webhook details.

```json
{
  "result": [
    {
      "id": "WEBHOOK_ID",
      "date": "string",
      "payload": {
        // the failed webhook
      },
      "errorMessage": "string",
      "webhookUrl": "string"
    }
  ],
  "cursor": "string"
}
```

# Replay Failed Webhook

You can replay (replay) a failed webhook by calling the specific endpoint.

## Programmatically

```typescript
await Moralis.Streams.retryWebhook({ id: "WEBHOOK_ID" });
```

## Manually

You can use the Swagger UI or make an API call to the endpoint.

```curl
curl -X 'POST' \
  'https://api.moralis-streams.com/history/replay/WEBHOOK_ID' \
  -H 'accept: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
```

# Webhook Successrate

Every Stream starts with a successrate of 100% per webhook URL. For every failed
webhook the rate decreases by 1% per webhook URL. For every successful webhook
the rate increases by 1% per webhook URL where the maximum is 100%. If the
successrate is below 70% per webhook URL the stream will be discontinued and an
email is sent to you. The status of your stream will be set to `error`.

If you want to continue receiving events you can
[update the status of a stream](#updatepause-a-stream) to `active`.

# Get Stats (Beta - This endpoint could be replaced or removed)

You can get stats about your streams usage

## Manually

You can use the Swagger UI or make an API call to the endpoint.

```curl
curl -X 'GET' \
  'https://api.moralis-streams.com/beta/stats' \
  -H 'accept: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
```

## Response

```json
{
  "totalWebhooksDelivered": 15,
  "totalWebhooksFailed": 32,
  "totalLogsProcessed": 26,
  "totalTxsProcessed": 45,
  "totalTxsInternalProcessed": 3
}
```

# Lag

Use the --lag option to specify how many blocks to lag behind the head of the
blockchain. It's the simplest way to handle chain reorganizations - they are
less likely the further a block from the head.
