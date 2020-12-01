const express = require('express');
const mongo = require('mongodb').MongoClient;
const app = express();

const URL = 'mongodb://localhost:27017'
const PORT = process.env.PORT || 3000;

app.use(express.json());

// connect mongoDB

let db, trips, expenses

mongo.connect(
  URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db('tripcost')
    trips = db.collection('trips')
    expenses = db.collection('expenses')
  }
)

app.post('/trip', (req, res) => {
  const name = req.body.name

  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }

    res.status(200).json({ ok: true })
  })
})

app.get('/trips', (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }

    res.status(200).json({ trips: items })
  })
})

app.post('/expense', (req, res) => {
  const { trip, date, amount, category, description } = req.body;

  expenses.insertOne({
    trip,
    date,
    amount,
    category,
    description
  },
  (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return 
    }

    res.status(200).json({ ok: true });
  })
})
app.get('/expenses', (req, res) => {
  expenses.find({ trip: req.body.trip }).toArray(( err, items ) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return 
    }

    res.status(200).json({ trips: items });
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
