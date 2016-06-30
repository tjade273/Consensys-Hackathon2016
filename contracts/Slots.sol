import "./RNGHead.sol";

contract Token {

}

contract Slots {

	struct game {
		bool[5] linesChosen;
		bool betMade;
		bool spinInProgress;
		uint currentWagerPerLine;
		uint currentBet;
		uint currentBlockNumber;
	}

	RNGHead RandGenerator;
	mapping(address => game) games;

	function Slots(address randGeneratorAddress) {
		RandGenerator = RNGHead(randGeneratorAddress);
	}

	function startGame() {
		games[msg.sender].linesChosen = [false, false, false, false, false];
		games[msg.sender].betMade = false;
		games[msg.sender].spinInProgress = false;
		games[msg.sender].currentWagerPerLine = 0;
		games[msg.sender].currentBet = 0;
		games[msg.sender].currentBlockNumber = 0;
	}

	function placeBet(bool[] lines, uint wagerPerLine) {
		if(lines.length == 0 || wagerPerLine == 0) { throw; }
		uint wager = lines.length * wagerPerLine;
		if(msg.value < wager) { throw; }
		if(games[msg.sender].spinInProgress) { throw; }

		games[msg.sender].betMade = true;
		games[msg.sender].currentBet = wager;
		games[msg.sender].currentWagerPerLine = wagerPerLine;

		for (uint i = 0; i < lines.length; i++) {
			games[msg.sender].linesChosen[i] = lines[i];
		}
	}

	function startSpin() returns (bool) {
		if(!games[msg.sender].betMade || games[msg.sender].spinInProgress) { return false; }
		games[msg.sender].currentBlockNumber = block.number;
		return true;
	}

	function finishSpin() returns (uint, uint, uint) {
		uint colA = RandGenerator.randomNumbers(games[msg.sender].currentBlockNumber) % 9;
		uint colB = uint(sha3(colA)) % 9;
		uint colC = uint(sha3(colB)) % 9;

		games[msg.sender].spinInProgress = false;

		return (colA, colB, colC);
	}

	function calculateRewards(uint[3][3] slotState) returns (uint) {
		uint rewards = 0;

		if(games[msg.sender].linesChosen[0]) {
			if(slotState[0][0] == slotState[0][1] && slotState[0][0] == slotState[0][2]) {
				rewards += games[msg.sender].currentWagerPerLine * 1.5 ether;
			}
		}
		if(games[msg.sender].linesChosen[1]) {
			if(slotState[1][0] == slotState[1][1] && slotState[1][0] == slotState[1][2]) {
				rewards += games[msg.sender].currentWagerPerLine * 1.5 ether;
			}
		}
		if(games[msg.sender].linesChosen[2]) {
			if(slotState[2][0] == slotState[2][1] && slotState[2][0] == slotState[2][2]) {
				rewards += games[msg.sender].currentWagerPerLine * 1.5 ether;
			}
		}
		if(games[msg.sender].linesChosen[3]) {
			if(slotState[0][0] == slotState[1][1] && slotState[0][0] == slotState[2][2]) {
				rewards += games[msg.sender].currentWagerPerLine * 1.5 ether;
			}
		}
		if(games[msg.sender].linesChosen[4]) {
			if(slotState[2][0] == slotState[1][1] && slotState[2][0] == slotState[0][2]) {
				rewards += games[msg.sender].currentWagerPerLine * 1.5 ether;
			}
		}

		games[msg.sender].linesChosen = [false, false, false, false, false];
		games[msg.sender].betMade = false;
		games[msg.sender].spinInProgress = false;
		games[msg.sender].currentWagerPerLine = 0;
		games[msg.sender].currentBet = 0;

		msg.sender.send(rewards);
		return rewards;
	}	
}
