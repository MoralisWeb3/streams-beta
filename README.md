# Moralis Streams API Beta ⚡️

Stream blockchain data into your backend via webhooks. Ethereum, Polygon,
Avalanche, BNB Chain, Fantom, Cronos and all testnets are supported. More
networks to be added soon.

Get events streamed to your backend whenever:

- An address sends, receives, stakes, swaps or burns assets
- An asset is being sent, received, staked, swapped or burned
- A battle starts in your web3 game
- Someone participates in your token sale
- Any other smart contract event fires on-chain based on your filters

### Other features

- Fully typed
- Contract Factories supported
- Filters supported 🔥
  [see examples](https://github.com/MoralisWeb3/streams-beta/blob/main/README.md#filter-streams)
- Internal transactions supported 🥃

This README will introduce you to Moralis Streams API.

## Video Demo Below

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/3DpJ15Z6q5w/0.jpg)](https://www.youtube.com/watch?v=KL3Sdsu50Jc&ab_channel=MoralisWeb3)

## Supported Chains

|    Chain    | Streams | Confirmations Until Confirmed [read more](https://github.com/MoralisWeb3/streams-beta/blob/main/README.md#two-webhooks-for-each-block) | Internal Tx (all will be supported at launch) |
| :---------: | :-----: | :------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------: |
|     ETH     |    ✅    |                                                                   12                                                                   |                       ✅                       |
|   ROPSTEN   |    ✅    |                                                                   12                                                                   |                       ❌                       |
|   GOERLI    |    ✅    |                                                                   12                                                                   |                       ❌                       |
|     BSC     |    ✅    |                                                                   18                                                                   |                       ✅                       |
|  BSC TEST   |    ✅    |                                                                   18                                                                   |                       ✅                       |
|   POLYGON   |    ✅    |                                                                  100                                                                   |                       ✅                       |
|   MUMBAI    |    ✅    |                                                                  100                                                                   |                       ✅                       |
|   FANTOM    |    ✅    |                                                                  100                                                                   |                       ❌                       |
|    AVAX     |    ✅    |                                                                  100                                                                   |                       ❌                       |
|  AVAX TEST  |    ✅    |                                                                  100                                                                   |                       ❌                       |
|   CRONOS    |    ✅    |                                                                  100                                                                   |                       ❌                       |
| CRONOS TEST |    ✅    |                                                                  100                                                                   |                       ❌                       |

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
- You can create maximum 100 streams
- Pricing and limitaions based on pricing will be announced in October - during
  beta there are no limitations outside of the one mentioned above

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

We will be using Moralis SDK to interact with Moralis Streams API.

You can install the Moralis SDK via npm/pnpm/yarn:

```bash
npm install moralis
```

## Example 1 - Monitor a wallet

In this example we will monitor a wallet.

Meaning all incoming and outgoing transactions of that wallet will be monitored!

### Programmatically

We will use Moralis SDK to create a stream.

You can install the Moralis SDK via npm/pnpm/yarn:

```bash
npm install moralis
```

```typescript
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

Moralis.start({
  apiKey: "YOUR_API_KEY",
});

const stream = {
  chains: [EvmChain.ETHEREUM, EvmChain.POLYGON], // list of blockchains to monitor
  description: "monitor Bobs wallet", // your description
  tag: "bob", // give it a tag
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const newStream = await Moralis.Streams.add(stream);
const { id } = newStream.toJSON(); // { id: 'YOUR_STREAM_ID', ...newStream }

// Now we attach bobs address to the stream
const address = "0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4";

await Moralis.Streams.addAddress({ address, id });
```

### Via WebUI

1. Go to http://admin.moralis.io/streams
2. Click on `New Stream` button.
3. Fill out the Form:
   - Address: `0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4`
   - Description: `monitor Bobs wallet`
   - Webhook URL: `https://YOUR_WEBHOOK_URL`
   - Tag: `bob`
   - Select Blockchain (e.g. Ethereum Mainnet)
4. Click on `Create Stream`

### Monitor multiple addresses

If you want to add multiple addresses to another stream you can always attach
them to an existing stream. 

```typescript
await Moralis.Streams.addAddress({
  id: streamId,
  address: [
    "0xf977814e90da44bfa03b6295a0616a897441acec",
    "0x5754284f345afc66a98fbb0a0afe71e0f007b949",
  ], // Charlies and Douglas address
});
```

#### Attaching multiple addresses to a stream

You can attach millions of addresses to stream. You can remove and get addresses
aswell as adding new ones at any time.

```typescript
// Add addresses
await Moralis.Streams.addAddress({
  id: streamId,
  address: [
    "0xCFDF6Aaae9f6B927E3736FBD327853B622c5060E",
    "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  ], // Can also be a single string
});

// Delete an address
await Moralis.Streams.deleteAddress({
  id,
  address,
});

// Get all addresses
await Moralis.Streams.getAddresses({ id });
```

## Example 2 - Monitor a smart contract

Now let us monitor a specific event happening on a specific smart contract. In
this example we will monitor all CryptoPunks Transfers.

### Programmatically

```typescript
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

Moralis.start({
  apiKey: "YOUR_API_KEY",
});

const stream = {
  chains: [EvmChain.ETHEREUM], // punks are on ethereum mainnet
  description: "all cryptopunk transfers", // your description
  tag: "cryptoPunks", // give it a tag
  topic0: ["PunkTransfer(address,address,uint256)"], // topic0 is the event signature
  includeContractLogs: true, // we want to include contract logs
  abi: [{
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "punkIndex", "type": "uint256" },
    ],
    "name": "PunkTransfer",
    "type": "event",
  }],
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const newStream = await Moralis.Streams.add(stream);
const { id } = newStream.toJSON(); // id: StreamId

// Now we attach the contract address to the stream
const address = "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB";

await Moralis.Streams.addAddress({ address, id });
```

### Types

You can get typings for webhooks from the `@moralisweb3/streams` package.

```typescript
import { Types } from "@moralisweb3/streams";
```

### Via WebUI

1. Go to [Streams](http://admin.moralis.io/streams)
2. Click on `New Stream` button.
3. Fill out the Form:
   - Address: `0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`
   - Webhook URL: `https://YOUR_WEBHOOK_URL`
   - Paste in a valid ABI and select the topic
   - Descripition: `all cryptopunk transfers`
   - Tag: `bob`
   - Select Blockchain (e.g. Ethereum Mainnet)
4. Click on `Create Stream`

### Mandatory Test Webhook 🚨

Whenever you create or update a stream you will receive a test webhook.

**You have to return status code 200 for the stream to be start.**

The test body will look like this:

```json
{
  "abi": [],
  "block": {
    "hash": "",
    "number": "",
    "timestamp": ""
  },
  "txs": [],
  "txsInternal": [],
  "tag": "",
  "streamId": "",
  "logs": [],
  "chainId": "",
  "confirmed": true,
  "retries": 0,
  "erc20Approvals": [],
  "erc20Transfers": [],
  "nftApprovals": {
    "ERC721": [],
    "ERC1155": []
  },
  "nftTransfers": []
}
```

### Useful Stream Options

#### Include Contract Logs

The `includeContractLogs` option will include all contract logs in the webhook,
should be set to true if you are monitoring a contract. If you are monitoring a
wallet address you can set this to `true` to also get the contract logs if a
wallet interacts with a contract

#### Internal Transactions

You can also monitor all internal transactions happening on chain by setting the
`includeInternalTxs` to `true`.

#### Include Native Transactions

If you are monitoring contract events you can decide to also include the native
transaction details

#### Advanced Options

The Create Stream endpoint also supports advanced options. With this option you
can have more control over the topics you are passing to the stream. For each
topic you can have advanced options that include the `topic`, a
[filter](#filter-streams) and a `includeNativeTxs` field which indicates if you
want to include native transactions.

#### Monitor All Transactions by Topic

Say you have the following topic `Transfer(address,address,uint256)`. You can
get every transfer happening on chain by setting the topic to
`Transfer(address,address,uint256)` and setting `allAddresses` to `true`. That
means you will get all transactions that match this topic.

## We are live! 🎉

Now whenever an ingoing or outgoing transaction involving the address you are
monitoring occurs, you will receive a webhook with the transaction details.

### Two webhooks for each block

You will receive two webhooks for each block that contains the events you are
interested in.

The first webhook will come as soon as the block is mined and have
`confirmed:false`. This means that the block is still running the risk of being
dropped due to a reorganization of the blockchain.

The second webhook will come once enough blocks have been mined after the block
containing your events and have `confirmed:true`. This number of blocks is also
called `number of confirmations`.

[This table](https://github.com/MoralisWeb3/streams-beta/blob/main/README.md#supported-chains)
shows the number of confirmations required for Moralis to consider a block
confirmed.

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
      "streamId": "4f08e7df-3753-41f0-83ff-3fb24f7d0266"
    },
    ...
  ],
  "logs": [],
  "tag": "WALLET_1",
  "streamType": "wallet",
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
    "d63fff7a-1f49-45d8-ab99-1fe1f3aee449": [{
      // ... event abi
    }]
  }, // abis is ab object with the streamId as key and an array of abi items as value
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
      "topic3": null
    }
  ],
  "txs": [],
  "streamId": "d63fff7a-1f49-45d8-ab99-1fe1f3aee449",
  "tag": "bob",
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
      "tokenAddress": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      "tokenName": "SHIBA INU",
      "tokenSymbol": "SHIB",
      "tokenDecimals": "18",
      "valueWithDecimals": "9999678895.5486"
    }
  ],
  "tag": "shib_transfers",
  "streamId": "d63fff7a-1f49-45d8-ab99-1fe1f3aee449",
  "erc20Approvals": [],
  "nftTransfers": [],
  "nftApprovals": {
    "ERC721": [],
    "ERC1155": []
  }
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
  limit: 100, // limit the number of streams to return
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
      "topic0": [],
      "includeNativeTxs": true,
      "allAddresses": false,
      "includeContractLogs": true,
      "advancedOptions": [{
        "topic0": "string",
        "includeNativeTxs": true,
        "filter": {}
      }],
      "abi": [],
      "filter": "string",
      "address": "string",
      "chainIds": [
        "string"
      ],
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

#### Via WebUI

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

## Via WebUI

1. Go to [Streams](http://admin.moralis.io/streams).
2. Hover on the last column of the streams table. You will be able to see more
   options. (Edit, Delete, Pause Stream).
3. Select `Edit` to go to edit form page.
4. Change the things you want to update
5. Click on `Edit Stream`

# Filter Streams

## Operators

| Filter | Function                          | Note                    | Example                                  | Demo                                                                                            |
| ------ | --------------------------------- | ----------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| or     | either ... or ...                 | Need at least 2 filters | { "or" : [ {..filter1}, {...filter2} ]}  | [Mint/Burn USDC](#example-burnmint-tokens)                                                      |
| and    | all filters must satisfy          | Need at least 2 filters | { "and" : [ {..filter1}, {...filter2} ]} | [ENS Registration](#example-monitor-ens-name-registrations)                                     |
| eq     | checks for equality               |                         | { "eq": ["value", "1000"] }              | [Specifc NFT](#example-monitor-specific-nft)                                                    |
| ne     | checks for inequality             |                         | { "ne": ["address", "0x...325"] }        |                                                                                                 |
| lt     | value is less than                | Value must be a number  | { "lt": ["amount", "50"] }               |                                                                                                 |
| gt     | value is greater than             | Value must be a number  | { "gt": ["price", "500000"] }            | [USDT Whales](#example-get-usdt-transfers-above-100k-usdt)                                      |
| lte    | value is less than or equal to    | Value must be a number  | { "lte": ["value", "100"] }              |                                                                                                 |
| gte    | value is greater than or equal to | Value must be a number  | { "gte": ["value", "100"] }              | [Mint/Burn USDC](#example-burnmint-tokens)                                                      |
| in     | value is in array                 | Must provide an array   | { "in": ["city": ["berlin", "paris"]]}   | [Specifc CryptoPunks](#example-monitor-specific-cryptopunk-nfts-based-on-an-array-of-token-ids) |
| nin    | value is not in array             | Must provide an array   | { "nin": ["name": ["bob", "alice"]]}     |                                                                                                 |

In some cases you might want to filter the data you receive from the webhook.
You can do this by adding a filter to the stream. Important: You must add a
(valid!) ABI of the event you want to filter! Otherwise the stream will not work

## Example: Monitor Specific NFT Based on Token ID

### Programmatically

```typescript
import { Moralis } from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

const options = {
  chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
  description: "monitor one NFT from Collection", // your description
  tag: "mySpecialNft", // give it a tag
  topic0: ["Transfer(address,address,uint256)"], // the event you want to monitor
  includeContractLogs: true,
  abi: [{
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "to", "type": "address" },
      { "indexed": false, "name": "tokenId", "type": "uint256" },
    ],
    "name": "Transfer",
    "type": "event",
  }], // valid abi of the event
  advancedOptions: [
    {
      topic0: "Transfer(address,address,uint256)",
      filter: {
        eq: ["tokenId", "1"], // only receive events where tokenId is 1
      },
      includeNativeTxs: true,
    },
  ],
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const stream = await Moralis.Streams.add(stream);

// Attach the contract address to the stream
await Moralis.Streams.addAddress({
  id: stream.id,
  address: "0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4", // contract address of the NFT
});
```

### Via WebUI

1. Create a new Stream
2. Fill out the form
3. Switch on event emittance and add the Abi and select the topic.
4. Add the below to Advanced options

```json
[
  {
    "topic0": "Transfer(address,address,uint256)",
    "filter": { "eq": ["tokenId", "1"] }
  }
]
```

5. Click on create stream.

## Example: Get USDT Transfers above 100K USDT AND Approvals Above 100k

### Programmatically

```typescript
const transferAbi = {
  "anonymous": false,
  "inputs": [
    { "indexed": true, "name": "from", "type": "address" },
    { "indexed": true, "name": "to", "type": "address" },
    { "indexed": false, "name": "value", "type": "uint256" },
  ],
  "name": "Transfer",
  "type": "event",
}; // valid abi of the event

const approvalAbi = {
  "anonymous": false,
  "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, {
    "indexed": true,
    "name": "spender",
    "type": "address",
  }, { "indexed": false, "name": "value", "type": "uint256" }],
  "name": "Approval",
  "type": "event",
};

const options = {
  chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
  description: "whale transactions", // your description
  tag: "usdtwhale", // give it a tag
  topic0: ["Transfer(address,address,uint256)", "Approval(address,address,uint256)], // topic of the event
  includeContractLogs: true,
  abi: [transferAbi, approvalAbi],
  advancedOptions: [
    {
      topic0: "Transfer(address,address,uint256)",
      filter: { "gt": ["value", "100000000000"] }, // only receive events where the value is above 100k USDT
      includeNativeTxs: true,
    },
    {
      topic0: "Approval(address,address,uint256)",
      filter: { "gt": ["value", "100000000000"] },
      includeNativeTxs: true,
    }
  ],
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const stream = await Moralis.Streams.add(stream);

await Moralis.Streams.addAddress({
  id: stream.id,
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
})
```

### Via WebUI

1. Create a new Stream
2. Fill out the form
3. Switch on Event Emittance and Add the Abi and select the topic
4. Add below value to advanced options

```json
[
  {
    "topic0": "Approval(address,address,uint256)",
    "filter": { "gt": ["value", "100000000000"] }
  }
]
```

5. Click on create stream button.

## Example: Monitor specific CryptoPunk NFTs Based on an array of Token IDs

### Programmatically

```typescript
const punkTransferAbi = [{
  "anonymous": false,
  "inputs": [
    { "indexed": true, "name": "from", "type": "address" },
    { "indexed": true, "name": "to", "type": "address" },
    { "indexed": false, "name": "punkIndex", "type": "uint256" },
  ],
  "name": "PunkTransfer",
  "type": "event",
}]; // valid abi of the event

const options = {
  chains: [EvmChain.ETHEREUM], // list of blockchains to monitor
  description: "1000 to 1002 cryptopunks", // your description
  tag: "cryptoPunks", // give it a tag
  abi: punkTransferAbi,
  includeContractLogs: true,
  topic0: ["PunkTransfer(address,address,uint256)"], // topic of the event
  advancedOptions: [
    {
      topic0: "PunkTransfer(address,address,uint256)",
      filter: { "in": ["punkIndex", ["1000", "1001", "1002"]] }, // only receive transfer events if the token id is 1000/1001/1002
      includeNativeTxs: true,
    },
  ],
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const stream = await Moralis.Streams.add(stream);

// Attach the contract address to the stream
await Moralis.Streams.addAddress({
  id: stream.id,
  address: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", // crypto punks address
});
```

### Via WebUI

1. Create a new Stream
2. Fill out the form
3. Switch on Event Emittance and Add the Abi and select the topic
4. Add below value to advanced options

```json
[
  {
    "topic0": "PunkTransfer(address,address,uint256)",
    "filter": { "in": ["punkIndex", ["1000", "1001", "1002"]] }
  }
]
```

5. Click on create stream button.

## Example: Monitor ENS Name Registrations

Lets check if a specific address has registered an ENS name that costs higher
than 1 ETH.

### Programmatically

```typescript
const ensNameRegisteredAbi = [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "string",
      "name": "name",
      "type": "string",
    },
    {
      "indexed": true,
      "internalType": "bytes32",
      "name": "label",
      "type": "bytes32",
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address",
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "cost",
      "type": "uint256",
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "expires",
      "type": "uint256",
    },
  ],
  "name": "NameRegistered",
  "type": "event",
}]; // valid abi of the event

const filter = {
  "and": [
    { "eq": ["owner", "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5"] },
    { "gt": ["cost", "1000000000000000000"] },
  ],
}; // only receive registration events if the owner is the address and the cost is higher than 1 ETH

const options = {
  chains: [EvmChain.ETHEREUM], // Ethereum Name Service so we only monitor Ethereum
  description: "ENS Name Registrations", // your description
  tag: "ensRegistrationByBob", // give it a tag
  abi: ensNameRegisteredAbi,
  filter,
  topic0: ["NameRegistered(string,bytes32,address,uint256,uint256)"],
  includeContractLogs: true,
  advancedOptions: [
    {
      topic0: "NameRegistered(string,bytes32,address,uint256,uint256)",
      filter,
      includeNativeTxs: true,
    },
  ],
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const stream = await Moralis.Streams.add(options);

// Attach the contract address to the stream
await Moralis.Streams.addAddress({
  id: stream.id,
  address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // ENS Registry address
});
```

### Via WebUI

1. Create a new Stream
2. Fill out the form
3. Switch on Event Emittance and Add the Abi and select the topic
4. Add below value to advanced options

```json
[
  {
    "topic0": "NameRegistered(string,bytes32,address,uint256,uint256)",
    "filter": {
      "and": [
        { "eq": ["owner", "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5"] },
        { "gt": ["cost", "1000000000000000000"] }
      ]
    }
  }
]
```

5. Click on create stream button.

## Example: Burn/Mint Tokens

Lets check if a specific wallet burns or mints at least 100K USDC

### Programmatically

Lets check all USDC transfers but filter transaction where the recipent or the
sender is the zero address and if the amount is greater or equal to 10000 USDC

```typescript
const transferUsdcAbi = [{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "from",
      "type": "address",
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "to",
      "type": "address",
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256",
    },
  ],
  "name": "Transfer",
  "type": "event",
}];

const filter = {
  "or": [
    {
      "and": [
        { "eq": ["sender", "0x00000...00000"] },
        { "gte": ["amount", "10000000000"] },
      ],
    },
    {
      "and": [
        { "eq": ["receiver", "0x00000...00000"] },
        { "gte": ["amount", "10000000000"] },
      ],
    },
  ],
}; // we will only receive events when the transfer recipent or the sender is the zero address meaning we are filtering mints and burn

const options = {
  chains: [EvmChain.ETHEREUM], // Monitor USDC on ethereum
  description: "ENS Name Registrations", // your description
  tag: "mintsAndBurns", // give it a tag
  abi: transferUsdcAbi,
  includeContractLogs: true,
  topic0: ["Transfer(address,address,uint256)"],
  advancedOptions: [
    {
      topic0: "Transfer(address,address,uint256)",
      filter,
      includeNativeTxs: true,
    },
  ],
  filter,
  webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
};

const stream = await Moralis.Streams.add(options);

// Attach the contract address to the stream
await Moralis.Streams.addAddress({
  id: stream.id,
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC address
});
```

### Via WebUI

1. Create a new Stream
2. Fill out the form
3. Switch on Event Emittance and Add the Abi and select the topic
4. Add below value to advanced options

```json
[
  {
    "topic0": "Transfer(address,address,uint256)",
    "filter": {
      "or": [
        {
          "and": [
            { "eq": ["sender", "0x00000...00000"] },
            { "gte": ["amount", "10000000000"] }
          ]
        },
        {
          "and": [
            { "eq": ["receiver", "0x00000...00000"] },
            { "gte": ["amount", "10000000000"] }
          ]
        }
      ]
    }
  }
]
```

5. Click on create stream button.

# Update/Pause a Stream

You can update the status of a stream at any time. Possible values for status
are `active`, `paused` and `error`.

For example: In some cases you might want to pause a stream. You can do this by
calling the specific endpoint.

## Programmatically

```typescript
await Moralis.Streams.updateStatus({
  id: "YOUR_STREAM_ID",
  status: "paused",
});
```

## Via WebUI

1. Go to [Streams](http://admin.moralis.io/streams).
2. Hover on the last column of the streams table. You will be able to see more
   options. (Edit, Delete, Pause Stream).
3. Select `Pause Stream` to change the status of your stream

## Via HTTP Request

```curl
curl -X 'POST' \
  'https://api.moralis-streams.com/streams/evm/STREAM_ID/status' \
  -H 'accept: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"status": "paused"}'
```

# Error Handling

Moralis guarantees 100% delivery of webhooks. Still you can have errors in your
streams for example if your server is down. Moralis will retry to send the
webhook in intervals. If the webhook is not delivered after 24 hours but you
still want to receive the failed webhooks after some time you can manuallay
[replay](#replay-failed-webhook) the failed webhooks.

## Error State

Your Stream can enter into error state on the following 2 scenarios:

1. Your webhook success-rate is below 70%

2. Your webhook is not consuming the webhooks fast enough so a queue start to build up and reached the limit of 10k queued, 
you can monitor the size of the queue with the header x-queue-size when you receive the webhook, You need to ensure your
server can consume all webhooks fast enough so a queue doesnt build up, moving the streams to a closer region will help
reduce the time.

A stream in Error state will stop sending webhook but will continue saving them in history and the retry schedule will 
resume when the stream is enabled again.

If your Stream enters Error State you will receive a Email notification so you can act before it gets terminated.

## Terminated State

If your Stream stays in Error State for 24 Hours it will be terminated.

A Terminated Stream will not send webhooks and will not process any new blocks, this means the blocks will be dropped.

If your Stream is terminated you will receive a Email notification 

## Retry Intervals

| Retry | Interval |
| ----- | -------- |
| 0     | 1 min    |
| 1     | 10 min   |
| 2     | 1 hour   |
| 3     | 2 hours  |
| 4     | 6 hours  |
| 5     | 12 hours |
| 6     | 1 day    |

## See failed webhooks

The Streams API provides an endpoint to get all failed webhooks. It is useful to
replay the failed webhooks.

While in BETA, all failed webhooks are stored for 48 Hours, once Streams is in production different plans will allow up to 2 weeks retention.

### Programmatically

```typescript
const history = await Moralis.Streams.getHistory({ limit: 100 });
```

### Via WebUI

1. Go to [Failed Deliveries](http://admin.moralis.io/streams/failed). All your
   failed deliveries are listed here.

### Response

The Response is a list of failed webhooks that are uniquely identified by id.
The payload contains the webhook details.

```json
{
  "result": [
    {
      "id": "HISTORY_ID",
      "date": "string",
      "payload": {
        // the failed webhook
      },
      "tinyPayload": {
        "block": {},
        "chainId": "",
        "amount": 0
      },
      "streamId": "STREAM_ID",
      "tag": "TAG",
      "errorMessage": "string",
      "webhookUrl": "string"
    }
  ],
  "total": "number",
  "cursor": "string"
}
```

## Replay Failed Webhook

You can replay (retry) a failed webhook by calling the specific endpoint.

### Programmatically

```typescript
await Moralis.Streams.retryWebhook({ id: "HISTORY_ID", streamId: "STREAM_ID" });
```

### Via WebUI

1. Go to [Failed Deliveries](http://admin.moralis.io/streams/failed).
2. Click on the `replay` icon against your failed delivery

## Via Swagger or HTTP

You can use the Swagger UI or make an API call to the endpoint.

```curl
curl -X 'POST' \
  'https://api.moralis-streams.com/history/replay/WEBHOOK_ID' \
  -H 'accept: application/json' \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
```

## Webhook Successrate

Every Stream starts with a successrate of 100% per webhook URL. For every failed
webhook the rate decreases by 1% per webhook URL. For every successful webhook
the rate increases by 1% per webhook URL where the maximum is 100%. If the
success rate is below 70% per webhook URL the stream will be discontinued and an
email is sent to you. The status of your stream will be set to `error`.

If you want to continue receiving events you can
[update the status of a stream](#updatepause-a-stream) to `active`.

# Get Stats (Beta - This endpoint could be replaced or removed)

You can get stats about your streams usage

## Via WebUI

The UI for this feature is currently under development

## Via HTTP Request

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
