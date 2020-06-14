const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')

//connect env vars
dotenv.config({path:'./config/config.env'})

const app = express()

//Body parser
app.use(express.json())

//Apply middleware
if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'))
}

//Connect to db
connectDB()

//Mount routes
app.use('/api/bootcamps', require('./routes/bootcamps'))

const server = app.listen(process.env.PORT,
    ()=> console.log(`Server has been run in the ${process.env.NODE_ENV} mode on the ${process.env.PORT} port`)
)


//Handle unhandled rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    server.close(()=> process.exit())
})