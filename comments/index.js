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
        id:commentId, content,status:"pending"
    }]));
    await axios.post(eventBusEndPoint,{
        type:"commentCreated",
        data:{
            postId:req.params.id,id:commentId, content,status:"pending"
         }
    })
    res.status(201).json(commentsByPostId[req.params.id]);
})

app.post('/events',async(req,res)=>{
    console.log(`Recieved event ${req.body.type}`);
    const {type,data} = req.body;
    if(type==='commentModerated'){
        const {postId,id,status,content} = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment=>comment.id===id);
        comment.status = status;
        await axios.post(eventBusEndPoint,{
            type:"commentUpdated",
            data:{postId,...comment}
        })
    }
    
    res.status(200).json({status:"OK"});
})


app.listen(4001, () => console.log('Listening on port 4001'));
