const mongoose = require("mongoose");
const { runReadBenchmark, runWriteBenchmark } = require ('./index')

async function test() {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('\n')
    console.log('Running write latency benchmark')

    const num = parseInt(process.argv[2])
    let result = await runWriteBenchmark(num)

    console.log(`Ran ${num} write requests.`)
    console.log(`Average: ${result.average}ms`)
    console.log(`Minimum: ${result.min}ms`)
    console.log(`Maximum: ${result.max}ms`)

    console.log('\n\n')

    console.log('Runnig read latency benchmark')
    await mongoose.connect(process.env.MONGODB_URL)

    result = await runReadBenchmark(num)
    
    console.log(`Ran ${num} write requests.`)
    console.log(`Average: ${result.average}ms`)
    console.log(`Minimum: ${result.min}ms`)
    console.log(`Maximum: ${result.max}ms`)
}

test().then(() => process.exit(0))