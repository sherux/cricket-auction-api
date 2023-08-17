import { RequestHandler } from "express";
import TEAM from "../model/team.model";
import PLAYER from "../model/player.model";



export const getTeamList: RequestHandler = async (req, res) => {
    try {


        const teamData = await TEAM.find()

        res.status(200).json({ message: "data Fetch Succesfully", data: teamData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}

export const getDetailsTeam: RequestHandler = async (req, res) => {
    try {

        const teamId: any = req.params.id

        const teamData = await TEAM.findById(teamId)


        res.status(200).json({ message: "data Fetch Succesfully", data: teamData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
export const addTeam: RequestHandler = async (req, res) => {
    try {

        const teamName = await TEAM.findOne({ team_name: req.body.teamName })
        if (teamName) return res.status(500).json({ message: "teamName already exist" });


        const teamData = new TEAM({
            team_name: req.body.teamName,
            team_jersey_color: req.body.teamJerseyColor,

        })
        const teamDataSave = await teamData.save()

        res.status(200).json({ message: "Team Created Succesfully", data: teamDataSave });

    } catch (err: any) {
        res.status(500).json({ message: err });


    }

}


export const updatedTeam: RequestHandler = async (req, res) => {
    try {

        const teamId: any = req.params.id
        const teamData = {
            team_name: req.body.teamName,
            team_jersey_color: req.body.teamJerseyColor,
        }
        const teamDataSave = await TEAM.findByIdAndUpdate(teamId, teamData)

        res.status(200).json({ message: "Team Updated Succesfully", data: teamDataSave });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}

export const deletedTeam: RequestHandler = async (req, res) => {
    try {

        const teamId: any = req.params.id
        const teamData = await TEAM.findByIdAndDelete(teamId)

        res.status(200).json({ message: "Team Deleted Succesfully", data: teamData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}



