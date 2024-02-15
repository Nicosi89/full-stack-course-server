const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()

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




let notes = [  
  {    
  id: 1,    
  content: "HTML is easy",    
  important: true  
},  
  {    
    id: 2,    
    content: "Browser can execute only JavaScript",    
    important: false  
  },  
    {    
      id: 3,    
      content: "GET and POST are the most important methods of HTTP protocol",    
      important: true  
    }
    ]
      
    app.get('/api/notes/:id', (request, response) => {
      const id = Number(request.params.id)
      const note = notes.find(note => note.id === id)

      if (note) {    
        //middleware
        response.json(note)  
      } else {    
        response.status(404).end()  
      }

      
    })
    
    app.delete('/api/notes/:id', (request, response) => {
      const id = Number(request.params.id)
      notes = notes.filter(note => note.id !== id)
    
      response.status(204).end()
    })

    const generateId = () => {
      const maxId = notes.length > 0
      
      /*Math.max returns the maximum value of the numbers that
       are passed to it. However, notes.map(n => n.id) is an 
       array so it can't directly be given as a parameter to 
       Math.max. The array can be transformed into individual 
       numbers by using the "three dot" spread syntax ....
       */
       ? Math.max(...notes.map(n => n.id))
        : 0
      return maxId + 1
    }
    
    app.post('/api/notes', (request, response) => {
      const body = request.body
    
      if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
    
      const note = {
        content: body.content,
        /*
        If the data saved in the body variable has the important property, 
        the expression will evaluate its value and convert it to a boolean 
        value. If the property does not exist, then the expression will 
        evaluate to false which is defined on the right-hand side of the vertical lines.
        */
        important: Boolean(body.important) || false,
        id: generateId(),
      }
    
      notes = notes.concat(note)
    
      response.json(note)
    })
   
    app.get('/api/notes', (request, response) => {
      response.json(notes)
    })

    app.use(unknownEndpoint)

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`) 
    })