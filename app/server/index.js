const express = require('express')
const compression = require('compression')
const path = require('path')
const favicon = require('serve-favicon')

// const INDEX = "/Users/photon/Development/politics-map/client-dev/app/index.html"
const PORT = process.env.PORT || 3000
const app = express()

app.use(compression())
app.use(express.static(__dirname))
app.use(favicon(path.join('img', 'favicon', 'favicon.ico')))

app.get('/', (req, res) => {
  // res.sendFile(INDEX)
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`==> 🌎 Listening on port ${PORT}.`)
  }
})
