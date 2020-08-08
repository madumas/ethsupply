# ethsupply
Calculates the total amount of Eth ever issued.

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
Block 10590000 Cumulative block rewards:37313251.28125 uncle rewards:3055454.625
Block 10600000 Cumulative block rewards:37333290.53125 uncle rewards:3056596.125
Block 10610000 Cumulative block rewards:37353328.53125 uncle rewards:3057708.375

Genesis Supply: 72009990.5
Block rewards:37361706.21875
Uncle rewards:3058130.375
Total Supply: 112429827.09375 at block:10614181
```
