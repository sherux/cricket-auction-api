import { RequestHandler } from "express";
import TEAM from "../model/team.model";
import PLAYER from "../model/player.model";
import { teamSchemaForCreate, teamSchemaForUpdate, handleZodValidationError } from "../validation/team.validation";
import { ZodError } from "zod";



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
        const {
            teamName: team_name

        } = req.body;

        const validatedData = teamSchemaForCreate.parse({

            team_name
        });

        const checkTeamName = await TEAM.findOne({ team_name: validatedData.team_name })
        if (checkTeamName) return res.status(500).json({ message: "teamName already exist" });


        const teamData = new TEAM({
            team_name: validatedData.team_name,

        })
        const teamDataSave = await teamData.save()

        res.status(200).json({ message: "Team Created Succesfully", data: teamDataSave });

    } catch (err: any) {
        if (err instanceof ZodError) {
            return handleZodValidationError(err, res);
        } else {
            console.error('Other error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}




export const updatedTeam: RequestHandler = async (req, res) => {
    try {
        const {
            teamName: team_name
        } = req.body;

        const validatedData = teamSchemaForCreate.parse({

            team_name
        });

        const teamId: any = req.params.id
        const teamData = {
            team_name: validatedData.team_name,
        }
        const teamDataSave = await TEAM.findByIdAndUpdate(teamId, teamData)

        res.status(200).json({ message: "Team Updated Succesfully", data: teamDataSave });

    } catch (err: any) {
        if (err instanceof ZodError) {
            return handleZodValidationError(err, res);
        } else {
            console.error('Other error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
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



