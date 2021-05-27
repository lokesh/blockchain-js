const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');

const Blockchain = require('./Blockchain');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const port = 3000;

const reward = 12; // Mining reward
const nodeAddress = uuid().split('-').join('');

const bc = new Blockchain();

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
