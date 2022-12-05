const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const eventBusEndPoint = 'http://event-bus-srv:4005/events'

const app = express();


const postsWithComments = {}

app.use(bodyParser.json());

const handleEvent = (type, data) => {
    if (type === 'postCreated') {
        const { id, title } = data;
        postsWithComments[id] = { id, title, comments: [] }
    }
    if (type === 'commentCreated') {
        const { id, content, postId, status } = data;
        postsWithComments[postId].comments.push({ id, content, status });
    }
    if (type === 'commentUpdated') {
        const { id, content, postId, status } = data;
        const comments = postsWithComments[postId].comments;
        const comment = comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.status(200).json(postsWithComments);
})

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.status(200).json({ status: "OK" });
})


app.listen(4002, async () => {
    try {
        const events = await axios.get(eventBusEndPoint);
        for (let event of events.data) {
            console.log(`Processing ${event.type}`);
            handleEvent(event.type, event.data);
        }
    }catch(err){
        console.log(err);
    }
    console.log('Listening on port 4002')
});
