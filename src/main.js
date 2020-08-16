import ethSupply from './ethSupply';
const Web3 = require("web3");

 export default function main(argv) {
    let ws, web3;

    async function connect() {
        console.log("connect");
        ws = new Web3.providers.WebsocketProvider(argv.wsurl);
        ws.on('end', e => {
            console.log('Socket is closed. Reconnect will be attempted in 10 seconds.', e.reason);
            setTimeout(function () {
                connect();
            }, 10000);
        });

        ws.on('error', err => {
            console.error('Socket encountered error: ', err.message, 'Closing socket  and reconnect');
        });

        ws.on('connect', function () {
            console.log('WS Connected');
            web3 = new Web3(ws);
            let supply = new ethSupply(web3, argv.block, argv.foundationFile);
            supply.run();
        });
    }

    connect().then(function(){});
}
