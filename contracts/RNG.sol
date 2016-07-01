import "./ProofLib.sol";
contract RNG {
  using ProofLib for ProofLib.Proof;
  mapping(uint => uint) public randomNumbers; //Finalized random numbers. If non-zero, can be assumed final
  mapping(uint => pendingBlock) pending; //Pending numbers

  struct Deposit {
    uint proposal;
    int amount; //Negative if betting against proposal, positive if betting for
  }

  struct pendingBlock{
    mapping(uint => uint) proposals; //Maps proposed solutions to amount staked

    mapping(address => Deposit) deposits; //Maps addresses to Deposits
    mapping(uint => ProofLib.Proof[]) proofs; //Maps proposal to array of proofs
    uint blockhash; //Seed for RNG
    uint totalFunds; //Total balance collected for this block
    uint depositLimit; //Limit above which proposals may be finalized
    uint difficulty; //Number of hashes on seed
  }

  uint diff = 20; //Start difficulty at 20, adjustment algo TBD
  uint public constant fee = 1 finney; //Minimum fee to buy random number
  uint public constant minDeposit = 1 ether;

  function buyNumber(uint blockNum){ //Increase security of number at block blockNum
    pending[blockNum].depositLimit += msg.value*10; //Increase min deposit
  }

  function deposit(uint blockNum, uint proposal){
    if(blockNum > block.number) throw; //Don't let people bet on bocks in the future
    Deposit deposit = pending[blockNum].deposits[msg.sender]; // Get deposit for msg.sender
    if(deposit.proposal != 0 && deposit.proposal != proposal) throw; // If they've already submitted a proposal, throw. They can make more accounts if they want more than one proposal (which they shouldn't)

    deposit.proposal = proposal; //Set their proposal to the proposal (possibly overwrite with same value, a bit inefficient)
    deposit.amount += int(msg.value); //Add to their deposit (TODO: check for overflows)
    pending[blockNum].proposals[proposal] += msg.value; //Add their deposit to total value backing proposal
    pending[blockNum].totalFunds += msg.value; //Add deposit to total funds collected
  }

  function challenge(uint blockNum, uint proposal){ //Create new challenge
    if(msg.value < minDeposit) throw;  //Don't allow deposits below min deposit: WHY?

    ProofLib.Proof[] proofs = pending[blockNum].proofs[proposal];
    proofs[proofs.length++].newChallenge(msg.sender, pending[blockNum].blockhash, proposal, diff, 20); // Create an new challenge with timeout 20. TODO: Dynamic timeouts?

    Deposit deposit = pending[blockNum].deposits[msg.sender];
    if(deposit.proposal != 0 && deposit.proposal != proposal) throw; //Don't let someone bet against more than one proposal TODO: Allow this
    deposit.proposal = proposal; // Set sender's proposal
    pending[blockNum].deposits[msg.sender].amount = -int(msg.value); //Set sender's deposit amout to negative to indicate nay vote
    pending[blockNum].proposals[proposal] -= msg.value; //Subtract from total value backing proposal TODO: check for underflow
  }

  function acceptChallenge(uint blockNum, uint proposal, uint proofIndex){
    pendingBlock p = pending[blockNum];
    if(p.deposits[msg.sender].proposal != proposal || //Don't allow defending on proposals that aren't yours
    p.deposits[msg.sender].amount < -p.deposits[p.proofs[proposal][proofIndex].challenger].amount) throw;  //Require a vested interest in the defense

    p.proofs[proposal][proofIndex].defender = msg.sender; // Set the sender as the defender TODO: don't overwrite defenders
  }

  function finalize(uint blockNum, uint proofIndex){ //Should only be called by challenger (TODO)
    uint proposal = pending[blockNum].deposits[msg.sender].proposal; //TODO: make sure this is a valid proposal
    if(pending[blockNum].proofs[proposal][proofIndex].finalize()){ //Check if the challenge was successful
      address defender = pending[blockNum].proofs[proposal][proofIndex].defender; //Get the defender
      int deposit = pending[blockNum].deposits[defender].amount; //Get the deposit put down by the defender
      pending[blockNum].deposits[defender].amount = 0; //Defender loses, their deposit is taken
      pending[blockNum].deposits[msg.sender].amount -= deposit; //Make the deposit **More negative** TODO: Make sure that msg.sender really equals challenger
    }
    //TODO: What happens when the defender wins?
  }

  function declareVictor(uint blockNum, uint proposal){ //Finalize number. Once this is called, there should be no going back < TODO!!!!
    if(randomNumbers[blockNum] != 0) throw; // If there's already a number decided, throw. TODO: perform check upstream as well
    if(pending[blockNum].proposals[proposal] > pending[blockNum].depositLimit){ // If the proposal deposits have passed the limit, it is finalized. TODO: make it stay above limin for time T
      randomNumbers[blockNum] = proposal; // Moment of truth....
    }

    //consider throwing
  }

  function claimReward(uint blockNum){ //This needs to work, or all the game theory breaks down...
    uint proposal = pending[blockNum].deposits[msg.sender].proposal; //Fetch the user's proposal
    if(randomNumbers[blockNum] == proposal && //Only if they bet on the right thing
    pending[blockNum].deposits[msg.sender].amount > 0){ // And they bet for it, not against TODO: what happens to the loser's deposits?
      int amount = pending[blockNum].deposits[msg.sender].amount; // The amount they bet
      pending[blockNum].deposits[msg.sender].amount = 0; // Zero out deposit to prevent recursive call attacks
      msg.sender.send((pending[blockNum].totalFunds * uint(amount))/pending[blockNum].proposals[proposal]); // Send Total ammount collected for block * percent of winning bets the sender holds
    }
  }

  function claimReward(uint blockNum){
    if(randomNumbers[blockNum] == pending[blockNum].deposits[msg.sender].proposal && pending[blockNum].deposits[msg.sender].amount > 0){
      int amount = pending[blockNum].deposits[msg.sender].amount;
      pending[blockNum].deposits[msg.sender].amount = 0;
      msg.sender.send((pending[blockNum].totalAmount * amount)/pending[blockNum].proposals[proposal]);
    }
  }
}
