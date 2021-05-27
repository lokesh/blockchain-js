const Blockchain = require('./blockchain');
// import Blockchain from './Blockchain.js';


let bc = new Blockchain();


const previousBlockHash = '08H320DSFJ';
const currentBlockTransactions = [
{
  amount: 10,
  sender: 'dOFNJR',
  recipient: 'EPONR',
},
{
  amount: 100,
  sender: 'DFPNER',
  recipient: 'POOOOKFD',
},
]

const nonce = 1313408043;

console.log(bc);
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


