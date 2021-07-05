# BlockchainJS

Project created by following the [Learn BLockchain By Building Your Own in Javascript](https://www.udemy.com/join/login-popup/?next=/course/build-a-blockchain-in-javascript/learn/lecture/10399208#questions) Udemy course.

Finished code from instructor available on [Github](https://github.com/erictraub/Learn-Blockchain-By-Building-Your-Own-In-JavaScript).


## Testing


```sh
# Spin up node. Use 1 - 4
npm run node1 # http://localhost:3001
npm run node2 # http://localhost:3002
```


### Block explorer UI

Visit http://localhost:PORT/block-explorer

### Add transaction

In Postman, POST to /transaction with a Body in raw JSON format. e.g.

```json
{
  "amount": 10,
  "sender": "Lokesh",
  "recipient": "Paul"
}
``` 

### Mine a new block

Visit http://localhost:PORT/mine
