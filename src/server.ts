import * as express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';

import { Event } from './models/Event';
import { StringRandomizer } from './StringRandomizer';

const app = express();

// Declare 'pug' as the default templating engine
app.set('view engine', 'pug');
// Declare where the views template are stored
app.set('views', join(__dirname, 'views'));

// Declare static directories
app.use('/node_modules', express.static(join(__dirname, '..', 'node_modules')));
app.use('/assets', express.static(join(__dirname, 'assets')));

// Middlewares
app.use(bodyParser.json());

let db: Db;

MongoClient.connect(
  'mongodb://localhost:27017',
  { useNewUrlParser: true }
)
  .then((mongoClient: MongoClient) => {
    db = mongoClient.db('urlshortener');
    app.emit(Event.DATABASE_READY);
  })
  .catch((err) => {
    throw err;
  });

app.get('/', (req: Request, res: Response) => {
  res.render('home');
});

app.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

app.get('/register', (req: Request, res: Response) => {
  res.render('register');
});

app.get('/profile', (req: Request, res: Response) => {
  res.render('profile');
});

app.get('/404', (req: Request, res: Response) => {
  res.render('404');
});

app.get('/:urlId', (req: Request, res: Response) => {
  console.log(`params: ${JSON.stringify(req.params)}`);

  db.collection('urls')
    .findOne({ short_url: req.params.urlId })
    .then((url) => res.redirect(url.original))
    .catch(() => res.redirect('/404'));
});

app.post('/shorten', (req: Request, res: Response) => {
  console.log(`body:${JSON.stringify(req.body)}`);
  const original_url = req.body.original_url;
  const short_url = `${StringRandomizer.randomAlphaNumeric(8)}`;

  // TODO: 2018-12-04 Blockost
  // Re-generate short_url if it already exists
  const cursor = db
    .collection('urls')
    .find({ short_url: short_url })
    .limit(1);

  console.log(cursor);

  db.collection('urls')
    .insertOne({ original: original_url, short_url: short_url })
    .then((_id) => console.log(`_id:${_id}`))
    .catch((err) => {
      throw err;
    });

  res.send({ short_url: short_url });
});

app.on(Event.DATABASE_READY, () => {
  console.log('Database is ready. Starting http server...');
  const PORT = process.env.URL_SHORTENER_APP_PORT || 3000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
