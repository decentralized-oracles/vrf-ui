export const globalProcess= {
    step: 0,
    stepDefs: {
        0: "Idle",
        1: "Initiating process: sending a request to wallet, waiting for approval",
        2: "Astar Tx `requestRandomValue`: sending a VRF request to the Astar smart contract",
        3: "Phat Contract query: Process the VRF request by a Phat Contract rollup transaction",
        4: "Astar Event: waiting for the result to be stored in the Astar Smart Contract event `RandomValueReceived`",
        5: "Random number has successfuly been processed and has been stored into the Astar smart contract."
    },
    setStep: function (n) {
        this.step = n;
    },
    getStep: function (n) {
        return this.step;
    },
    isStep: function (n) {
        return this.step == n;
    }
}