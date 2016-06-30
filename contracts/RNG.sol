import "./ProofLib.sol"
contract RNG {
  mapping(uint => uint) public randomNumbers;
  mapping(uint => pendingBlock) pending;

  struct Deposit {
    uint proposal;
    int amount;
  }

  struct pendingBlock{
    mapping(uint => uint) proposals; //Maps proposed solutions to amount staked
    mapping(address => Deposit) deposits;
    mapping(bytes32 => ProofLib.Proof[]) proofs;
    uint blockhash;

    uint depositLimit;
    uint difficulty;
  }

  uint diff;
  uint public constant fee;
  uint public constant minDeposit;

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

  function challenge(uint blockNum, uint proposal){
    if(msg.value < minDeposit) throw;
    pending[blockNum].proofs[pending[blockNum].proofs.length++].newChallenge(msg.sender, pending[blockNum].blockhash, proposal, diff * 5);
    pending[blockNum].deposits[msg.sender].proposal = proposal;
    pending[blockNum].deposits[msg.sender].amount = -msg.value;
    pending[blockNum].proposals[proposal] -= msg.value;
  }

  function acceptChallenge(uint blockNum, uint proposal, uint proofIndex){
    pendingBlock p = pending[blockNum];
    if(p.deposits[msg.sender].proposal != proposal || p.deposits[msg.sender].amount < -p.deposits[p.proofs[proposal][proofIndex].challenger].amount) throw;
    p.proofs[proposal][proofIndex].defender = msg.sender;
  }

  function declareVictor(uint blockNum, uint proposal){
    if(randomNumbers[blockNum] != 0) throw;
    if(pending[blockNum].proposals[propopsal] > pending[blockNum].depositLimit){
      randomNumbers[blockNum] = proposal;
    }
  }
}
