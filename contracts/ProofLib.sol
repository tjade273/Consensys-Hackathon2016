library ProofLib {

    struct Proof {
        address defender;
        address challenger;

        uint lVal;
        uint rVal;
        uint lIndex;
        uint rIndex;

        uint roundTime;
        uint lastRound;

        uint currentVal;

        //TODO: Implement non-participation resilliancy
    }


    function newChallenge(Proof storage self, address _challenger, uint seed, uint result, uint difficulty, uint time) {
        self.challenger = _challenger;

        self.lVal = seed;
        self.rVal = result;

        self.lIndex = 0;
        self.rIndex = difficulty;

        self.roundTime = time;
        self.lastRound = block.number;


    }

    function challenge(Proof storage self, bool correct) {
        if (self.currentVal == 0 || msg.sender != self.challenger) throw;
        if (correct) {
            self.lIndex = (self.lIndex + self.rIndex) / 2;
            self.lVal = self.currentVal;
        } else {
            self.rIndex = (self.lIndex + self.rIndex) / 2;
            self.rVal = self.currentVal;
        }

        self.currentVal = 0;
    }

    function respond(Proof storage self, uint hash) {
        if (self.currentVal != 0 || msg.sender != self.defender) throw;
        self.currentVal = hash;
    }

    function finalize(Proof storage self) returns(bool confirmed) { //returns true if challenge successfully disproves proposal

        if (self.rIndex - self.lIndex <= 3) {
            bytes32 hash = bytes32(self.lVal);

            for (uint i; i < self.rIndex - self.lIndex; i++) {
                hash = sha3(hash);
            }

            if (hash == bytes32(self.rVal)) {
                return false;
            } else {
                return true;
            }
        } else throw;
    }


     function getProof(Proof storage self) constant returns(uint,uint,uint,uint,uint){
         return (self.lIndex, self.rIndex, self.lVal, self.currentVal, self.rVal);
     }



}
