const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const bodyParser = require('body-parser');

const consumers = [
    'http://localhost:4000/events',
    'http://localhost:4001/events',
    'http://localhost:4002/events'
]


const app = express();

const commentsByPostId = {}

app.use(bodyParser.json());

app.post('/events',(req,res)=>{
    const event = req.body;
    consumers.forEach(consumer=>axios.post(consumer,event));
    res.status(200).json({status:"OK"});
});


app.listen(4005, () => console.log('Listening on port 4005'));
