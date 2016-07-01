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

setInterval(function(){eth.sendTransaction({from:eth.coinbase});}, 5000);

var proposals = {};

var newBlock = eth.filter("latest").watch(

  function(err,res){
    console.log("New Block: ", res);

    if(err != null) {
      console.error("Filter err: ",err);
      return;
    }

    var num = eth.getBlock(res).number;
    console.log("Block number: ", num);
    var block = rng.getPendingBlock.call(num);
    console.log(block);
    if(block[1] > web3.toWei(1, "finney")){
      var val = Math.min(block[2],web3.toWei(bet,"ether"));
      rng.sha.call(num, block[3], function(err,res){
        console.log(res.toString(16));
        rng.deposit(num, "0x"+res.toString(16), {from:eth.coinbase, value: val});
        proposals[num] = res;
      });
    }

    var keys = Object.keys(proposals);
    console.log(keys);
    for(var i =0; i< keys.length; i++){
      if(parseInt(keys[i]) + 2 < num){
        console.log("Victory!!")
        if(rng.getPendingBlock(keys[i])[4] < num){
          console.log("real victory")
          rng.declareVictor(keys[i], proposals[keys[i]], {from:eth.coinbase});
          delete proposals[keys[i]];
        }
      }
    }
});

rng.Victory(function(err,res){
  rng.claimReward(res.args.blockNum, {from:eth.coinbase});
});
