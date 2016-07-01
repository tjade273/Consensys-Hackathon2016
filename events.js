var Web3 = require("web3");
var fs = require("fs")

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var eth = web3.eth;


var abi = JSON.parse(fs.readFileSync("/home/tjaden/Consensys-Hackathon2016/build/RNG.abi"))

var rng = eth.contract(abi).at(process.argv[2]);

var f = function(err,res){
	if(err){console.error(err)}
	else{
		console.log("EVENT "  + res.event +": ");
		for(i in res.args){
			if(res.args.hasOwnProperty(i)){
				console.log(i+": ");
				for(j in res.args[i]){
					if(res.args[i].hasOwnProperty(j)){
						res.args[i][j] = res.args[i][j].toString(16);
					}
				}
				console.log(res.args[i]);
			}
		}
	}
}

var events = rng.allEvents(function(err,res){f(err,res)});
