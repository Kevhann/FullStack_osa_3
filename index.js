if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = require('./errorHandler')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
morgan.token('content', (req, res) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] :content - :response-time ms'
  )
)

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      `<div>Puhelinluettelossa on ${
        persons.length
      } henkilöä</div><div>${new Date()}</div>`
    )
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      console.log(person)
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(p => {
      res.json(p.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  person
    .save()
    .then(p => {
      res.json(p.toJSON())
    })
    .catch(error => next(error))
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
app.use(errorHandler)
