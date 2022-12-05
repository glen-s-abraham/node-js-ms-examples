const express = require('express');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

const eventBusEndPoint = 'http://event-bus-srv:4005/events'

const app = express();


const comments = {}

app.use(bodyParser.json());



app.post('/events', async (req, res) => {
    const {type,data} = req.body;
    if(type==='commentCreated'){
        const status = data.content.includes('orange')?'rejected':'approved';
        await axios.post(eventBusEndPoint,{
            type:'commentModerated',
            data:{
                id:data.id,
                postId:data.postId,
                content:data.content,
                status
            }
        })
        
    }

    res.status(200).json({status:"OK"});
})


app.listen(4003, () => console.log('Listening on port 4003'));
