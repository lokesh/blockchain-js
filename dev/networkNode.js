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

app.post('/transaction', (req, res) => {
   const { amount, sender, recipient } = req.body;
   const blockIndex = bc.createNewTransaction(amount, sender, recipient);
   res.json({ note: `Transaction will be added in block ${blockIndex}`});
})

app.get('/mine', (req, res) => {
  const previousBlock = bc.getLastBlock();
  const previousBlockHash = previousBlock.hash;
  
  const currentBlockData = {
    transactions: bc.pendingTransactions,
    index: previousBlock['index'] + 1,
  };

  const nonce = bc.proofOfWork(previousBlockHash, currentBlockData);
  const currentBlockHash = bc.hashBlock(previousBlockHash, currentBlockData, nonce);
  
  bc.createNewTransaction(reward, '00', nodeAddress);

  const newBlock = bc.createNewBlock(nonce, previousBlockHash, currentBlockHash)

  res.json({
    note: 'New block mined',
    block: newBlock,
  });
})

// Used when a node is coming online. It hits this endpoint on a known node.
// This target note will register the new node and then broadcast it to all
// the other nodes it knows by hitting their /register-node endpoints.
app.post('/register-and-broadcast-node', async (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  // Register new node to current
  bc.registerNode(newNodeUrl);
  
  // Broadcast new node to network
  const registerPromises = [];

  const promises = bc.networkNodes.map(async (nodeUrl) => {
    const post = await fetch(`${nodeUrl}/register-node`, {
      method: 'POST',
      body: JSON.stringify({ 'newNodeUrl': newNodeUrl }),
      headers: {'Content-Type': 'application/json'}
    });

    registerPromises.push(post);
  })

  const resp = await Promise.all(registerPromises)

  // Send new node all known network nodes
  const bulkResp = await fetch(`${newNodeUrl}/register-nodes`, {
      method: 'POST',
      body: JSON.stringify({ 'nodes': [...bc.networkNodes, bc.currentNodeUrl] }),
      headers: {'Content-Type': 'application/json'}
    });

  res.json({ note: 'New node registered with network successfully.' });
});

app.post('/register-node', (req, res) => {  
  const newNodeUrl = req.body.newNodeUrl;

  bc.registerNode(newNodeUrl);
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
