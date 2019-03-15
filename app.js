const TurtleCoind = require('turtlecoin-rpc').TurtleCoind;
const db = require('quick.db');
let currentHeight;
let memPool;

const daemon = new TurtleCoind({
  host: 'extrahash.tk', // ip address or hostname of the TurtleCoind host
  port: 11898, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false // whether we need to connect using SSL/TLS
})

async function update() {
    try {
        currentHeight = await daemon.getBlockCount();
        console.log(currentHeight);
        db.set(`${currentHeight}`, { undefined });
        memPool = await daemon.getTransactionPool();
        console.log(memPool);
        db.push(`${currentHeight}.memPool`, memPool)
    } catch (err) {
         console.log(err);
        console.log('Failed to get currentHeight');
        return;
    }
}

(async () => {
    await init();
})()

async function init() {
    await update();
    setInterval(update, 5000);
}

