
let argv = require('yargs')
  .scriptName("ethsupply")
  .usage('$0 <cmd> [args]')
  .option('block', {
    describe: 'Specify which block to target',
    default: 'latest',
    demandOption: false,
    type: 'string'
  })
  .option('foundationFile', {
    describe: 'Specify an OpenEthereum or Parity foundation.json as the source for genesis supply. If none specified, use the precomputed value of XXX',
    default: 'none',
    demandOption: false,
    type: 'string'
  })
  .option('wsurl', {
    describe: 'Specify the WS URL of an ethereum node',
    type: 'string'
  })
  .demandOption(['wsurl'])
  .help()
  .argv;

require('@babel/register');
const main = require('./main').default;
main(argv);
