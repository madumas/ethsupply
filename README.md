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
 node src/cli.js --wsurl ws://192.168.0.23:8546 --block 9193265
 connect
 WS Connected
 Block 1000000 Cumulative block rewards:5012556.875 uncle rewards:289365.625 totalSupply: 77311912.99948
 Block 2000000 Cumulative block rewards:10024312.1875 uncle rewards:560317.5 totalSupply: 82594620.18698
 Block 3000000 Cumulative block rewards:15038120.78125 uncle rewards:870480.625 totalSupply: 87918591.90573
 Block 4000000 Cumulative block rewards:20048662.5 uncle rewards:1104892.5 totalSupply: 93163545.49948
 Block 5000000 Cumulative block rewards:23804629.53125 uncle rewards:1489207.625 totalSupply: 97303827.65573
 Block 6000000 Cumulative block rewards:26824853.09375 uncle rewards:1979127.125 totalSupply: 100813970.71823
 Block 7000000 Cumulative block rewards:29838045.21875 uncle rewards:2312522.75 totalSupply: 104160558.46823
 Block 8000000 Cumulative block rewards:32123094.90625 uncle rewards:2444945.875 totalSupply: 106578031.28073
 Block 9000000 Cumulative block rewards:34127274.78125 uncle rewards:2553891.125 totalSupply: 108691156.40573
 
 Genesis Supply: 72009990.49948
 Block rewards: 34514401.59375
 Uncle rewards: 2569622.125
 Total Supply: 109094014.21823 at block:9193265
```

### Foundation File
To verify the initial supply of Eth, you may provide a Parity/OpenEthereum `foundation.json` file to the script. It will read the file and sum all the balances of the genensis accounts.
- [OpenEthereum](https://github.com/openethereum/openethereum/blob/master/ethcore/res/ethereum/foundation.json)
- [Parity](https://github.com/paritytech/parity/blob/master/ethcore/res/ethereum/foundation.json)

