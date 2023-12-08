import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// ACCOUNT OPERATIONS
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const create_account = [
    body('username').trim().isLength(({ min: 0, max: 15 })).withMessage('Username must be between 0-15 characters')
    .isAlphanumeric().withMessage('Username must not contain non-alphanumeric characters').escape(),
    body('email').trim().isEmail().withMessage('Must be valid email').escape(),
    asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    bcrypt.hash(req.body.password, 10, async (err, hashed) => {
        try {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                bio: '',
                friends: [],
                requests: []
            })
            await newUser.save();
        } catch (err) {
            console.log(err);
        }
    })
})]

export const update_profile = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

// GET
export const get_feed = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { friends }: any = await User.find({}, "friends").exec();
    const response = await Post.find({ author: { $in: friends } }).exec();
    res.json(response);
})

export const get_user = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.params.userId).exec();
    const posts = await Post.find({ author: req.params.userId }).exec();
    res.json({ user, posts });
})

export const get_conversations = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const get_user_conversation = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

// POST
export const create_post = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const create_reply = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const create_message = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

// UPDATE
export const update_post = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const update_reply = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

// DELETE
export const delete_post = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const delete_reply = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})

export const delete_message = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
})