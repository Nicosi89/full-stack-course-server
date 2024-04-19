const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

//el noteApp es el nombre de la base de datos y el FullStack el nombre de la app
const url =
  `mongodb+srv://fullstack_course:${password}@fullstack.2o3z40a.mongodb.net/noteApp?retryWrites=true&w=majority&appName=FullStack`


mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

//nombre de la colección. MondoDB crea una colección con el nombre pero en minúsculas y en plural: "notes"
const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Esto es una chimba3',
  important: true
})



  //con query
  
  Note.find({ important: true }).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

