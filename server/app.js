import express, { response } from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import dbService from './dbService.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// get All
app.get('/', (req, res) => {
  console.log('In route get all...');
  const db = dbService.getDbServiceInstance();
  
  const result = db.getAllData();
  result
  .then(data => res.json({data:data}))
  .catch(err => console.log(err));
})

// create
app.post('/create', (req, res) => {
  console.log("In route create name...");
  const { name } = req.body;
  const db = dbService.getDbServiceInstance();
  const result = db.createName(name);
  result
  .then(data => res.json({ data }))
  .catch(err => console.log(err));
})

// update
app.patch('/update/', (req, res) => {
  console.log('In route update name...');
  const db = dbService.getDbServiceInstance();
  const { name, id } = req.body;
  const result = db.updateNameById(name, id);
  result
  .then(data => res.json({ data }))
  .catch(err => console.log(err));
});

//delete
app.delete('/delete/:id', (req, res) => {
  console.log('In route delete name...');
  const db = dbService.getDbServiceInstance();
  const { id } = req.params;

  const result = db.deleteRowById(id);
  result
  .then(wasDeleteSuccessful => res.json({ success : wasDeleteSuccessful }))
  .catch(err => console.log(err));
})

// search (Get one)
app.get('/search/:name', (req, res) => {
  console.log('In route search one name...');
  const db = dbService.getDbServiceInstance();
  const { name } = req.params;
  const result = db.searchByName(name);
  result
  .then(data => res.json({data:data}))
  .catch(err => console.log(err));

})

const port = process.env.PORT;
app.listen(port, () => console.log(`App is running on port ${port}`));