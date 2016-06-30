import "./RNGHead.sol";

contract Token {

}

contract Slots {

	RNGHead RandGenerator;
	bool[5] linesChosen = [false, false, false, false, false];
	bool betMade = false;
	bool spinInProgress = false;
	uint currentWagerPerLine = 0;
	uint currentBet = 0;
	uint currentBlockNumber;

	function Slots(address randGeneratorAddress) {
		RandGenerator = RNGHead(randGeneratorAddress);
	}

	function placeBet(bool[] lines, uint wagerPerLine) {
		if(lines.length == 0 || wagerPerLine == 0) { throw; }
		uint wager = lines.length * wagerPerLine;
		if(msg.value < wager) { throw; }
		if(spinInProgress) { throw; }
		betMade = true;
		currentBet = wager;
		currentWagerPerLine = wagerPerLine;
		for (uint i = 0; i < lines.length; i++) {
			linesChosen[i] = lines[i];
		}
	}

	function startSpin() returns (bool) {
		if(!betMade || spinInProgress) { return false; }
		currentBlockNumber = block.number;
		return true;
	}

	function finishSpin() returns (uint, uint, uint) {
		uint colA = RandGenerator.randomNumbers(currentBlockNumber) % 9;
		uint colB = uint(sha3(colA)) % 9;
		uint colC = uint(sha3(colB)) % 9;

		spinInProgress = false;

		return (colA, colB, colC);
	}

	function calculateRewards(uint[3][3] slotState) returns (uint) {
		uint rewards = 0;

		if(linesChosen[0]) {
			if(slotState[0][0] == slotState[0][1] && slotState[0][0] == slotState[0][2]) {
				rewards += currentWagerPerLine * 1.5 ether;
			}
		}
		if(linesChosen[1]) {
			if(slotState[1][0] == slotState[1][1] && slotState[1][0] == slotState[1][2]) {
				rewards += currentWagerPerLine * 1.5 ether;
			}
		}
		if(linesChosen[2]) {
			if(slotState[2][0] == slotState[2][1] && slotState[2][0] == slotState[2][2]) {
				rewards += currentWagerPerLine * 1.5 ether;
			}
		}
		if(linesChosen[3]) {
			if(slotState[0][0] == slotState[1][1] && slotState[0][0] == slotState[2][2]) {
				rewards += currentWagerPerLine * 1.5 ether;
			}
		}
		if(linesChosen[4]) {
			if(slotState[2][0] == slotState[1][1] && slotState[2][0] == slotState[0][2]) {
				rewards += currentWagerPerLine * 1.5 ether;
			}
		}

		linesChosen = [false, false, false, false, false];
		betMade = false;
		spinInProgress = false;
		currentWagerPerLine = 0;
		currentBet = 0;

		msg.sender.send(rewards);
		return rewards;
	}
}