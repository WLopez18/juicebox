const express = require('express');
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {
        const tagNames = await getPostsByTagName(tagName);
        if(req.user){
            const userPosts = tagNames.filter( post => post.authorId === req.user.id)
            res.send({posts: userPosts})
            }
       
        res.send({
            posts: tagNames
        
        });
        // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
        throw { name, message }
    }
});


module.exports = tagsRouter;