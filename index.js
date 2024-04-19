const Note = require('./models/note')
const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
//estos middlewares son necesarios para que el servidor pueda recibir y enviar datos en formato JSON y deben estar en este orden
/*To make express show static content, the page index.html and the JavaScript, etc., 
it fetches, we need a built-in middleware from Express called static.)*/
app.use(express.static('dist'))
//midleware cors
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')  
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


//midlewares
/* express json-parser act as a middleware to takes the raw data from the requests 
that are stored in the request object, parses it into a JavaScript object and 
assigns it to the request object as a new property body.*/ 
app.use(express.json())
app.use(requestLogger)
// handler of requests with unknown endpoint
app.use(unknownEndpoint)






      
    //traer una nota
    app.get('/api/notes/:id', (request, response) => {
      const id = Number(request.params.id)
      Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
        
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })    })
})
    //eliminar una nota
    app.delete('/api/notes/:id', (request, response) => {
      const id = Number(request.params.id)
      Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


    
    
    //crear una nota
    app.post('/api/notes', (request, response) => {
      const body = request.body
    
      if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }
    
      const note = new Note({
        content: body.content,
        important: body.important || false,
      })
    
      note.save().then(savedNote => {
        response.json(savedNote)
      })
    })
   
    //actualizar una nota
    app.put('/api/notes/:id', (request, response, next) => {
      const body = request.body
    
      const note = {
        content: body.content,
        important: body.important,
      }
    
      Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
          response.json(updatedNote)
        })
        .catch(error => next(error))
    })

 

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`) 
    })