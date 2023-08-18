import { RequestHandler } from "express";
import PLAYER from "../model/player.model";
import { playerSchemaForCreate, playerSchemaForUpdate, handleZodValidationError } from "../validation/player.validation";
import { ZodError } from "zod";

const attributes = [
    ["_id", "_id"],
    ["name", "name"],
    ["email", "email"],
    ["jersey_no", "jerseyNo"],
    ["gender", "gender"],
    ["age", "age"],
    ["createdAt", "createdAt"],
    ["updatedAt", "updatedAt"],
];

export const getPlayerList: RequestHandler = async (req, res) => {

    try {

        const playerData = await PLAYER.find()
        const formattedData = playerData.map((item: any) => {
            const formattedItem: any = {};
            attributes.forEach(attr => {
                formattedItem[attr[1]] = item[attr[0]];
            });
            return formattedItem;
        });


        res.status(200).json({ message: "data Fetch Succesfully", data: formattedData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}

export const getDetailsPlayer: RequestHandler = async (req, res) => {
    try {

        const playerId: any = req.params.id

        const playerData: any = await PLAYER.findById(playerId).select(attributes.map(attr => attr[0]).join(' ')).lean();

        const formattedData: any = {};
        attributes.forEach(attr => {
            formattedData[attr[1]] = playerData[attr[0]];
        });


        res.status(200).json({ message: "data Fetch Succesfully", data: formattedData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
export const addPlayer: RequestHandler = async (req, res) => {
    try {
        const {
            name,
            email,
            age,
            jerseyNo: jersey_no,
            gender
        } = req.body;

        const validatedData = playerSchemaForCreate.parse({
            name,
            email,
            gender,
            age,
            jersey_no
        });

        // const validate = playerSchema.safeParse(validatedData);
        // if (validate.success == false) {
        //     return handleZodValidationError(validate.error, res);
        // }
        const checkEmail = await PLAYER.findOne({ email: validatedData.email })
        if (checkEmail) return res.status(500).json({ message: "Email already exist" });

        const checkJerseyNo = await PLAYER.findOne({ jersey_no: validatedData.jersey_no })
        if (checkJerseyNo) return res.status(500).json({ message: "jerseyNo already exist" });


        const playerData = new PLAYER({
            name: validatedData.name,
            email: validatedData.email,
            age: validatedData.age,
            gender: validatedData.gender,
            jersey_no: validatedData.jersey_no

        })
        const playerDataSave = await playerData.save()

        res.status(200).json({ message: "Player Created Succesfully", data: playerDataSave });

    } catch (err: any) {
        if (err instanceof ZodError) {
            return handleZodValidationError(err, res);
        } else {
            console.error('Other error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}




export const updatedPlayer: RequestHandler = async (req, res) => {
    try {
        const {

            jerseyNo: jersey_no,

        } = req.body;

        const validatedData = playerSchemaForUpdate.parse({

            jersey_no
        });
        const playerId: any = req.params.id
        const playerData = {
            jersey_no: validatedData.jersey_no
        }
        const playerDataSave = await PLAYER.findByIdAndUpdate(playerId, playerData)

        res.status(200).json({ message: "Player Updated Succesfully", data: playerDataSave });

    } catch (err: any) {
        if (err instanceof ZodError) {
            return handleZodValidationError(err, res);
        } else {
            console.error('Other error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const deletedPlayer: RequestHandler = async (req, res) => {
    try {

        const playerId: any = req.params.id

        const playerData = await PLAYER.findByIdAndDelete(playerId)

        res.status(200).json({ message: "Player Deleted Succesfully" });

    } catch (err: any) {
        res.status(500).json({ message: err });

    }
}