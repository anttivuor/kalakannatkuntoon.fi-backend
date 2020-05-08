require('dotenv').config();
var express = require('express');
var cors = require('cors');
var app = express();
var Money = require('./money.js');
app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.get('/api/money/:id', function (request, response, next) {
    Money.findById(request.params.id)
        .then(function (money) {
        if (money)
            response.json(money.toJSON());
        else
            response.status(404).end();
    })["catch"](function (error) {
        next(error);
    });
});
app.put('/api/money/:id', function (request, response, next) {
    var body = request.body;
    var newMoney = {
        number: body.number
    };
    Money.findByIdAndUpdate(request.params.id, newMoney)
        .then(function (newMoney) {
        response.json(newMoney.toJSON());
    });
});
app.post('/api/money', function (request, response, next) {
    var body = request.body;
    var money = new Money({
        number: body.number
    });
    money
        .save()
        .then(function (money) {
        return money.toJSON();
    })
        .then(function (money) {
        response.json(money);
    })["catch"](function (error) { return next(error); });
});
app.get('/api/money', function (req, res) {
    Money.find({}).then(function (moneys) {
        res.json(moneys.map(function (money) { return money.toJSON(); }));
    });
});
var unknownEndpoint = function (request, response) {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);
var PORT = 3001;
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
