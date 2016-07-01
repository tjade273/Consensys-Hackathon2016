var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var eth = web3.eth;

var addr = process.argv[2];
var bet = parseInt(process.argv[3]);

var rngABI = JSON.parse(fs.readFileSync("/home/tjaden/Consensys-Hackathon2016/build/RNG.abi"));
var rng = eth.contract(rngABI).at(addr);

var proposals = {};

var newBlock = eth.filter("latest").watch(

  function(err,res){
    if(err != null) {
      console.error(err);
      return;
    }
    var num = eth.getBlock(res).number;
    var block = rng.getPendingBlock(num);
    if( block[1] > web3.toWei(10, "finney")){
      var val = Math.min(block[2],web3.toWei(5,"ether"));
      rng.sha(num, block[3], function(err,res){
        console.log(res);
        rng.deposit(num, res, {from:eth.coinbase, value: val});
        proposals[num] = res;
      });
    }

    var keys = Object.keys(proposals);
    for(var i =0; i< keys.length; i++){
      if(keys[i] + 10 < num){
        if(rng.getPendingBlock(keys[i])[4] < num){
          rng.declareVictor(keys[i], proposals[keys[i]]);
        }
      }
    }
});

rng.Victory(function(err,res){
  rng.claimReward(res.args.blockNum, {from:eth.coinbase});
});
