const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose
  .connect(
    url,
    { useNewUrlParser: true }
  )
  .then(result => console.log())
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },

  number: {
    type: String,
    minlength: 8,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)