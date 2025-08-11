import { Router, Request, Response } from 'express';
import { FantasyTeam, Driver, Race } from '../models';
import { authMiddleware } from '../middleware/authMiddleware';
import axios from 'axios';

const gameRouter = Router();


gameRouter.get('/:raceId', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const role = req.user?.role;

    if(role != 'admin'){
        return res.status(500).json({
            success: false,
            message: "You are not the one! Ask Neo"
        });
    }

    const {
        raceId
    } = req.params;

    const response = await getLastRaceResult();
    const resRaceId = response.races.raceId;

    const race = await Race.findById(raceId).exec();
    const reqRaceId = race?.raceId;

    return res.status(200).json({
        success : true,
        res: resRaceId,
        req: reqRaceId
    })



  
});

const getLastRaceResult = async() => {
    const response = await axios.get('https://f1api.dev/api/current/last/race');
    return response.data;
}

export default gameRouter;
