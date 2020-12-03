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

app.get('/', (request, response) =>{
    response.send('<h1>Hello</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)