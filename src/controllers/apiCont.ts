import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import User, { UserType } from '../models/User.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

// ACCOUNT OPERATIONS
export const login = function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function (err: any, user: any, info: any, status: any) {
        if (err) return next(err)
        if (!user) return res.status(400).json(info)
        req.login(user, next);
        const { password, ...rest } = user;
        res.json({ user: rest });
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
    .isAlphanumeric().withMessage('Username must not contain non-alphanumeric characters'),
    body('email').trim().isEmail().withMessage('Must be valid email'),
    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm').trim().notEmpty().withMessage('Please confirm password').custom((value, {req}) => {
        if (value !== req.body.password) { 
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
        } else {
            const hashed = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                about: '',
                friends: [],
                requests: [],
                facebookId: ''
            })
            await newUser.save()
            req.login(newUser as any, (err) => next(err)) // @ts-ignore
            const { password, ...rest } = newUser._doc;
            res.json({ user: rest });
        }
    }
)]

export const update_profile = [
    body('username').trim().isLength(({ min: 0, max: 15 })).withMessage('Username must be between 0-15 characters')
    .isAlphanumeric().withMessage('Username must not contain non-alphanumeric characters'),
    body('about').trim().isLength(({ max: 150 })).withMessage('About me section has a max length of 150 characters'),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            await User.findByIdAndUpdate(req.user!._id, {
            username: req.body.username,
            about: req.body.about
            }).exec();
        res.sendStatus(200);
    }})
]

export const change_password = [
    body('old').trim().notEmpty().withMessage('Please enter your old password').custom((value, { req }) => {
        const match = bcrypt.compareSync(value, req.user.password)
        if (!match) {
            throw new Error('Please input your current password correctly')
        }
        return true;
    }),
    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm').trim().notEmpty().withMessage('Please confirm password').custom((value, { req }) => {
        if (value !== req.body.password) { 
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashed) => {
                if (err) return next(err);
                User.findByIdAndUpdate(req.user!._id, {
                    password: hashed
                }).exec()
                .then(() => res.sendStatus(200))
                .catch(err => {
                    return next(err);
                })
            })
        }
    })
]

export const check_auth = function(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        next();
        const { password, ...rest } = req.user
        res.json({ user: rest });
    } else {
        res.status(401).json({ message: "User is not logged in" });
    }
}

// GET
export const get_feed = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { friends }: any = await User.findOne({}, "friends").exec();
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