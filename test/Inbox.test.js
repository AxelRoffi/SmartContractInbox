const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
// const INITIAL_STRING = "Hello World!";
beforeEach(async () => {
  //get a list of all accounts
  accounts = await web3.eth.getAccounts();

  //use one those accounts to deploy the smart Contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ["Hello World!"] })
    .send({ from: accounts[0], gas: "1000000" });
  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("deploys contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hello World!");
  });

  it("can change message", async () => {
    await inbox.methods.setMessage("Fuck Ethereum").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "Fuck Ethereum");
  });
});

// class Car {
//   park() {
//     return "stopped";
//   }
//   drive() {
//     return "vroom";
//   }
// }

// let car;
// beforeEach(() => {
//   car = new Car();
// });

// describe("Car", () => {
//   it("can park", () => {
//     assert.equal(car.park(), "stopped");
//   });

//   it("can drive", () => {
//     assert.equal(car.drive(), "vroom");
//   });
// });
