import { Request, Response } from 'express';
import statisticService from '../services/statistic';

class StatisticController {
  async getStatistic(req: Request, res: Response) {
    const result = await statisticService.getStatistic();
    res.send(result);
  }
}

export default new StatisticController();
