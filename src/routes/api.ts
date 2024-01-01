import express from 'express';
const router = express.Router();

import * as apiCont from '../controllers/apiCont.js';

// ACCOUNT OPERATIONS
router.post('/login', apiCont.login, apiCont.return_user);

router.get('/logout', apiCont.logout);

router.post('/create-account', apiCont.create_account, apiCont.return_user);

router.post('/change-password', apiCont.check_auth, apiCont.change_password);

router.get('/auth', apiCont.check_auth, apiCont.return_user);

router.delete('/delete-user', apiCont.check_auth, apiCont.delete_user)

router.get("/google/", apiCont.google_login);

// GET STUFF
router.get('/user/:userId', apiCont.get_user);

router.get('/conversations', apiCont.get_conversations);

router.get('/conversations/:userId', apiCont.get_user_conversation);

router.get('/feed', apiCont.check_auth, apiCont.get_feed); 

// CREATE STUFF
router.post('/post', apiCont.check_auth, apiCont.create_post);

router.post('/conversations/:userId/create-message', apiCont.create_message);

export default router