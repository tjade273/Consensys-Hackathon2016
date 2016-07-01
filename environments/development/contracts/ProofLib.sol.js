// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[{"name":"self","type":"ProofLib.Proof storage"},{"name":"hash","type":"uint256"}],"name":"respond","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"self","type":"ProofLib.Proof storage"}],"name":"finalize","outputs":[{"name":"confirmed","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"self","type":"ProofLib.Proof storage"},{"name":"_challenger","type":"address"},{"name":"seed","type":"uint256"},{"name":"result","type":"uint256"},{"name":"difficulty","type":"uint256"},{"name":"time","type":"uint256"}],"name":"newChallenge","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"self","type":"ProofLib.Proof storage"}],"name":"getProof","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"self","type":"ProofLib.Proof storage"},{"name":"correct","type":"bool"}],"name":"challenge","outputs":[],"type":"function"}],
    binary: "6060604052610241806100126000396000f36503047dab890250606060405260e060020a60003504630a3dc06681146100525780635fe25c5e1461009557806364e7d90b146100e9578063a513ff5a14610141578063afa1aece1461017d575b610007565b61013f6004356024356008820154600014158061008b5750815473ffffffffffffffffffffffffffffffffffffffff9081163390911614155b156101cd57610007565b6101c1600435600581015460048201546000918291829160039190031161004d57600284015491505b83600401600050548460050160005054038110156101d55760609182526020909120906001016100be565b600160048035918201805473ffffffffffffffffffffffffffffffffffffffff191660243517905560443560028301556064356003830155600090820155608435600582015560a4356006820155436007909101555b005b600860048035918201546005830154918301546002840154600390940154606091825260809390935260a093845260c09190915260e091909152f35b61013f6004356024356008820154600014806101b7575060018201543373ffffffffffffffffffffffffffffffffffffffff908116911614155b156101f257610007565b15156060908152602090f35b600890910155565b60038401548214156101e6576101eb565b600192505b5050919050565b80156102195760088201546005830154600484018054600292018290049055830155610236565b600882015460058301805460048501546002910104905560038301555b60006008830155505056",
    unlinked_binary: "6060604052610241806100126000396000f36503047dab890250606060405260e060020a60003504630a3dc06681146100525780635fe25c5e1461009557806364e7d90b146100e9578063a513ff5a14610141578063afa1aece1461017d575b610007565b61013f6004356024356008820154600014158061008b5750815473ffffffffffffffffffffffffffffffffffffffff9081163390911614155b156101cd57610007565b6101c1600435600581015460048201546000918291829160039190031161004d57600284015491505b83600401600050548460050160005054038110156101d55760609182526020909120906001016100be565b600160048035918201805473ffffffffffffffffffffffffffffffffffffffff191660243517905560443560028301556064356003830155600090820155608435600582015560a4356006820155436007909101555b005b600860048035918201546005830154918301546002840154600390940154606091825260809390935260a093845260c09190915260e091909152f35b61013f6004356024356008820154600014806101b7575060018201543373ffffffffffffffffffffffffffffffffffffffff908116911614155b156101f257610007565b15156060908152602090f35b600890910155565b60038401548214156101e6576101eb565b600192505b5050919050565b80156102195760088201546005830154600484018054600292018290049055830155610236565b600882015460058301805460048501546002910104905560038301555b60006008830155505056",
    address: "0x089b6cb692b9821145126cae8815733b46f723f9",
    generated_with: "2.0.9",
    contract_name: "ProofLib"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("ProofLib error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("ProofLib error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("ProofLib error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("ProofLib error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.ProofLib = Contract;
  }

})();
