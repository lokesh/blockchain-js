const sha256 = require('sha256');
// import lokesh256 from './utils/lokesh256.js';

const currentNodeUrl = process.argv[3];

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    // Create genesis block
    this.createNewBlock(0, '0', '0');
  }


  // ------
  // Blocks
  // ------

  /**
   * Once you have the nonce figured out, you can create a new block
   * and add it to the chain.
   * 
   * @param  {Number} nonce             
   * @param  {String} previousBlockHash 
   * @param  {String} hash              hash for new transactions
   * @return {Object}                   new block
   */
  createNewBlock(nonce, previousBlockHash, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    }

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  /**
   * @param  {String} previousBlockHash [description]
   * @param  {String} currentBlockData  [description]
   * @param  {Number} nonce             [description]
   * @return {[type]}                   [description]
   */
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  /**
   * @return {Object} last block
   */
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }


  // ------------
  // Transactions
  // ------------

  /**
   * @param  {Number} amount    
   * @param  {String} sender address   
   * @param  {String} recipient address
   * @return {Number} block transaction will be added to
   */
  createNewTransaction(amount, sender, recipient) {
    const newTransaction = {
      amount,
      sender,
      recipient,
    }

    this.pendingTransactions.push(newTransaction);
    return this.getLastBlock()['index'] + 1;
  }


  // -------------
  // Proof of work
  // -------------

  /**
   * Repeatedly hash block will we find a value with 4 leading zeros
   * @param  {[type]} previousBlockHash
   * @param  {[type]} currentBlockData 
   * @return {[type]}                  
   */
  proofOfWork(previousBlockHash, currentBlockData) {
    let hash = '';
    let nonce = 0;
    while(!hash.startsWith('00')) {
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
      nonce++;
    }
    nonce--;
    return nonce;
  }

  // -----
  // Nodes
  // -----
  
  /**
   * Add nodes to networkNodes
   * @param  {String} node
   */
  registerNode(node) {
    if (node === this.currentNode || this.networkNodes.includes(node)) {
      return;
    }
    this.networkNodes.push(node);
  }
  /**
   * Add nodes to networkNodes
   * @param  {[String]} nodes
   */
  registerNodes(nodes) {
    const nodesSet = new Set([...this.networkNodes, ...nodes]);
    this.networkNodes = [...nodesSet].filter(n => n !== this.currentNodeUrl);
  }

}

module.exports = Blockchain;
