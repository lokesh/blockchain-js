import sha256 from  'sha256';

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
  }

  /**
   * [createNewBlock description]
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
  hashBlock(previousBlockHash, currentBlockTransactions, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockTransactions);
    const hash = sha256(dataAsString)
    return hash;
  }

  /**
   * @return {Object} last block
   */
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

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
}

export default Blockchain;
