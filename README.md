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
account.

### Let's go 🚀

In this example we are going to monitor all transactions from a wallet. We will
use Moralis SDK to create a stream. You will find your API Key in your Account
Settings.

### Programmatically

```typscript
import Moralis from 'moralis';

Moralis.start({
  apiKey: 'YOUR_API_KEY',
});

const stream = {
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B' // address to monitor
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

```
```
