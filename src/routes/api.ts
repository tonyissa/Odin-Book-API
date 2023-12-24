import express from 'express';
const router = express.Router();

import * as apiCont from '../controllers/apiCont.js';

// ACCOUNT OPERATIONS
router.post('/login', apiCont.login, apiCont.return_user);

router.get('/logout', apiCont.logout);

router.post('/create-account', apiCont.create_account, apiCont.return_user);

router.post('/update-profile', apiCont.update_profile);

router.post('/change-password', apiCont.change_password);

router.get('/auth', apiCont.check_auth, apiCont.return_user);

// GET STUFF
router.get('/user/:userId', apiCont.get_user);

router.get('/conversations', apiCont.get_conversations);

router.get('/conversations/:userId', apiCont.get_user_conversation);

router.post('/feed', apiCont.get_feed);

// CREATE STUFF
router.post('/post', apiCont.create_post);

router.post('/post/:postId/create-reply', apiCont.create_reply);

router.post('/conversations/:userId/create-message', apiCont.create_message);

// UPDATE STUFF
router.put('/post/:postId/update', apiCont.update_post);

router.put('/post/:postId/:replyId/update', apiCont.update_reply);

// DELETE STUFF
router.delete('/post/:postId/delete', apiCont.delete_post);

router.delete('/post/:postId/:replyId/delete', apiCont.delete_reply);

router.delete('/conversations/:userId/delete', apiCont.delete_message);

export default router