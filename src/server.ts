import * as express from 'express';
import { Request, Response } from 'express';

import { Mongoose } from 'mongoose';

const app = express();

const mongoose = new Mongoose();
mongoose.connect(
  'mongodb://localhost:27017/urlshortener',
  (err) => {
    if (err) throw err;
  }
);

const urlSchema = new mongoose.Schema(
  {
    original: String,
    short_url: String,
    clicks: { type: Number, default: 3 }
  },
  { timestamps: true }
);

const URL = mongoose.model('URL', urlSchema);

let test = new URL({ original: 'https://twitter.com', short_url: 'qwe123' });
test.save((err) => {
  if (err) throw err;
});

app.get('/:urlId', (req: Request, res: Response) => {
  console.log(`params: ${JSON.stringify(req.params)}`);

  URL.findOne({ short_url: req.params.urlId })
    .then((url: any) => {
      if (url) {
        console.log(url);
        // Redirect to original URL in the return url object
        res.redirect(url.original);
        return;
      }
      res.send(`params: ${JSON.stringify(req.params)}`);
    })
    .catch((reason) => {
      throw reason;
    });
});

app.listen(3000, () => console.log('RUNNING'));
