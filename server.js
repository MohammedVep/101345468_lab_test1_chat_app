var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
    name : String,
    message : String
  })



var dbUrl = "mongodb+srv://101345468:votzeC-wowxar-hibme1@cluster1.h6yahll.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('mongodb connected',err);
    }else{
        console.log('Successfully mongodb connected');
    }
})

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })
  
  app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{ 
      if(err)
      {
        //sendStatus(500);
        console.log(err)
      }
  
      //Send Message to all users
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
  });