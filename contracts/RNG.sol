import "./ProofLib.sol"
contract RNG {
  mapping(uint => uint) public randomNumbers;
  mapping(uint => pendingBlock) pending;

  struct Deposit {
    uint proposal;
    uint amount;
  }

  struct pendingBlock{
    mapping(uint => uint) proposals; //Maps proposed solutions to amount staked
    mapping(address => Deposit) deposits;
    mapping(bytes32 => ProofLib.Proof[]) proofs;

    uint depositLimit;
    uint difficulty;
  }

  uint diff;
  uint public constant fee;

  function buyNumber(uint blockNum){
    if(blockNum > block.number) throw;
    if(msg.value < fee) throw;

    pending[blockNum].depositLimit += msg.value*10;
  }

  function deposit(uint blockNum, uint proposal){
    if(blockNum > block.number) throw;
    if(pending[blockNum].deposits[msg.sender].proposal != 0 && pending[blockNum].deposits[msg.sender].proposal != proposal) throw;

    pending[blockNum].deposits[msg.sender].proposal = proposal;
    pending[blockNum].deposits[msg.sender].amount += msg.value;
    pending[blockNum].proposals[proposal] += msg.value;
  }


}
