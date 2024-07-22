import {Request, Response} from 'express';
import { createUser } from '../../controller/userController';
import * as passwordUtils from '../../utilities/passwordHashing';
import { allUsers } from '../../controller/userController';
import mongoose from 'mongoose';
jest.mock('../../model/userModel');
jest.mock('../../model/folderModel');


jest.mock('../../config/config.js', () => ({
    development: {
        uri: 'mongodb://localhost:27017/test_database'
    }
}));


// Mock the database connection module
jest.mock('mongoose', () => {
    const model = jest.fn().mockReturnThis(); // Mock the model function to return itself for chaining
    return {
        __esModule: true,
        default: {
            connect: jest.fn(),
            model: model,
        },
    };
});


// jest.mock('mongoose', () => ({
//     connect: jest.fn(), // Mock the mongoose.connect function
//     model: jest.fn(), // Mock the mongoose.model function if used in your code
// }));


describe('createUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                userName: 'test',
                email: 'test@email.com',
                password: 'password123'
            }
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should create a new user', async () => {
        const mockedHashPassword = jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashedPassword');
        await createUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ User: expect.any(Object), Folder: expect.any(Object) }));
        expect(mockedHashPassword).toHaveBeenCalledWith('password123');
        expect(mongoose.connect).toHaveBeenCalled();
    });

    it('should return 400 if request body is empty', async () => {
        req.body = {};
        await createUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Content can not be empty!" });
    });

    it('should return 400 if userName is missing', async () => {
        req.body = { email: 'test@email.com', password: 'password123' };
        await createUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ "Error": "Missing Username" });
    });

    it('should return 400 if email is missing', async () => {
        req.body = { userName: 'test', password: 'password123' };
        await createUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ "Error": "Missing Email" });
    });

    it('should return 400 if password is missing', async () => {
        req.body = { userName: 'test', email: 'test@email.com' };
        await createUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ "Error": "Missing Password" });
    });

   
});

describe('allUsers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    
});

import { userByName } from '../../controller/userController';

describe('userByName', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            params: {
                userName: 'test'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    
});


import { deleteUser } from '../../controller/userController';

describe('deleteUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {

        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    it('should delete user and related data and return 204', async () => {
        


        await deleteUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });


    it('should handle errors and return 500', async () => {
       

        await deleteUser(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            "Error": "Failed to perform delete",
            "Details": "Database error"
        });
    });
});


import { updateUserEmail } from '../../controller/userController';

describe('updateUserEmail', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
 
            body: {
                email: 'newemail@test.com'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });
    it('should update user email and return 200', async () => {
       

        await updateUserEmail(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Email updated successfully" });
    });

    it('should return 400 if email is missing', async () => {
        req.body = {};

        await updateUserEmail(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Email is required" });
    });



    it('should return 409 if email already exists', async () => {
      

        await updateUserEmail(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: "User with the provided email already exists" });
    });



    it('should return 404 if user not found', async () => {
  

        await updateUserEmail(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });



    it('should handle errors and return 500', async () => {
      
        await updateUserEmail(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error updating email",
            details: "Database error"
        });
    });
});


