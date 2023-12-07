import express, {Request, Response, NextFunction} from 'express'
import expressAsyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

// ACCOUNT OPERATIONS
export const login = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const logout = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const create_account = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const update_profile = function(req: Request, res: Response, next: NextFunction): void {
    
}

// GET
export const get_feed = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const get_post = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const get_conversations = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const get_user_conversation = function(req: Request, res: Response, next: NextFunction): void {
    
}

// POST
export const create_post = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const create_reply = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const create_message = function(req: Request, res: Response, next: NextFunction): void {
    
}

// UPDATE
export const update_post = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const update_reply = function(req: Request, res: Response, next: NextFunction): void {
    
}

// DELETE
export const delete_post = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const delete_reply = function(req: Request, res: Response, next: NextFunction): void {
    
}

export const delete_message = function(req: Request, res: Response, next: NextFunction): void {
    
}