import { RequestHandler } from "express";
import SELECTEDPLAYER from "../model/selectedplyaer.model";
import TEAM from "../model/team.model";
import PLAYER from "../model/player.model";
import mongoose from 'mongoose';

export const getNotSelectedPlayerList: RequestHandler = async (req, res) => {

    try {
        const selectedPlayerIds: any = await SELECTEDPLAYER.find()
        const mappingSelectedPlayerIds = await selectedPlayerIds.map((item: any) => item.player_id.toString());


        const notSelectedPlayers: any[] = await PLAYER.find({
            _id: { $nin: mappingSelectedPlayerIds }
        });
        console.log(notSelectedPlayers);

        const formattedData = notSelectedPlayers.map((player: any) => ({
            // _id: player._id,
            name: player.name,
            jersey_no: player.jersey_no,
        }));

        res.status(200).json({ message: "Data Fetch Successfully", data: formattedData });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


export const getSelectedPlayerList: RequestHandler = async (req, res) => {
    try {
        const selectedTeamData: any = await SELECTEDPLAYER.find().populate({

            path: "player_id",
            select: "name jersey_no -_id",
        })
            .populate({
                path: "team_id",
                select: "team_name  -_id ",
            });
        const formattedData = selectedTeamData.map((item: any) => ({
            _id: item._id,
            name: item.player_id.name,
            team_name: item.team_id.team_name,
            // team_jersey_color: item.team_id.team_jersey_color,
            jersey_no: item.player_id.jersey_no,
            // createdAt: item.createdAt,
            // updatedAt: item.updatedAt
        }));
        res.status(200).json({ message: "Data Fetch Successfully", data: formattedData });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}



export const getDetailsSelectedPlayer: RequestHandler = async (req, res) => {
    try {

        const selectedPlayerId: any = req.params.id
        if (!mongoose.Types.ObjectId.isValid(selectedPlayerId)) {
            return res.status(400).json({ message: 'Invalid teamId' });
        }

        const selectedTeamData: any = await SELECTEDPLAYER.findById(selectedPlayerId)
            .populate({
                path: "player_id",
                select: "name jersey_no -_id",
            })
            .populate({
                path: "team_id",
                select: "team_name  -_id ",
            });


        const formattedData = {
            _id: selectedTeamData._id,
            name: selectedTeamData.player_id.name,
            team_name: selectedTeamData.team_id.team_name,
            // team_jersey_color: selectedTeamData.team_id.team_jersey_color,
            jersey_no: selectedTeamData.player_id.jersey_no,
            // createdAt: selectedTeamData.createdAt,
            // updatedAt: selectedTeamData.updatedAt,


        };
        res.status(200).json({ message: "data Fetch Succesfully", data: formattedData });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const addSelectedPlayer: RequestHandler = async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const playerId = req.body.playerId;

        // Check if the teamId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ message: 'Invalid teamId' });
        }
        // Fetch the player's details
        const player = await PLAYER.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Check if the team exists
        const team = await TEAM.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }


        // Check if the player is already in the team

        // Fetch the existing selected players for the team
        const selectedPlayers = await SELECTEDPLAYER.find({ team_id: teamId });
        // console.log(selectedPlayers);

        // Check if the team has already reached the maximum allowed players
        if (selectedPlayers.length >= 11) {
            return res.status(400).json({ message: 'Maximum 11 players allowed per team' });
        }
        const playerArray = await Promise.all(selectedPlayers.map(async (item) => {
            const players = await PLAYER.findById({ _id: item.player_id });
            return players;
        }));

        const malePlayersCount = playerArray.filter((player: any) => player.gender === 'male');
        const femalePlayersCount = playerArray.filter((player: any) => player.gender === 'female');


        console.log("male", malePlayersCount.length);
        console.log("female", femalePlayersCount.length);

        if (player.gender === "male" && malePlayersCount.length >= 7) {
            return res.status(404).json({ message: 'No vacancy for a male member in the team' });
        }
        if (player.gender === "female" && femalePlayersCount.length >= 4) {
            return res.status(404).json({ message: 'No vacancy for a female member in the team' });
        }


        const existingSelectedPlayer = await SELECTEDPLAYER.findOne({ player_id: playerId });
        if (existingSelectedPlayer) {
            return res.status(400).json({ message: 'Player is already in the team' });
        }
        // Create a new selectedPlayer entry
        const selectedPlayer = new SELECTEDPLAYER({
            team_id: teamId,
            player_id: playerId,
        });

        // Save the selectedPlayer entry
        const savedSelectedPlayer = await selectedPlayer.save();

        res.status(200).json({ message: "Data Created Successfully", data: savedSelectedPlayer });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
};




export const updatedPlayerInTeam: RequestHandler = async (req, res) => {
    try {
        const { teamId, playerId } = req.params;

        // Check if the player exists
        const player = await PLAYER.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Check if the team exists
        const team = await TEAM.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if the player is already in the team
        const existingSelectedPlayer = await SELECTEDPLAYER.findOne({
            // team_id: team._id,
            player_id: playerId,
        });

        if (existingSelectedPlayer) {
            return res.status(400).json({ message: 'Player is already in the team' });
        }

        // Find the existing selected player entry to remove
        const existingPlayerToRemove = await SELECTEDPLAYER.findOne({
            team_id: team._id,
        });

        if (existingPlayerToRemove) {
            // Remove the existing player from the team
            await SELECTEDPLAYER.findByIdAndRemove(existingPlayerToRemove._id);
            // // Remove the selectedPlayer reference from the team's selectedPlayers array
            //     team.selectedPlayers = team.selectedPlayers.filter(
            //         (id) => id.toString() !== existingPlayerToRemove._id.toString()
            //     );
            // }

            // Create a new selectedPlayer entry
            const selectedPlayer = new SELECTEDPLAYER({
                team_id: team._id,
                player_id: player._id,
            });

            // Save the selectedPlayer entry
            const savedSelectedPlayer = await selectedPlayer.save();

            // Add the selectedPlayer reference to the team's selectedPlayers array
            // team.selectedPlayers.push(savedSelectedPlayer._id);
            // await team.save();

            res.status(200).json(savedSelectedPlayer);
        }
    } catch (error) {
        console.error('Error updating player in team:', error);
        res.status(500).json({ message: 'Error updating player in team' });
    }
}

export const deletedSelectedPlayer: RequestHandler = async (req, res) => {
    try {
        const { selectedPlayerId } = req.params;

        // Find and delete the selectedPlayer
        const deletedSelectedPlayer = await SELECTEDPLAYER.findByIdAndDelete(selectedPlayerId);

        if (!deletedSelectedPlayer) {
            return res.status(404).json({ message: 'Selected player not found' });
        }

        res.status(200).json({ message: 'Selected player removed from the team' });
    } catch (error) {
        console.error('Error removing player from team:', error);
        res.status(500).json({ message: 'Error removing player from team' });
    }
}





