var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var eth = web3.eth;

console.log("Eth instantiated");

var addr = process.argv[2];
console.log("Address: ", addr);

var bet = parseInt(process.argv[3]);
console.log("Bet: ", bet);

var rngABI = JSON.parse(fs.readFileSync("/home/tjaden/Consensys-Hackathon2016/build/RNG.abi"));
var rng = eth.contract(rngABI).at(addr);
//console.log("RNG code: ", eth.getCode(rng.address));

var n = eth.blockNumber + 10

rng.buyNumber(n,{from:eth.coinbase, value:5e17});

setInterval(function(){
  eth.sendTransaction({from:eth.coinbase});
  console.log("Mined ", eth.blockNumber, " of ", n+10)
  if(eth.blockNumber > n+10){
    console.log("\n\n\n\n", "Random Number: ", rng.randomNumbers(n).toString(16), "\n\n\n");
    process.exit()
  };
}, 800);
