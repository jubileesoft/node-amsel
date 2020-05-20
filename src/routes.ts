import { Application, Request, Response } from 'express';

export default function (app: Application): void {
  app.get('/test', (req: Request, res: Response) => {
    res.send('TEST');
  });
}
