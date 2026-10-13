const express = require('express')
app = express()

const cors = require('cors')

var url = require('url')

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/static'))
app.use(cors({origin: '*'}))

app.get('/ping', (req, res) => {
    console.log('Calling /api/ping')
    res.type('text/plain')
    res.send('ping responce')
})

app.listen(port, () => console.log(
    'Express started at \"http://localhost:${port}\"\n' +
    'press Ctrl-C to terminate.'
))