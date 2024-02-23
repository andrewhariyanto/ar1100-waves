const express = require('express'),
app = express(),
cors = require('cors')

app.use(cors())
/*app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'indexLayout'
}))
app.set('views', './views')*/
app.use(express.static('./'))

app.get('/', (req,res) => {
    //console.log("received")
    res.sendFile('/index.html')
    //res.render('index', { layout: 'indexLayout'})
})

/*
app.get('/particles', (req, res) => {
    console.log("sending to particles")
    res.render('particles', {layout: 'particlesLayout'})
})

app.get('/waveform', (req,res) => {
    console.log("sending to waveform")
    res.render('waveform', {layout: 'waveformLayout'})
})

app.get('/home', (req, res) => {
    res.redirect('/')
})*/


app.listen(process.env.PORT || 3000)