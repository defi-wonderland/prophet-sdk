# Prophet SDK

[![Version](https://img.shields.io/npm/v/@defi-wonderland/prophet-sdk?label=Version&tag=latest)](https://www.npmjs.com/package/@defi-wonderland/prophet-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/defi-wonderland/prophet-sdk/blob/main/LICENSE)
[![Tests](https://github.com/defi-wonderland/prophet-sdk/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/defi-wonderland/prophet-sdk/actions/workflows/tests.yml)

⚠️ The code is under development, tread with caution.

## Overview

Lightweight and user-friendly wrapper around Prophet contracts. The SDK will be a wrapper for blockchain calls, and will support all of the shared interfaces mirroring all of the oracle’s and the modules’ functions in the **[Smart Contracts](https://github.com/defi-wonderland/prophet-core/blob/main/solidity/contracts)**.

The SDK will also support adding custom modules so that any developer can create and use modules specific to their use case.

## Development

To set up the development environment:

Clone the repository:

```bash
git clone git@github.com:defi-wonderland/prophet-sdk.git && cd prophet-sdk
```

Install dependencies:

```bash
yarn install
```

Build sdk:

```bash
yarn build
```

Run tests:

```bash
yarn test
```

Check coverage:

```bash
yarn test:coverage
```

> **Fill the .env file with your API keys as needed**

## Installation

You can install the SDK package via yarn or npm. Make sure you have Node.js and yarn installed.

```sh
yarn add prophet-sdk
```

```sh
npm i prophet-sdk
```

## File Structure

```
~~ Structure ~~
├── .github/workflows/: Github actions
│   ├─── canary.yml: Release a canary build manually [dispatch]
│   ├─── lint.yml: Check code linting on commit push
│   ├─── release.yml: Release to npm on merge to main
│   ├─── tests.yml: Run tests on commit push
├── .husky/: Git hook scripts
├── src/: The core SDK scripts and logic
│   ├─── batching/: General batching functions for efficient RPC calls
│   │    ├─── abi/: Batching contracts ABIs
│   │    ├─── contracts/: Batching contracts
│   │    ├─── batching.ts: Batching helpers for multiple RPC calls
│   │    └─── ...: Helpers for handling batching dispute, request, and response data
│   ├─── config/: Configuration and environment setup across the library
│   ├─── helpers/: General helper functions used throughout the library
│   ├─── ipfs/: General IPFS management
│   ├─── modules/: General module management
│   ├─── types/: All definitions of contract types and general types
│   │    ├─── Module.ts: Module-related types
│   │    └─── types.ts: General data types
│   ├─── utils/: Utility functions
│   │    ├─── cid.ts: Utility for IPFS Content Identifier (CID) handling
│   │    └─── constants.ts: Storage of library-wide constants
│   ├─── ipfsApi.ts: Wrapper logic for the Pinata SDK
│   ├─── module.ts: Wrapper logic for the Module contract
│   ├─── oracle.ts: Main logic for the Oracle SDK
│   └─── ...
├── test/unit: Unit tests for the SDK components
│   └─── ...: Test files
├── README.md: This README file providing project information and usage guidelines
└── ...: Other repository-related files and directories
```

## Live example

You can find the live code example [here](https://codesandbox.io/p/github/defi-wonderland/prophet-sdk-example)

And the example repository [here](https://github.com/defi-wonderland/prophet-sdk-example)

## Contributors

Prophet SDK was built with ❤️ by [Wonderland](https://defi.sucks).

Wonderland is a team of top Web3 researchers, developers, and operators who believe that the future needs to be open-source, permissionless, and decentralized.

[DeFi sucks](https://defi.sucks), but Wonderland is here to make it better.
