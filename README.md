# ethsupply
Calculates the total amount of Eth ever **issued** by applying the Ethereum protocol rules in regards to mining rewards and uncle rewards.

To determine the amount of Eth that **exists**, checkout [Nethermind's SupplyVerifier script](https://docs.nethermind.io/nethermind/guides-and-helpers/custom-analytic-tools). This method has the advantage of taking into account Eth destroyed by `selfdestruct()` with balances sent to self. Plus it does by traversing the complete Merkle tree and will convince the most skeptical. 

## Features
- Connects to an ethereum node, to query every block
- Calculate the block reward (5, 3 or 2 ETH), uncle reward (1/32 of the block reward) and block uncle reward.
 

## Installation
`npm install`

## Usage
`export WSNODE=ws://nodeaddress:8546 && yarn start` 

Example:
```
#export WSNODE=ws://nodeaddress:8546 && yarn start
connect
WS Connected
start
(...)
Block 10600001 Cumulative block rewards:37333286.53125 uncle rewards:2710763.375
Block 10610001 Cumulative block rewards:37353326.53125 uncle rewards:2711803.875
Block 10620001 Cumulative block rewards:37372746.59375 uncle rewards:2712745.125

Genesis Supply: 72009990.5
Block rewards: 37372746.59375
Uncle rewards: 2712745.125
Total Supply: 112095482.21875 at block:10619692
```
