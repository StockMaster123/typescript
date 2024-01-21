import { Response } from 'express';

const errorHandle = (error:string, res:Response) => {
    res.status(500).json(error)
}

export { errorHandle }