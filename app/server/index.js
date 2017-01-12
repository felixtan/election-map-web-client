const express = require('express')
const compression = require('compression')
const favicon = require('serve-favicon')

const PORT = process.env.PORT || 3000
const BUILD = __dirname + "/../../build/"
const PUBLIC = __dirname + "/../public/"
const STATIC = (process.env.NODE_ENV === 'production') ? BUILD : PUBLIC
const app = express()

app.use(compression())
app.use(express.static(STATIC))
app.use(favicon(STATIC + "/img/favicon/favicon.ico"))

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: (process.env.NODE_ENV === 'production') ? BUILD : (__dirname + "/../")
  }, (err) => {
    if (err) {
      console.log(err)
      res.status(err.status).end()
    } else {
      console.log('Sent index.html')
    }
  })
})

app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`==> 🌎 Listening on port ${PORT}.`)
  }
})
