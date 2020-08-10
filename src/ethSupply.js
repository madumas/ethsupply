let _this;

const miningRewards = [
  {block: 0, reward: 5},
  {block: 4370000, reward: 3}, //EIP-649 - Byzantium
  {block: 7280000, reward: 2}  //EIP-1234 - Constantinople
];

export default class ethSupply {
  constructor(web3) {
    this.web3 = web3;
    _this=this;
  }

  async run() {
    console.log('start');
    const genesisSupply = 72009990.50;
    const batchSize = 10000;
    let blockRewards=0;
    let uncleRewards=0;
    const lastBlockNumber = await _this.web3.eth.getBlockNumber();

    //Iterate every block, except block 0
    for(let base=1;base<=lastBlockNumber;base+=batchSize) {
      const promises=[];
      for (let i=0;i<batchSize && (base+i)<=lastBlockNumber;i++) {
        promises.push(new Promise( (resolve,reject) => {
          const blockNumber = base+i;
          const baseReward = miningRewards.filter( rule => (rule.block < blockNumber) )
            .reduce( (smaller,rule)=>Math.min(smaller,rule.reward),5 );
          _this.web3.eth.getBlock(blockNumber).then(block => {
            const totalReward = baseReward + baseReward * (1 / 32) * block.uncles.length;
            let blockUncleRewards=0;

            if(block.uncles.length>0) {
              const unclePromises=[];
              for(let index=0;index<block.uncles.length;index++) {
                unclePromises.push(
                  new Promise((uncleResolve,uncleReject)=>
                  _this.web3.eth.getUncle(blockNumber,index).then(uncleBlock => {
                    blockUncleRewards += baseReward * (uncleBlock.number + 8 - blockNumber) / 8;
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
        blockRewards += batch.totalReward;
        uncleRewards += batch.blockUncleRewards;
      });
      console.log('Block ' + (base+batchSize) + " Cumulative block rewards:"+blockRewards + ' uncle rewards:'+uncleRewards);
    }
    console.log('\nGenesis Supply: '+genesisSupply);
    console.log('Block rewards: '+blockRewards);
    console.log('Uncle rewards: '+uncleRewards);
    console.log('Total Supply: '+(genesisSupply+blockRewards+uncleRewards)+ ' at block:'+lastBlockNumber);
  }
}
