const Note = require('./models/note')
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message 
        })
      }
  next(error)
}






      
    //traer una nota
    app.get('/api/notes/:id', (request, response) => {
      const id = Number(request.params.id)
      Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).send('No se encontro la nota') 
        
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

    //traer todas las notas
    app.get('/api/notes', (request, response) => {
      Note.find({}).then(notes => {
        response.json(notes)
      })
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
    
      note.save()
      .then(savedNote => {
        response.json(savedNote)
      })
      //si hay un error en la creación de la nota se pasa al middleware manejador de errores usando next()
      /*When an error is passed to next, Express will skip all remaining middleware in the stack and go 
      straight to the error handling middleware.*/
      .catch(error => next(error))
    })
   
    //actualizar una nota
    app.put('/api/notes/:id', (request, response, next) => {
      //esta ruta tiene un manejo de errores personalizado ya que 
      //findByIdAndUpdate no devuelve un objeto validado
      const { content, important } = request.body
    
      const note = {
        content: body.content,
        important: body.important,
      }
    
      Note.findByIdAndUpdate(
        request.params.id, 
        { content, important },    
        { new: true, runValidators: true, context: 'query' })
          .then(updatedNote => {
            response.json(updatedNote)
          })
          .catch(error => next(error))
    })

    /*estos dos middlewares manejadores de errores deben ser los últimos cargados en el archivo por que
     se ejecutan en orden de carga ya que antes de ellos se debn ejecutar las rutas y si pasa algo lo pasan a los middlewares*/
    app.use(unknownEndpoint)
    app.use(errorHandler)
 

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`) 
    })