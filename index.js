const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

//connect env vars
dotenv.config({path:'./config/config.env'})

const app = express()

//Apply middleware
if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'))
}

//Mount routes
app.use('/api/bootcamps', require('./routes/bootcamps'))

app.listen(process.env.PORT,
    ()=> console.log(`Server has been run in the ${process.env.NODE_ENV} mode on the ${process.env.PORT} port`)
)