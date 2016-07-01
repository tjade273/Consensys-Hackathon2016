var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var eth = web3.eth;

var addr = process.argv[2];
var bet = parseInt(process.argv[3]);

var rng = eth.contract([{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proposal","type":"uint256"}],"name":"newChallenge","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proposal","type":"uint256"},{"name":"proofID","type":"uint256"},{"name":"correct","type":"bool"}],"name":"challenge","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"minDeposit","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proposal","type":"uint256"},{"name":"proofIndex","type":"uint256"}],"name":"acceptChallenge","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"}],"name":"buyNumber","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"randomNumbers","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proposal","type":"uint256"},{"name":"proofID","type":"uint256"},{"name":"val","type":"uint256"}],"name":"respond","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"}],"name":"claimReward","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proofIndex","type":"uint256"}],"name":"finalize","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"diff","type":"uint256"}],"name":"sha","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proposal","type":"uint256"}],"name":"deposit","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"blockNum","type":"uint256"},{"name":"proposal","type":"uint256"}],"name":"declareVictor","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"blockNum","type":"uint256"},{"indexed":false,"name":"limit","type":"uint256"}],"name":"DepositLimitChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"blockNum","type":"uint256"},{"indexed":false,"name":"proposal","type":"uint256"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewProposal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"blockNum","type":"uint256"},{"indexed":false,"name":"proposal","type":"uint256"},{"indexed":false,"name":"challenger","type":"address"},{"indexed":false,"name":"proofID","type":"uint256"}],"name":"NewChallenge","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"blockNum","type":"uint256"},{"indexed":false,"name":"proposal","type":"uint256"},{"indexed":false,"name":"defender","type":"address"},{"indexed":false,"name":"proofID","type":"uint256"}],"name":"ChallengeAccepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"blockNum","type":"uint256"},{"indexed":false,"name":"proposal","type":"uint256"},{"indexed":false,"name":"proofID","type":"uint256"},{"indexed":false,"name":"success","type":"bool"}],"name":"FinalizeProof","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"blockNum","type":"uint256"},{"indexed":false,"name":"proposal","type":"uint256"}],"name":"Victory","type":"event"}]).at(addr);

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

    for(var i =0; i< proposals.keys.length; i++){
      if(proposals.keys[i] + 10 < num){
        if(rng.getPendingBlock(proposals.keys[i])[4] < num){
          rng.declareVictor(proposals.keys[i], proposals[proposals.keys[i]]);
        }
      }
    }
});

rng.Victory(function(err,res){
  rng.claimReward(res.args.blockNum, {from:eth.coinbase});
});
