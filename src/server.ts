import * as express from 'express';
import { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';

const app = express();

// TODO: 2018-09-18 Leverage EvemtEmitter app.emit('ready') and app.on('ready')
// to make sure database connection is up and ready before starting the application
// see https://blog.cloudboost.io/waiting-for-db-connections-before-app-listen-in-node-f568af8b9ec9
let client: MongoClient;
let db: Db;

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true }
)
  .then((res) => {
    client = res;
    db = client.db('urlshortener');
  })
  .catch((err) => {
    throw err;
  });

app.get('/404', (req: Request, res: Response) => {
  res.send('URL not found, please try again.');
});

app.get('/:urlId', (req: Request, res: Response) => {
  console.log(`params: ${JSON.stringify(req.params)}`);

  db.collection('urls')
    .findOne({ short_url: req.params.urlId })
    .then((url) => res.redirect(url.original))
    .catch(() => res.redirect('/404'));
});

app.listen(3000, () => console.log(`Server listening on port 3000`));
