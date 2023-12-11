import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

// ACCOUNT OPERATIONS
export const login = function(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function(err: any, user: any, info: any, status: any) {
        if (err) return next(err)
        req.login(user, (err) => {
            if (err) {
                next(err)
                return res.sendStatus(400);
            }
        })
        res.sendStatus(200);
    })(req, res, next);
}

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.logout(err => {
        if (err) return next(err);
    })
    res.sendStatus(200);
})

export const create_account = [
    body('username').trim().isLength(({ min: 0, max: 15 })).withMessage('Username must be between 0-15 characters')
    .isAlphanumeric().withMessage('Username must not contain non-alphanumeric characters').escape(),
    body('email').trim().isEmail().withMessage('Must be valid email').escape(),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashed) => {
                if (err) return next(err);
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed,
                    bio: '',
                    friends: [],
                    requests: [],
                    facebookId: ''
                })
                newUser.save()
                .then(() => {
                    req.login(newUser, (err) => next(err))
                })
                .catch(err => next(err))
            })
        }
    }
)]

export const update_profile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const facebook_login = function(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('facebook', function(err: any, user: any, info: any, status: any) {
        if (err) return next(err)
        if (!user.password) { // CHECK IF THIS WORKS, MIGHT HAVE TO ADJUST SERIALIZEUSER IN APP.TS
            return res.sendStatus(418);
        }
        req.login(user, (err) => {
            if (err) {
                next(err)
                return res.sendStatus(400);
            }
        })
        res.sendStatus(200);
      })(req, res, next);
}

// GET
export const get_feed = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { friends }: any = await User.find({}, "friends").exec();
    const response = await Post.find({ author: { $in: friends } }).exec();
    res.json(response);
})

export const get_user = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.userId).exec();
    const posts = await Post.find({ author: req.params.userId }).exec();
    res.json({ user, posts });
})

export const get_conversations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const get_user_conversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

// POST
export const create_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const create_reply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const create_message = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

// UPDATE
export const update_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const update_reply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

// DELETE
export const delete_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const delete_reply = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const delete_message = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})