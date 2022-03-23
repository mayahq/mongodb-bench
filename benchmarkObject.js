const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    serial: {
        type: Number,
        index: true
    }
})

const BenchmarkObject = mongoose.model('BenchmarkObject', schema)

module.exports = BenchmarkObject