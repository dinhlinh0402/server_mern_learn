require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const session =  require('express-session')

// const authRouter = require('./routers/auth')
// const postRouter = require('./routers/post')
const adminRoute = require('./routers/admin')

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://linhwebdev:1234@mern-learnit-3.1lwcn.mongodb.net/mern-learnit-3?retryWrites=true&w=majority`, 
        // await mongoose.connect(`mongodb+srv://linhwebdev:1234@mern-learnit-3.1lwcn.mongodb.net/mern-learnit-3?retryWrites=true&w=majority`,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
       
        console.log('MongoDB connected')

    } catch (error) {
        console.log(error.message)
        process.exit(1)
        
    }
}

connectDB()

const app = express() 
// Lay form Data
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json())
app.use(cors())

// app.use(morgan('combined'))

// Express Session
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// Template engine
app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b
    }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources','views'))

// Static file
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => res.send('Hello world'))
// app.use('/api/auth', authRouter)
// app.use('/api/posts', postRouter)

app.use('/admin', adminRoute)
// const controllers = require('./controllers/admin')
// app.use('/admin', controllers)

// const abcRouter = require('./routers/abc')
// app.use('/ok', abcRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))