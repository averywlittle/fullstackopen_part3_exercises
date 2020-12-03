const express = require('express');
const app = express()

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

// Using express means we don't have to use stringify
app.get('/', (request, response) => {
    response.send('<h1>Hello</h1>')
})

// Get all endpoint
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Get 1 person endpoint
// Parameters come in as strings and need to be checked for correct format :)
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

// Delete 1 person endpoint
// Tested with postman
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// Info page
app.get('/info', (request, response) => {
    let entries = persons.length
    let date = new Date()
    response.send(`<p>Phonebook has info for ${entries} people</p>
                    <p>${date}</p>`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)