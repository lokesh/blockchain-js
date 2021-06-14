const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { v4: uuid } = require('uuid');

const Blockchain = require('./Blockchain');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// ------
// Config
// ------

const port = process.argv[2];
const reward = 12; // Mining reward
const nodeAddress = uuid().split('-').join('');


// ----
// Init
// ----

const bc = new Blockchain();


// ---
// API
// ---

app.get('/blockchain', (req, res) => {
  res.send(bc);
})


// ------------
// Transactions
// ------------

app.post('/transaction', (req, res) => {
  const blockIndex = bc.addTransactionToPendingTransactions(req.body);
  res.json({ note: `Transaction will be added in block ${blockIndex}`});
})

app.post('/transaction/broadcast', async (req, res) => {
   const { amount, sender, recipient } = req.body;
   const transaction = bc.createNewTransaction(amount, sender, recipient);
   
   bc.addTransactionToPendingTransactions(transaction);

  const broadcastPromises = bc.networkNodes.map(async (node) => {
    return fetch(`${node}/transaction`, {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: {'Content-Type': 'application/json'}
    });
  })

  const resp = await Promise.all(broadcastPromises)
  res.json({ note: 'Transaction created and broadcast' });
})

// ------
// Blocks
// ------


app.post('/receive-new-block', (req, res) => {
  const newBlock = req.body;
  const { index, previousBlockHash } = newBlock;
  const lastBlock = bc.getLastBlock();

  const hasCorrectHash = lastBlock.hash === previousBlockHash;
  const hasCorrectIndex = lastBlock.index + 1 === index;
  
  if (hasCorrectHash && hasCorrectIndex) {
    bc.chain.push(newBlock);
    bc.pendingTransactions = [];
    res.json({
      note: 'Block received and accepted',
      block: newBlock,
    });
  } else {
    res.json({
      note: 'Block received but rejected',
      block: newBlock,
    });
  }
})

// ------
// Mining
// ------

app.get('/mine', async (req, res) => {
  const lastBlock = bc.getLastBlock();
  
  const newBlockData = {
    transactions: bc.pendingTransactions,
    index: lastBlock.index + 1,
  };

  const nonce = bc.proofOfWork(lastBlock.hash, newBlockData);
  const newBlockHash = bc.hashBlock(lastBlock.hash, newBlockData, nonce);
  
  const newBlock = bc.createNewBlock(nonce, lastBlock.hash, newBlockHash)

  const blockPromises = bc.networkNodes.map(node => {
    return fetch(`${node}/receive-new-block`, {
      method: 'POST',
      body: JSON.stringify(newBlock),
      headers: {'Content-Type': 'application/json'}
    });
  });

  const resp = await Promise.all(blockPromises);

  // Reward
  // Note: In reality, I think the reward is added as first transaction, rather
  // than appended on after. This latter approach would make hashes incorrect.
  const rewardTransaction = bc.createNewTransaction(reward, '00', nodeAddress);

  await fetch(`${bc.currentNode}/transaction/broadcast`, {
    method: 'POST',
    body: JSON.stringify(rewardTransaction),
    headers: {'Content-Type': 'application/json'}
  });

  res.json({
    note: 'New block mined & broadcast',
    block: newBlock,
  });
})


// ----------
// Networking
// ----------

// Used when a node is coming online. It hits this endpoint on a known node.
// This target note will register the new node and then broadcast it to all
// the other nodes it knows by hitting their /register-node endpoints.
app.post('/register-and-broadcast-node', async (req, res) => {
  const node = req.body.node;

  // Register new node to current
  bc.registerNode(node);
  
  // Broadcast new node to network
  const registerPromises = bc.networkNodes.map(async (node) => {
    return fetch(`${node}/register-node`, {
      method: 'POST',
      body: JSON.stringify({ 'node': node }),
      headers: {'Content-Type': 'application/json'}
    });
  })

  const resp = await Promise.all(registerPromises)

  // Send new node all known network nodes
  const bulkResp = await fetch(`${node}/register-nodes`, {
      method: 'POST',
      body: JSON.stringify({ 'nodes': [...bc.networkNodes, bc.currentNode] }),
      headers: {'Content-Type': 'application/json'}
    });

  res.json({ note: 'New node registered with network successfully.' });
});


app.post('/register-node', (req, res) => {  
  const node = req.body.node;
  bc.registerNode(node);
  res.json({ note: 'New node regiestered successfully.' })
});


// After a new node comes online and registers itself with
// /register-and-broadcast-node on a known node, that known node will hit
// the /register-nodes-bulk on the new node and pass all other known nodes. 
app.post('/register-nodes', (req, res) => {
  const nodes = req.body.nodes
  bc.registerNodes(nodes);
  res.send({ note: 'Done' });
});


// ------------
// Start server
// ------------

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
