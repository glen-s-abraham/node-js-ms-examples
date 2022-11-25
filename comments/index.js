const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const bodyParser = require('body-parser')

const eventBusEndPoint = 'http://localhost:4005/events'

const app = express();

const commentsByPostId = {}

app.use(bodyParser.json());

app.get('/posts/:id/comments', (req, res) => {
    res.status(200).json(commentsByPostId[req.params.id]);
})

app.post('/posts/:id/comments', async(req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    commentsByPostId[req.params.id]=(comments.concat([{
        commentId, content
    }]));
    await axios.post(eventBusEndPoint,{
        type:"commentCreated",
        data:{
            postId:req.params.id,commentId, content
         }
    })
    res.status(201).json(commentsByPostId[req.params.id]);
})

app.post('/events',(req,res)=>{
    console.log(`Recieved event ${req.body.type}`);
    res.status(200);
})


app.listen(4001, () => console.log('Listening on port 4001'));
