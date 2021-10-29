const express = require('express')
const router = express.Router()
const postController = require('../controller/postController')


router.get('/add-postedService', postController.newPost)

router.get("/search", postController.search)

router.get('/category/:categoryId', postController.getCategory)

router.get('/:id', postController.getPosts)

router.post('/post', postController.addPost)


module.exports = router