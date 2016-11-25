import express from 'express'
import compression from 'compression'
import path from 'path'
import favicon from 'serve-favicon'
import open from 'open'

const PORT = process.env.PORT || 3000
const app = express()

app.use(compression())
app.use(express.static('/'))
app.use(favicon(path.join(__dirname, 'img', 'favicon', 'favicon.ico')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, err => {
  if (err) {
    console.error(err)
  } else {
    open(`http://localhost:${PORT}`)
  }
})
