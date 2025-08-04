import { Request, Response } from "express";

export const logIn = async (req: Request, res: Response): Promise<void> => {

    res.status(200).json({message:'login!'})

}