const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
    .then(result => { console.log('connected to MongoDB') }).catch(error => { console.log('error connecting to MongoDB:', error.message) })
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

//se formatea el objeto que se devuelve por el método toJSON
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


//The public interface of the module is defined by setting a value to the module.exports variable, 
//everything else is private. In this case, we are setting the value of module.exports to be the Note model.
module.exports = mongoose.model('Note', noteSchema)