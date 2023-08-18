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
        // const team1 = req.body.team1
        // const team2 = req.body.team2

        // const totalPlayerInTeam1 = await SELECTEDPLAYER.find({ team_id: team1 })
        // const totalPlayerInTeam2 = await SELECTEDPLAYER.find({ team_id: team2 })

        // if (!(totalPlayerInTeam1.length >= 11)) {
        //     return res.status(400).json({ message: "all team1 member not presnet" })
        // }
        // if (!(totalPlayerInTeam2.length >= 11)) {
        //     return res.status(400).json({ message: "all team2 member not presnet" })
        // }
        const matchData = new MATCH({
            team1: req.body.team1,
            team2: req.body.team2,
        })
        const matchDataSave = await matchData.save()

        res.status(200).json({ message: "Match Created Succesfully", data: matchDataSave });

    } catch (err: any) {
        res.status(500).json({ message: err });


    }

}


export const resultMatches: RequestHandler = async (req, res) => {
    try {
        const { matchId, winnerId } = req.body;


        const updatedMatch = await MATCH.findByIdAndUpdate(
            matchId,
            { winner: winnerId },
            { new: true }
        );

        if (!updatedMatch) {
            return res.status(404).json({ message: 'Match not found' });
        }


        const winningTeam: any = await TEAM.findById(winnerId);
        if (winningTeam) {
            winningTeam.points += 2;
            await winningTeam.save();
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