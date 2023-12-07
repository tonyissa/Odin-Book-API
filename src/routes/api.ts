import express from 'express';
const router = express.Router();

import * as apiCont from '../controllers/apiCont.js';

// ACCOUNT OPERATIONS
router.post('/login', apiCont.login);

router.get('/logout', apiCont.logout);

router.post('/create-account', apiCont.create_account);

router.post('/update-profile', apiCont.update_profile);

// GET
router.get('/feed', apiCont.get_feed);

router.get('/post/:postId', apiCont.get_post);

router.get('/conversations', apiCont.get_conversations);

router.get('/conversations/:userId', apiCont.get_user_conversation);

// POST
router.post('/post', apiCont.create_post);

router.post('/post/:postId/create-reply', apiCont.create_reply);

router.post('/conversations/:userId/create-message', apiCont.create_message);

// UPDATE
router.put('/post/:postId/update', apiCont.update_post);

router.put('/post/:postId/:replyId/update', apiCont.update_reply);

// DELETE
router.delete('/post/:postId/delete', apiCont.delete_post);

router.delete('/post/:postId/:replyId/delete', apiCont.delete_reply);

router.delete('/conversations/:userId/delete', apiCont.delete_message);

export default router