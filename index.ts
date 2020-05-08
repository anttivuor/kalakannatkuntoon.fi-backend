require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Money = require('./money.js')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/money/:id', (request, response, next) => {
    Money.findById(request.params.id)
      .then(money => {
        if (money) response.json(money.toJSON())
        else response.status(404).end()
      })
      .catch(error => {
        next(error)
      })
  })

app.put('/api/money/:id', (request, response, next) => {
    const body = request.body
    const newMoney = {
        number: body.number
    }
      Money.findByIdAndUpdate(request.params.id, newMoney)
        .then(newMoney => {
            response.json(newMoney.toJSON())
        })
  })

  app.post('/api/money',  (request, response, next) => {
    const body = request.body
    const money = new Money({
      number: body.number
    })
    money
      .save()
      .then(money => {
        return money.toJSON()
      })
      .then(money => {
        response.json(money)
      })
      .catch(error => next(error))
  })

  app.get('/api/money', (req, res) => {
    Money.find({}).then(moneys => {
      res.json(moneys.map(money => money.toJSON()))
    })
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

 app.use(unknownEndpoint)

const PORT = 443
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})