const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb://testuser1:${password}@ds253284.mlab.com:53284/example`

mongoose.connect(
  url,
  { useNewUrlParser: true }
)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('person', personSchema)

const person = new Person({
  name,
  number
})

if (process.argv.length === 3) {
  console.log('puhelinluettelo:')
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
}

person.save().then(response => {
  console.log(`lisätään ${person.name} numero ${person.number} luetteloon`)
  mongoose.connection.close()
})
