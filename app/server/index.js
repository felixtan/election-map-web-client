import express from 'express'
import compression from 'compression'
import path from 'path'
import favicon from 'serve-favicon'

const PORT = process.env.PORT || 3000
const app = express()

app.use(compression())
app.use(express.static(__dirname))
app.use(favicon(path.join(__dirname, 'img', 'favicon', 'favicon.ico')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`==> 🌎 Listening on port ${PORT}.`)
  }
})
