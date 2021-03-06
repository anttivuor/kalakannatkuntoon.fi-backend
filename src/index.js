require('dotenv').config()
const express = require('express')
const serverless = require('serverless-http');
const cors = require('cors')

const Money = require('./money.js')
const Feedback = require('./feedback.js')
const app = express()

app.use(express.json())
app.use(cors())

const router = express.Router()

router.get('/api/feedback', (req, res) => {
  Feedback.find({}).then(feedbacks => {
    res.json(feedbacks.map(feedback => feedback.toJSON()))
  })
})

router.get('/api/feedback/:id', (request, response, next) => {
  Feedback.findById(request.params.id)
    .then(feedback => {
      if (feedback) response.json(feedback.toJSON())
      else response.status(404).end()
    })
    .catch(error => {
      next(error)
    })
})

router.post('/api/feedback',  (request, response, next) => {
  const body = request.body
  const feedback = new Feedback({
    fname: body.fname,
    sname: body.sname,
    fback: body.fback
  })
  feedback
    .save()
    .then(feedback => {
      return feedback.toJSON()
    })
    .then(feedback => {
      response.json(feedback)
    })
    .catch(error => next(error))
})
    

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