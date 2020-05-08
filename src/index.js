require('dotenv').config()
const express = require('express')
const serverless = require('serverless-http');
const cors = require('cors')

const Money = require('./money.js')
const app = express()

app.use(cors())

const router = express.Router()

router.get('/api/money/:id', (request, response, next) => {
  Money.findById(request.params.id)
    .then(money => {
      if (money) response.json(money.toJSON())
      else response.status(404).end()
    })
    .catch(error => {
      next(error)
    })
})

router.put('/api/money/:id', (request, response, next) => {
  const body = request.body
  const newMoney = {
      number: body.number
  }
    Money.findByIdAndUpdate(request.params.id, newMoney)
      .then(newMoney => {
          response.json(newMoney.toJSON())
      })
})

router.post('/api/money',  (request, response, next) => {
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

router.get('/api/money', (req, res) => {
  Money.find({}).then(moneys => {
    res.json(moneys.map(money => money.toJSON()))
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

router.use(unknownEndpoint)

// const PORT = 5000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

app.use('/.netlify/functions/index', router)

module.exports.handler = serverless(app)