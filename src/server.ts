import * as express from 'express';
import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';

const app = express();

// TODO: 2018-09-18 Leverage EvemtEmitter app.emit('ready') and app.on('ready')
// to make sure database connection is up and ready before starting the application
// see https://blog.cloudboost.io/waiting-for-db-connections-before-app-listen-in-node-f568af8b9ec9
let client: MongoClient;

MongoClient.connect('mongodb://localhost:27017')
  .then((res) => {
    client = res;
    const db = client.db('urlshortener');

    db.collection('urls')
      .insertOne({
        original: 'https://google.com',
        short_url: 'test123'
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  })
  .catch((err) => console.error(err));

//{ original: 'https://twitter.com', short_url: 'qwe123' }

app.get('/:urlId', (req: Request, res: Response) => {
  console.log(`params: ${JSON.stringify(req.params)}`);

  // db.collection('urls')
  //   .findOne({ short_url: req.params.urlId })
  //   .then((url) => console.log(url))
  //   //res.send(`params: ${JSON.stringify(req.params)}`);
  //   .catch((err) => console.log(err));
});

app.listen(3000, () => console.log('RUNNING'));
