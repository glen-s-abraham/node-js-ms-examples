const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const bodyParser = require('body-parser');

const consumers = [
    'http://localhost:4000/events',
    'http://localhost:4001/events',
    'http://localhost:4002/events',
    'http://localhost:4003/events'
]



const app = express();

const eventStore = [];
const commentsByPostId = {}

app.use(bodyParser.json());

app.post('/events',async(req,res)=>{
    const event = req.body;
    eventStore.push(event);
    for(let consumer of consumers){
        try {
            await axios.post(consumer,event);
        } catch (error) {
            console.log(error);
            continue;
        }
    }
    res.status(200).json({status:"OK"});
});

app.get('/events',(req,res)=>{
    res.status(200).send(eventStore);
})


app.listen(4005, () => console.log('Listening on port 4005'));
