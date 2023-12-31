const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('build'))

var morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "13456789",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello Phonebook!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.random() * (1000 - 1) + 1
        : 0
    return maxId + 1
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

        if (!body.name) {
            return response.status(400).json({ 
            error: 'name missing' 
            })
        } 
        if (!body.number) {
            return response.status(400).json({
            error: 'number missing'
            })
        }
        if (persons.find(person => person.name === body.name)) {
            return response.status(400).json({
            error: 'name must be unique'
            })
        }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})