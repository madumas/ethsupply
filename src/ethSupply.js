let _this;
export default class ethSupply {
  constructor(web3) {
    this.web3 = web3;
    _this=this;
  }

  async run() {
    console.log('start');
    const genesisSupply = 72009990.50;
    const batchSize = 10000;
    const getBurnedETH = web3.eth.getBalance("0x0000000000000000000000000000000000000000")
    const BurnedETH =  parseInt(getBurnedETH) / 10**18
    let blockRewards=0;
    let uncleRewards=0;
    const lastBlockNumber = await _this.web3.eth.getBlockNumber();

    for(let base=0;base<=lastBlockNumber;base+=batchSize) {
        const promises=[];
        for (let i=0;i<batchSize && (base+i)<=lastBlockNumber;i++) {
          promises.push(new Promise( (resolve,reject) => {
            const blockNumber = base+i;
            let baseReward;
            if(blockNumber<4370000) //EIP-649
              baseReward=5;
            else
            if(blockNumber<7280000) //EIP-1234
              baseReward=3;
            else
              baseReward=2;
            _this.web3.eth.getBlock(blockNumber).then(block => {

              const totalReward = baseReward + baseReward * (1 / 32) * block.uncles.length;
              blockRewards += totalReward;

              if(block.uncles.length>0) {
                const unclePromises=[];
                let blockUncleRewards=0;
                for(let index=0;index<block.uncles.length;index++) {
                  unclePromises.push(
                    new Promise((uncleResolve,uncleReject)=>
                    _this.web3.eth.getUncle(blockNumber,index).then(uncleBlock => {
                      blockUncleRewards += baseReward * (uncleBlock.number + 8 - blockNumber) / 8;
                      uncleResolve();
                    }))
                  );
                  Promise.all(unclePromises).then(()=>{
                    uncleRewards+=blockUncleRewards;
                    resolve()
                  });
                }
              } else {
                resolve();
              }

              if(blockNumber%batchSize===0)
                console.log('Block ' + blockNumber + " Cumulative block rewards:"+blockRewards + ' uncle rewards:'+uncleRewards);
            })
          }));
        }
        await Promise.all(promises);
    }
    console.log('\nGenesis Supply: '+genesisSupply);
    console.log('Block rewards:'+blockRewards);
    console.log('Uncle rewards:'+uncleRewards);
    console.log('Total Supply: '+((genesisSupply+blockRewards+uncleRewards) - BurnedETH) + ' at block:'+lastBlockNumber);
  }
}
