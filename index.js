const mongoose = require('mongoose')
const BenchmarkObject = require('./benchmarkObject')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

async function runWriteBenchmark(num) {
    const start = Date.now()
    let min = 1000000000
    let max = -1

    for (let i = 0; i < num; i++) {
        const lstart = Date.now()
        await BenchmarkObject.create({
            serial: i
        })
        const lend = Date.now()

        min = Math.min(lend-lstart, min)
        max = Math.max(lend-lstart, max)
    }
    const end = Date.now()
    await BenchmarkObject.deleteMany({})
    return {
        average: parseInt((end-start)/num),
        min: min,
        max: max
    }
}

async function runReadBenchmark(num) {
    await Promise.all(
        Array.from(Array(num).keys()).map(i => BenchmarkObject.create({
            serial: i
        }))
    )

    let min = 1000000000
    let max = -1

    const start = Date.now()
    for (let i = 0; i < num; i++) {
        const lstart = Date.now()
        await BenchmarkObject.findOne({ 
            serial: i 
        })
        const lend = Date.now()
        
        min = Math.min(lend-lstart, min)
        max = Math.max(lend-lstart, max)
    }
    const end = Date.now()

    await BenchmarkObject.deleteMany({})
    return {
        average: parseInt((end-start)/num),
        min: min,
        max: max
    }
}

yargs(hideBin(process.argv))
    .command('write [num]', 'Benchmark write latency', (yargs) => {
        return yargs
            .positional('num', {
                describe: 'Number of write requests to perform'
            })
    }, async (argv) => {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Running write latency benchmark')

        const result = await runWriteBenchmark(argv.num)

        console.log(`Ran ${argv.num} write requests.`)
        console.log(`Average: ${result.average}ms`)
        console.log(`Minimum: ${result.min}ms`)
        console.log(`Maximum: ${result.max}ms`)
        process.exit(0)
    })
    .command('read [num]', 'Benchmark write latency', (yargs) => {
        return yargs
            .positional('num', {
                describe: 'Number of read operations to perform'
            })
    }, async (argv) => {
        console.log('Runnig read latency benchmark')
        await mongoose.connect(process.env.MONGODB_URL)

        const result = await runReadBenchmark(argv.num)
        
        console.log(`Ran ${argv.num} write requests.`)
        console.log(`Average: ${result.average}ms`)
        console.log(`Minimum: ${result.min}ms`)
        console.log(`Maximum: ${result.max}ms`)
        process.exit(0)
    })
    .argv

module.exports = {
    runReadBenchmark,
    runWriteBenchmark
}