const express = require('express');
const {randomBytes} = require('crypto');
const axios = require('axios');
const bodyParser = require('body-parser')

const eventBusEndPoint = 'http://event-bus-srv:4005/events'

const app = express();

const posts = {};

app.use(bodyParser.json());

app.get('/posts',(req,res)=>{
    res.status(200).json(posts);
})

app.post('/posts/create',async(req,res)=>{
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    posts[id] = {
       id, title
    }
    await axios.post(eventBusEndPoint,{
        type:"postCreated",
        data:{
            id, title
         }
    })
    res.status(200).json(posts[id]); 
})

app.post('/events',(req,res)=>{
    console.log(`Recieved event ${req.body.type}`);
    res.status(200).json({status:"OK"});
})

app.listen(4000,()=>console.log('Listening on port 4000'));
