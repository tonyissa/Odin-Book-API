import { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User, { UserType } from '../models/User.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

// AUTH
export const check_auth = function(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.sendStatus(401);
    }
}

export const return_user = function(req: Request, res: Response, next: NextFunction) {
    const { password, ...rest } = req.user!._doc;
    return res.status(200).json(rest);
}

// ACCOUNT OPERATIONS
export const login = function (req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', function (err: any, user: any, info: any, status: any) {
        if (err) return next(err);
        if (!user) return res.status(400).json(info)
        req.logIn(user, function(err) {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
}

export const google_login = passport.authenticate('google', { scope: ['email', 'profile'] })

export const google_redirect = passport.authenticate('google');

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
            const newUser: any = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                googleId: ''
            })
            await newUser.save()
            req.login(newUser, (err) => {
                if (err) return next(err);
                return next();
            })
        }
    }
)]

export const change_password = [
    body('oldPassword').trim().custom((value, { req }) => {
        if (req.user.password === '') {
            return true
        }
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
            res.status(400).json(errors.array());
        } else {
            const hashed = await bcrypt.hash(req.body.password, 10)
            await User.findByIdAndUpdate(req.user!._id, { password: hashed }).exec();
            res.sendStatus(200);
        }
    })
]

// GET STUFF
export const get_feed = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = await Post.find().populate('author', 'username').sort({ date: -1 }).exec();
    res.json(response);
})

export const get_user = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.userId, '-password').exec();
    const posts = await Post.find({ author: req.params.userId }).exec();
    res.json({ user, posts });
})

export const get_conversations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

export const get_user_conversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

// CREATE STUFF
export const create_post = [
    body('input').trim().isLength({ max: 3000 }).withMessage('Post must not exceed 3000 characters'),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            const newPost = new Post({
                body: req.body.input,
                filename: '',
                date: Date.now(),
                author: req.user!._id
            })
            await newPost.save();
            res.status(200).json(newPost);
        }
    })
]

export const create_message = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
})

// DELETE STUFF
export const delete_user = [
    body('password').trim().notEmpty().withMessage('Please enter your password').custom((value, { req }) => {
        const match = bcrypt.compareSync(value, req.user.password)
        if (!match) {
            throw new Error('Please enter your current password correctly')
        }
        return true;
    }),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
        } else {
            await Post.deleteMany({ author: req.user!._id }).exec();
            await User.findByIdAndDelete(req.user!._id).exec();
            res.sendStatus(200);
        }
})
]