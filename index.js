require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] :content - :response-time ms'
  )
)

const url = process.env.MONGODB_URI

mongoose
  .connect(
    url,
    { useNewUrlParser: true }
  )
  .then(result => console.log())

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('person', personSchema)

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Martti Tienari', number: '040-123456' },
  { id: 3, name: 'Arto Järvinen', number: '040-123456' },
  { id: 4, name: 'Lea Kutvonen', number: '040-123456' }
]

app.get('/api/persons', (req, res) => {
  console.log(persons)
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(p => p.id === id)
  console.log(person)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get('/api/info', (req, res) => {
  res.send(`<div>Puhelinluettelossa ${persons.length} henkilön tiedont</div>
  <div>${new Date()}</div>`)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    console.log('bad request')
    return res
      .status(400)
      .json({ error: 'person must include name and number' })
  }

  if (persons.map(p => p.name).includes(body.name)) {
    console.log('ei ollu')
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 2147000000),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson)
  res.json(persons)
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
