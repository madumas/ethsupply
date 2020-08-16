import * as fs from 'fs';
import BigNumber from "bignumber.js"
let _this;

const miningRewards = [
  {block: 0, reward: 5},
  {block: 4370000, reward: 3}, //EIP-649 - Byzantium
  {block: 7280000, reward: 2}  //EIP-1234 - Constantinople
];
const defaultGenesis = new BigNumber(72009990499480000000000000);

export default class ethSupply {
  constructor(web3, targetBlock, foundationFile) {
    this.foundationFile = foundationFile;
    this.targetBlock = targetBlock==='latest'?null:targetBlock;
    this.web3 = web3;
    _this=this;
  }

  genesisSupply() {
    if (this.foundationFile!=='none') {
      const foundation = JSON.parse(fs.readFileSync(this.foundationFile));
      return Object.values(foundation.accounts).reduce((a,c)=>a.plus(c.balance||0),new BigNumber(0));
    } else {
      return defaultGenesis;
    }
  }

  baseReward(blockNumber) {
    return miningRewards.filter( rule => (rule.block <= blockNumber) )
      .reduce( (smaller,rule)=>Math.min(smaller,rule.reward),5 );
  }

  async run() {
    const initialSupply = this.genesisSupply();
    const batchSize = 10000;
    let blockRewards = new BigNumber(0);
    let uncleRewards = new BigNumber(0);
    const lastBlockNumber = this.targetBlock || await _this.web3.eth.getBlockNumber();

    //Iterate every block, except block 0
    for(let base=0;base<=lastBlockNumber;base+=batchSize) {
      const promises=[];
      for (let i=0;i<batchSize && (base+i)<=lastBlockNumber;i++) {
        if(base+i===0) continue;
        promises.push(new Promise( (resolve,reject) => {
          const blockNumber = base+i;
          const baseReward = new BigNumber(this.baseReward(blockNumber)*1E18);
          _this.web3.eth.getBlock(blockNumber).then(block => {
            const totalReward = baseReward.plus(baseReward.dividedBy(32).multipliedBy(block.uncles.length));
            let blockUncleRewards=new BigNumber(0);

            if(block.uncles.length>0) {
              const unclePromises=[];
              for(let index=0;index<block.uncles.length;index++) {
                unclePromises.push(
                  new Promise((uncleResolve,uncleReject)=>
                  _this.web3.eth.getUncle(blockNumber,index).then(uncleBlock => {
                    blockUncleRewards = blockUncleRewards.plus(baseReward.multipliedBy(uncleBlock.number + 8 - blockNumber).dividedBy(8));
                    uncleResolve();
                  }))
                );
              }

              Promise.all(unclePromises).then(()=>resolve({totalReward,blockUncleRewards}));
            } else {
              resolve({totalReward,blockUncleRewards});
            }
          })
        }));
      }
      const batchRewards = await Promise.all(promises);
      batchRewards.forEach(batch => {
        blockRewards = blockRewards.plus(batch.totalReward);
        uncleRewards = uncleRewards.plus(batch.blockUncleRewards);
      });
      if((base+batchSize)%100000===0)
        console.log('Block ' + (base+batchSize) + " Cumulative block rewards:"+blockRewards.dividedBy(1E18).toNumber()
          + ' uncle rewards:' + uncleRewards.dividedBy(1E18).toNumber()
          + ' totalSupply: ' + (initialSupply.plus(blockRewards).plus(uncleRewards).dividedBy(1E18).toNumber()));
    }

    console.log('\nGenesis Supply: '+initialSupply.dividedBy(1E18).toNumber());
    console.log('Block rewards: '+blockRewards.dividedBy(1E18).toNumber());
    console.log('Uncle rewards: '+uncleRewards.dividedBy(1E18).toNumber());
    console.log('Total Supply: '+(initialSupply.plus(blockRewards).plus(uncleRewards).dividedBy(1E18).toNumber())
    + ' at block:'+lastBlockNumber);
  }
}
