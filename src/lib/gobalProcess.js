export const globalProcess= {
    step: 0,
    stepDefs: {
        0: <>Idle</>,
        1: <>🟢 Initiating process: sending a request to wallet, waiting for the user approval</>,
        2: <>🟢 Astar - Ink! Smart Contract: Call the the smart contract to request a random value between min and max</>,
        2: <>🟢 Astar - Ink! Smart Contract: Call the the smart contract to request a random value between min and max</>,
        3: <>🟢 Phala - Phat Contract: Query the Astar smart contract, process the VRF request and submit the result to Astar smart contract</>,
        4: <>🟢 Astar - Ink! Smart Contract: Waiting for the result to be stored in the Astar smart contract (listen the event RandomValueReceived)</>,
        5: <>✅ Random number has successfuly been processed and has been stored into the Astar smart contract.</>
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