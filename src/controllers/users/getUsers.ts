import { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
  console.log(req.user);
  res.send("jusst needed to besure");
};
