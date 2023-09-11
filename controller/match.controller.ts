import { RequestHandler } from "express";
import PLAYER from "../model/player.model";
import MATCH from "../model/matches.model";
import TEAM from "../model/team.model";
import SELECTEDPLAYER from "../model/selectedplyaer.model";

export const getMatchList: RequestHandler = async (req, res) => {

    try {

        const matchData = await MATCH.find().populate({
            path: "team1",
            select: "team_name  -_id",
        }).populate({
            path: "team2",
            select: "team_name  -_id",
        }).populate({
            path: "winner",
            select: "team_name  -_id",
        })

        const formattedData = matchData.map((item: any) => ({
            _id: item._id,
            team1: item.team1.team_name,
            team2: item.team2.team_name,
            winnerTeam: item.winner.team_name,

        }));

        res.status(200).json({ message: "data Fetch Succesfully", data: formattedData });

    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export const getDetailsMatch: RequestHandler = async (req, res) => {
    try {

        const matchId: any = req.params.id

        const matchData: any = await MATCH.findById(matchId).populate({
            path: "team1",
            select: "team_name  -_id",
        }).populate({
            path: "team2",
            select: "team_name  -_id",
        }).populate({
            path: "winner",
            select: "team_name  -_id",
        })
        const formattedData = {
            _id: matchData._id,
            team1: matchData.team1.team_name,
            team2: matchData.team2.team_name,
            winnerTeam: matchData.winner.team_name,

        };

        res.status(200).json({ message: "data Fetch Succesfully", data: formattedData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
export const addMatch: RequestHandler = async (req, res) => {
    try {
        const { team1, team2 } = req.body;

        // Check if both teams have at least 11 players (you can add this check if needed)
        // if (totalPlayerInTeam1.length < 11 || totalPlayerInTeam2.length < 11) {
        //     return res.status(400).json({ message: "Both teams must have at least 11 players" });
        // }

        // Create a new match
        const matchData = new MATCH({
            team1,
            team2,
        });

        // Update both teams' total matches
        await TEAM.updateMany(
            { _id: { $in: [team1, team2] } },
            { $inc: { total_match: 1 } }
        );

        // Save the match data
        const matchDataSave = await matchData.save();

        res.status(200).json({ message: "Match Created Successfully", data: matchDataSave });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }

}


export const resultMatches: RequestHandler = async (req, res) => {
    try {
        const { matchId, winnerId, loserId } = req.body;


        const updatedMatch = await MATCH.findByIdAndUpdate(
            matchId,
            { winner: winnerId },
            { new: true }
        );

        if (!updatedMatch) {
            return res.status(404).json({ message: 'Match not found' });
        }


        const winningTeam: any = await TEAM.findById(winnerId);
        const losingTeam: any = await TEAM.findById(loserId); // Use loserId here

        if (winningTeam && losingTeam) {
            if (winnerId === loserId) {
                // It's a draw
                winningTeam.draw += 1;
                losingTeam.draw += 1;
            } else {
                // One team wins, update their statistics
                winningTeam.points += 2;
                winningTeam.won += 1;

                // The other team loses, update their statistics
                losingTeam.lost += 1;
            }

            await winningTeam.save();
            await losingTeam.save();
        }
        res.status(200).json({ message: 'Match result recorded', data: updatedMatch });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const deletedMacth: RequestHandler = async (req, res) => {
    try {

        const matchId: any = req.params.id

        const matchData = await PLAYER.findByIdAndDelete(matchId)

        res.status(200).json({ message: "Match Deleted Succesfully" });

    } catch (err: any) {
        res.status(500).json({ message: err });

    }
}