# ethsupply
Calculates the total amount of Eth ever **issued** by applying the Ethereum protocol rules in regards to genesis block, mining rewards, and uncle rewards. 

To determine the amount of Eth that **exists**, checkout [Nethermind's SupplyVerifier script](https://docs.nethermind.io/nethermind/guides-and-helpers/custom-analytic-tools). This method has the advantage of taking into account Eth destroyed by `selfdestruct()` with balances sent to self. Plus it does by traversing the complete Merkle tree and will convince the most skeptical. 

## Features
- Connects to an ethereum node, to query every block
- Calculate the block reward (5, 3 or 2 ETH), uncle reward (1/32 of the block reward) and block uncle reward.
 

## Installation
`npm install`

## Usage
```node src/cli.js 
ethsupply <cmd> [args]

Options:
  --version         Show version number                                [boolean]
  --block           Specify which block to target   [string] [default: "latest"]
  --foundationFile  Specify an OpenEthereum or Parity foundation.json as the
                    source for genesis supply. If none specified, use the
                    precomputed value of 72009990.49948
                                                      [string] [default: "none"]
  --wsurl           Specify the WS URL of an ethereum node   [string] [required]
  --help            Show help                                          [boolean]

```

Example:
```
 node src/cli.js --wsurl ws://192.168.0.23:8546 --block 1000000 --foundationFile ./foundation.json
```

### Foundation File
To verify the initial supply of Eth, you may provide a Parity/OpenEthereum `foundation.json` file to the script. It will read the file and sum all the balances of the genensis accounts.
- [OpenEthereum](https://github.com/openethereum/openethereum/blob/master/ethcore/res/ethereum/foundation.json)
- [Parity](https://github.com/paritytech/parity/blob/master/ethcore/res/ethereum/foundation.json)

