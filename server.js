const express = require('express')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err))

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))
app.use("/uploads", express.static("uploads"))

app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`)
})