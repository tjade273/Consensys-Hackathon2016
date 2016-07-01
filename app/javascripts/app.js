window.onload = function() {
  var eth = web3.eth;
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    setup();

    $("#spin").click(function() {
  		var betEther = parseFloat($("#bet").val());
  		var bet = web3.toWei(betEther, 'ether');
  		spin(bet);
  	});

    $("#bet").on("change keyup paste", function(){
      var betLabel = document.getElementById("betLabel")
      betLabel.innerHTML = $(this).val();
    })

  });

  var accounts;
  var account;
  var slots;
  var rand;

  function setup() {
  	slots = Slots.at(Slots.deployed_address);
  	rand = RNG.at(RNG.deployed_address);
    slots.setRNG(RNG.deployed_address, {from:eth.coinbase});
  	slots.startGame({from: account}).catch(function(e) {
  		console.log(e);
  	});
  }

  function spin(bet) {
  	//var slotNums = ['1','2','3','4','5','6','7','8','9'];
  	async.waterfall([
  		function(callback) {
  			slots.placeBet([false,true,false,false,true], 1, bet, {from: account, value: bet}).then(function() {
  				callback(null);
  			}).catch(function(e) {
  				callback(e);
  			});
  		},
  		function(callback) {
  			slots.startSpin({from: account, value:5e17}).then(function() {
  				console.log(web3.eth.blockNumber);
  				callback(null, web3.eth.blockNumber);
  			}).catch(function(e) {
  				callback(e);
  			});
  		},
  		function(arg1, callback) {
  			/*slots.finishSpin.call({from: account}).then(function(rands) {
  				var a = rands[0];
  				var b = rands[1];
  				var c = rands[2];

  				var row1 = document.getElementById("row1");
  				var row2 = document.getElementById("row2");
  				var row3 = document.getElementById("row3");

  				row1.innerHTML = a.valueOf();
  				row2.innerHTML = b.valueOf();
  				row3.innerHTML = c.valueOf();

  				console.log(a.valueOf());
  				console.log(b.valueOf());
  				console.log(c.valueOf());

  				callback(null);
  			}).catch(function(e) {
  				callback(e);
  			});*/

  			rand.getRandomNumbers.call(arg1, {from: account}).then(function(rand) {
  				console.log("\n\n\n");
  				console.log(arg1);
  				console.log("\n");
  				console.log(rand);
  				console.log("\n\n\n");
  				var rand1 = rand.modulo(9).plus(1);
  				//var rand2 = web3.toDecimal(web3.sha3(rand1).modulo(9).plus(1));
  				//var rand3 = (web3.toDecimal(web3.sha3(rand2)) % 9) + 1;

  				var row1 = document.getElementById("row1");
  				//var row2 = document.getElementById("row2");
  				//var row3 = document.getElementById("row3");

  				row1.innerHTML = rand1.toNumber();
  				//row2.innerHTML = rand2;
  				//row3.innerHTML = rand3;

  				console.log(rand1.valueOf());
  				//console.log(rand2);
  				//console.log(rand3);

  				callback(null);
  			}).catch(function(e) {
  				callback(e);
  			});
  		},
  		function(callback) {
  			slots.calculateRewards([[0,0,0],[0,0,0],[0,0,0]], {from: account}).then(function() {
  				callback(null);
  			}).catch(function(e) {
  				callback(e);
  			});
  		}
  	],
  	function(err, result) {
  		if(err) {
  			console.log(err);
  		} else {
  			console.log(result);
  		}
  	}
  	);

  }

};
