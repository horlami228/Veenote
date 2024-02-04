import {Request, Response} from 'express';

export const allusers = (req: Request, res: Response) => {
    res.send("This controller is working fine");
};

