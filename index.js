require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))
// LOL do not forget this
app.use(express.json())
// Custom body token for morgan logging
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

// Couldn't figure out how to supplement 'tiny' format, and had to use built in tokens
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Models
const Person = require('./models/person')

let persons = [
    {
        id: 1,
        name: "Avery",
        number: "356-456"
    },
    {
        id: 2,
        name: "Sum",
        number: "385-3356"
    },
    {
        id: 3,
        name: "Zach",
        number: "501-3356"
    },
    {
        id: 4,
        name: "Rob",
        number: "578-3056"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => person.id))
        : 0
    return maxId + 1
}

// Using express means we don't have to use stringify
app.get('/', (request, response) => {
    response.send('<h1>Hello</h1>')
})

// Get all endpoint
app.get('/api/persons', (request, response) => {
    
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Get 1 person endpoint
// Parameters come in as strings and need to be checked for correct format :)
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// Delete 1 person endpoint
// Tested with postman
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// Create a person endpoint
app.post('/api/persons', (request, response) => {

    const body = request.body

    const name = body.name
    const number = body.number

    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
    const existingPerson = persons.find(person => person.name === name)
    
    if (existingPerson) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: name,
        number: number,
        date: new Date(),
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Info page
app.get('/info', (request, response) => {
    let entries = persons.length
    let date = new Date()
    response.send(`<p>Phonebook has info for ${entries} people</p>
                    <p>${date}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)