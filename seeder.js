const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
const Bootcamp = require('./models/Bootcamp')

dotenv.config({path:'./config/config.env'})

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))

const importDB = async () => {
    await Bootcamp.create(bootcamps)
    process.exit(1)
}

const destroyDB = async () => {
    await Bootcamp.deleteMany()
    process.exit(1)
}

if(process.argv[2]=='-i'){
    importDB()
} else{
    destroyDB()
}

