const sha256 = require('sha256');
const { v4: uuid } = require('uuid');
// import lokesh256 from './utils/lokesh256.js';

const currentNodeUrl = process.argv[3];

class Blockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNode = currentNodeUrl;
    this.networkNodes = [];

    // Create genesis block
    this.createNewBlock(0, '0', '0');
  }


  // ------
  // Blocks
  // ------

  /**
   * @param {String} hash
   * @return {Object} block
   */
  getBlock(hash) {
    return this.chain.find(block => {
      return block.hash === hash;
    })
  }

  /**
   * @return {Object} last block
   */
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

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


  // ------------
  // Transactions
  // ------------


  /**
   * @param {String} id
   * @return {Object} transaction
   */
  getTransaction(id) {
    let targetTransaction;
    let targetBlock;
    
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.transactionId === id) {
          targetTransaction = transaction;
          targetBlock = block;
        }
      })
    })

    return {
      transaction: targetTransaction,
      block: targetBlock,
    };
  }

  /**
   * Return balance and all transactions for a given address.
   * @param  {String} address
   * @return {Object} 
   */
  getAddressData(address) {
    const transactions = [];
    
    this.chain.forEach(block => {
      console.log('block', block.index);

      block.transactions.forEach(tx => {
        console.log('tx', tx);
        console.log('address', address);

        if (tx.sender.toLowerCase() === address || tx.recipient.toLowerCase() === address) {
          console.log('tx', tx);
          transactions.push(tx);
        }
      });
    });

    console.log(transactions.length);

    let balance = 0;
    transactions.forEach(tx => {
      if (tx.sender.toLowerCase() === address) {
        balance -= tx.amount;
      }
      if (tx.recipient.toLowerCase() === address) {
        balance += tx.amount; 
      }
    });

    return {
      transactions,
      balance,
    };
  }

  /**
   * @param  {Number} amount    
   * @param  {String} sender address   
   * @param  {String} recipient address
   * @return {Object} transaction
   */
  createNewTransaction(amount, sender, recipient) {
    return {
      amount,
      sender,
      recipient,
      transactionId: uuid().split('-').join(''),
    };
  }

  /**
   * @param  {Object} transaction
   * @return {Number} block transaction will be added to
   */
  addTransactionToPendingTransactions(transactionData) {
    const { amount, sender, recipient } = transactionData;
    const transaction = this.createNewTransaction(amount, sender, recipient);
    this.pendingTransactions.push(transaction);
    return this.getLastBlock()['index'] + 1;
  }

  // -------------
  // Proof of work
  // -------------

  /**
   * Repeatedly hash block will we find a value with X leading zeros
   * @param  {[type]} previousBlockHash
   * @param  {[type]} currentBlockData 
   * @return {[type]}                  
   */
  proofOfWork(previousBlockHash, currentBlockData) {
    let hash = '';
    let nonce = 0;

    // number is lower than X
    while(!hash.startsWith('00')) {
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
      nonce++;
    }
    nonce--;
    return nonce;
  }


  // ------------
  // Verification
  // ------------
  
  /**
   * @param  {String} hash
   * @return {Boolean}
   */
  validateHash(hash) {
    return hash.startsWith('00');
  }

  /**
   * Go through each block and make sure the hash is valid and the prev block
   * hash it uses is correct. Additionally, confirm the genesis node params.
   *
   * @param  {Array} chain
   * @return {Boolean}       [description]
   */
  validateChain(chain) {
    let isValid = true;
    
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const prevBlock = chain[i - 1];

      const blockHash = this.hashBlock(
        prevBlock.hash,
        {
          transactions: block.transactions,
          index: block.index,
        },
        block.nonce,
      );

      if (!this.validateHash(blockHash)) {
        console.log('Invalid block hash');
        isValid = false;
      }

      if (block.previousBlockHash !== prevBlock.hash) {
        console.log('Previous block hash mismatch');
        isValid = false;
      }
    };

    // Validate gensis block
    const genesisBlock = chain[0];
    if (genesisBlock.nonce !== 0
      || genesisBlock.previousBlockHash !== '0'
      || genesisBlock.hash !== '0'
      || genesisBlock.transactions.length > 0)
    {
      console.log('Invalid genesis block');
      isValid=false;
    }

    return isValid;
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
    this.networkNodes = [...nodesSet].filter(n => n !== this.currentNode);
  }

}

module.exports = Blockchain;
