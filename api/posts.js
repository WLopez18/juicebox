const express = require('express');
const postsRouter = express.Router();


const { requireUser } = require('./utils');

const { getAllPosts, createPost, getPostById } = require('../db');

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
    
    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
  
    // only send the tags if there are some to send
    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
      // add authorId, title, content to postData object
      postData.authorId = req.user.id;
      postData.title = title;
      postData.content = content;
  //console.log(id)
      // const post = await createPost(postData);
      const post = await createPost(postData);
  
      // if the post comes back, res.send({ post });
      // otherwise, next an appropriate error object
      if(post){
        res.send({post});
      } else {
        next({
          name: 'createPostError',
          message: "failed to create post"
        });
      }
       
    } catch ({ name, message }) {
      next({ name, message });
    }
  });





postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts
    });
});


module.exports = postsRouter;