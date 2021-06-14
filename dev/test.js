const Blockchain = require('./blockchain');

let bc = new Blockchain();



const bc1 = {
chain: [
{
index: 1,
timestamp: 1623640702022,
transactions: [ ],
nonce: 0,
hash: "0",
previousBlockHash: "0"
},
{
index: 2,
timestamp: 1623640722188,
transactions: [ ],
nonce: 363,
hash: "005c850455f8bf8801a8901d9908cb6acd33bc49c9d718fcf30867c3cbc91ee3",
previousBlockHash: "0"
},
{
index: 3,
timestamp: 1623640723518,
transactions: [
{
amount: 12,
sender: "00",
recipient: "87100cd20d794166a639116265ba3a14",
transactionId: "144e943fe15a4ed4a079ccc3d2cd6c76"
}
],
nonce: 45,
hash: "0068a277f81428c218bc11df6afc492a56abd013a6e1b073b6b902d0208894ab",
previousBlockHash: "005c850455f8bf8801a8901d9908cb6acd33bc49c9d718fcf30867c3cbc91ee3"
},
{
index: 4,
timestamp: 1623640766565,
transactions: [
{
amount: 12,
sender: "00",
recipient: "87100cd20d794166a639116265ba3a14",
transactionId: "42a59c06176d4e5ebfa6c799697d60a1"
},
{
amount: 5,
sender: "brian",
recipient: "paul",
transactionId: "bb33ef08d88c4b49b28c3dfffa1ec13a"
},
{
amount: 20,
sender: "lokesh",
recipient: "brian",
transactionId: "550a8c9e663e4494a69aec527728fc04"
}
],
nonce: 16,
hash: "00e99ef14b4a4ebf376b15ab718724005fcfbe92d2970b9d697309bdd9f3a3c4",
previousBlockHash: "0068a277f81428c218bc11df6afc492a56abd013a6e1b073b6b902d0208894ab"
},
{
index: 5,
timestamp: 1623640796478,
transactions: [
{
amount: 12,
sender: "00",
recipient: "87100cd20d794166a639116265ba3a14",
transactionId: "a92a53de0cc84c09a22c960ae1061c95"
},
{
amount: 100,
sender: "brian",
recipient: "paul",
transactionId: "7f35939be0ad422b8bbe9951c35d1307"
}
],
nonce: 239,
hash: "006a968f89937216e4653dfdb9a10d7e00517eba47985bd814c35afff22010e8",
previousBlockHash: "00e99ef14b4a4ebf376b15ab718724005fcfbe92d2970b9d697309bdd9f3a3c4"
}
],
pendingTransactions: [
{
amount: 12,
sender: "00",
recipient: "87100cd20d794166a639116265ba3a14",
transactionId: "ddf5d6ccd6d14a66b252f831dffab9e7"
}
],
currentNode: "http://localhost:3001",
networkNodes: [ ]
}

// const previousBlockHash = '08H320DSFJ';
// const currentBlockTransactions = [
// {
//   amount: 10,
//   sender: 'dOFNJR',
//   recipient: 'EPONR',
// },
// {
//   amount: 100,
//   sender: 'DFPNER',
//   recipient: 'POOOOKFD',
// },
// ]

// const nonce = 1313408043;

// console.log(bc);

// --------------------
// Testing transactions
// --------------------

// console.log(bc.hashBlock(previousBlockHash, currentBlockTransactions, 116));
// bc.proofOfWork(previousBlockHash, currentBlockTransactions);

// bc.createNewBlock(398475, 'SOSIDJFDPJFS', 'UUER93HR939D');

// bc.createNewTransaction(10, 'LOKESH30MX84U', 'NATHAN038H437')

// bc.createNewBlock(1231234, '028NC0T0H403', '3H973G43D0');

// bc.createNewTransaction(1, 'LOKESH30MX84U', 'NATHAN038H437')
// bc.createNewTransaction(2, 'LOKESH30MX84U', 'NATHAN038H437')
// bc.createNewTransaction(3, 'LOKESH30MX84U', 'NATHAN038H437')

// bc.createNewBlock(2339947, '038H425H0DF', '0382N42342');

// console.log(bc);


// ------------------
// Testing validation
// ------------------

console.log('Is chain valid?', bc.validateChain(bc1.chain));
