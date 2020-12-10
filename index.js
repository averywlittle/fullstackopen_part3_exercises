require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))
// LOL do not forget this
app.use(express.json())
// Custom body token for morgan logging
morgan.token('body', function (req) { return JSON.stringify(req.body) })

// Couldn't figure out how to supplement 'tiny' format, and had to use built in tokens
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Models
const Person = require('./models/person')

// Using express means we don't have to use stringify
app.get('/', (request, response) => {
    response.send('<h1>Hello</h1>')
})

// Get all endpoint
app.get('/api/persons', (request, response, next) => {
    
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

// Get 1 person endpoint
// Parameters come in as strings and need to be checked for correct format :)
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

// Delete 1 person endpoint
// Tested with postman
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Create a person endpoint
app.post('/api/persons', (request, response, next) => {

    const body = request.body

    const name = body.name
    const number = body.number

    const person = new Person({
        name: name,
        number: number,
        date: new Date(),
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    // Don't call the model here or it will have issues with the Id
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            response.json(updatedPerson)
        })
        .catch(error => next(error))
    
})

// Info page
app.get('/info', (request, response) => {
    
    Person.countDocuments(function (error, count) {

        let date = new Date()
        
        response.send(`<p>Phonebook has info for ${count} people</p>
        <p>${date}</p>`)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)