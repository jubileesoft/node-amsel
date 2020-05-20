import express from 'express';
import routes from './routes';

const port = process.env.PORT || 3000;
const app = express();

routes(app);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log('Go to http://localhost:3000');
});
