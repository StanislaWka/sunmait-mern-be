import express from 'express';

import pkgJson from '../../../package.json';

class ServerStatusController {
  async status(_req: express.Request, res: express.Response): Promise<void> {
    res.json({ version: pkgJson.version });
  }
}

export default new ServerStatusController();
