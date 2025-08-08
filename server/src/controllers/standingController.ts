import { Request, Response } from 'express';
import axios from 'axios';

// Dummy controller to be implemented later
exports.getStandings = async (req: Request, res: Response) => {
  try {
    const {
        year = 2025   
    } = req.query;
    

    const response = await axios.get(`https://f1api.dev/api/${year}/drivers-championship`);
    const data = response.data.drivers_championship;
    res.status(200).json(data);

    
  } catch (error) {
    console.error('Error fetching standings:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
