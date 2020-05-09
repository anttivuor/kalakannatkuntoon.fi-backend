const mongoose = require('mongoose')
mongoose.set('useFindAndModify')
const uniqueValidator = require('mongoose-unique-validator')

const url = "mongodb+srv://jviitamo:JUVI2000@cluster0-t2nfu.mongodb.net/kalakannatkuntoon?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const feedbackSchema = new mongoose.Schema({
    fname: String,
    sname: String,
    fback: String
})

feedbackSchema.plugin(uniqueValidator)

feedbackSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
    }
  })

module.exports = mongoose.model('Feedback', feedbackSchema)