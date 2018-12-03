import * as express from 'express';
import { join } from 'path';
import { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';

import { Event } from './Event';

const app = express();

// Declare 'pug' as the default templating engine
app.set('view engine', 'pug');
// Declare where the views template are stored
app.set('views', join(__dirname, 'views'));

// Declare static directories
app.use('/node_modules', express.static(join(__dirname, '..', 'node_modules')));
app.use('/assets', express.static(join(__dirname, 'assets')));

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

app.get('/landing', (req: Request, res: Response) => {
  res.render('landing');
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
  res.render('index', { title: 'Hey', message: 'Hola!' });
});

app.get('/:urlId', (req: Request, res: Response) => {
  console.log(`params: ${JSON.stringify(req.params)}`);

  db.collection('urls')
    .findOne({ short_url: req.params.urlId })
    .then((url) => res.redirect(url.original))
    .catch(() => res.redirect('/404'));
});

app.on(Event.DATABASE_READY, () => {
  console.log('Database is ready. Starting http server...');
  const PORT = process.env.URL_SHORTENER_APP_PORT || 3000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});
