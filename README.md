![alt text](https://cdn-images-1.medium.com/max/1600/1*hGJHnXJuOmfjIcEofbC0Ww.png 'Ambrosus')

# Ambrosus SDK

<!-- BADGES -->

[![Build Status](https://travis-ci.com/ambrosus/sdk-javascript2.svg?branch=master)](https://travis-ci.com/ambrosus/sdk-javascript2) [![Coverage Status](https://img.shields.io/badge/coverage-93%25-brightgreen.svg)](https://github.com/ambrosus/sdk-javascript2)

<!-- END BADGES -->

Library for simple interaction with Ambrosus API.


## Overview

- [Prerequisite](#prerequisite)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contribution](#contribution)

## Prerequisite

In order to use Ambrosus SDK, first you _need to have a developers account_.\
You can [apply for one here](https://test.ambrosus.com/dashboard).

Ambrosus team will send you an email with your account **address** and **secret** key.

**Important note:**
PLEASE DO NOT SHARE YOUR SECRET WITH ANYONE. \
We do not store your secret for security reasons, so please save it somewhere safe, in order to use it in SDK.

_To use Ambrosus SDK, you will need your **address** and **secret** key._\
Now we can go to setup.

## Installation
```console
$ npm install ambrosus-javascript-sdk --save
```

## Usage
_Import the SDK in your javascript file_
```javascript
// with the classic require...
const AmbrosusSDK = require('ambrosus-javascript-sdk')
// ... or with the new import directive.
import AmbrosusSDK from 'ambrosus-javascript-sdk'
```
Initializing the Ambrosus library.
_The following properties can be passed while initializing the library._
The ideal way to pass the properties is using the environment variables.

|Property    | Type | Defination | Example. |
|---|---|---|---|
|secret      | string | Secret key you received in email.| 0x6823520c03ad7b17....|
|rpcURL      | string | RPC URL of the blockchain network. | https://network.ambrosus-test.com |
|apiEndpoint | string | Hermes API url. | https://test-nop.ambrosus-test.com |
|headeres | object | header object for api request | {Authorization: 'AMB ....'}|

Intializing SDK to request or querying data.
```javascript
const ambrosus = new AmbrosusSDK({
  apiEndpoint: 'https://test-nop.ambrosus-test.com',
});
```
Initializing SDK to create assets and events.
```javascript
ambrosus = new AmbrosusSDK({
  secret: '0x6823520c03ad7b17....',
  apiEndpoint: 'https://test-nop.ambrosus-test.com',
});
```
We can initialize the SDK by directly providing the authorization header, so that secret key will not be required for creating assets and events
```javascript
const ambrosus = new AmbrosusSDK({
  headers: {
    Authorization: 'AMB ....',
  },
  apiEndpoint: 'https://test-nop.ambrosus-test.com',
});
```
Initializing SDK to work with the blockchain network.
```javascript
ambrosus = new AmbrosusSDK({
  rpcURL: 'https://network.ambrosus-test.com',
  secret: '0x6823520c03ad7b17....',
});
```
## Examples

See working [Examples](examples/) of how the SDK can be used.

## Contribution

Please refer to project's code style guidelines and guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

It is mandatory to follow our code of conduct described in [CONTRIBUTING.md](https://github.com/ambrosus/sdk-javascript2/blob/master/CONTRIBUTING.md).

## API Coverage

* Assets
  - [x] Get by ID.
  - [x] Get by Object.
  - [ ] Get by identifiers.
  - [x] Get multiple Assets.
  - [x] Create Asset.
* Events
  - [x] Get by ID.
  - [x] Get by Object.
  - [ ] Get by identifiers.
  - [x] Get multiple Events.
  - [x] Create Event
  - [x] Parse Events.
* Bundles
  - [x] Get Bundle by ID.
  - [x] Get Bundle by object
* Accounts
  - [x] Add Account.
* Transaction
  - [x] Send Transaction.
  - [x] Get Transaction.
  - [x] Get Transaction Receipt.
  - [x] Get Transaction Count.
* Blocks
  - [x] Get Blocks.
  - [x] Get Latest Block.
* Service
  - [x] Get Private Key Pair.
  - [x] Get Account.
  - [x] Get Address.
  - [x] Sign
  - [x] Encrypt Private key.
  - [x] Decrypt Private key.
  - [x] Verify Events.
  - [x] RPC Validation.

## License

This project is licensed under MIT.
