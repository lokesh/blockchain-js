import Blockchain from './Blockchain.js';


let bc = new Blockchain();

bc.createNewBlock(1, 2, 3);
bc.createNewBlock(1, 3, 4);
console.log(bc.chain);

