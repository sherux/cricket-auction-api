import { RequestHandler } from "express";
import PLAYER from "../model/player.model";
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
        attributes

        res.status(200).json({ message: "data Fetch Succesfully", data: playerData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}

export const getDetailsPlayer: RequestHandler = async (req, res) => {
    try {

        const playerId: any = req.params.id

        const playerData = await PLAYER.findById(playerId)


        res.status(200).json({ message: "data Fetch Succesfully", data: playerData });

    } catch (err: any) {
        res.status(500).json({ message: err });
    }
}
export const addPlayer: RequestHandler = async (req, res) => {
    try {

        const email = await PLAYER.findOne({ email: req.body.email })
        if (email) return res.status(500).json({ message: "Email already exist" });

        const jerseyNo = await PLAYER.findOne({ jersey_no: req.body.jerseyNo })
        if (jerseyNo) return res.status(500).json({ message: "jerseyNo already exist" });


        const playerData = new PLAYER({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            gender: req.body.gender,
            jersey_no: req.body.jerseyNo

        })
        const playerDataSave = await playerData.save()

        res.status(200).json({ message: "Player Created Succesfully", data: playerDataSave });

    } catch (err: any) {
        res.status(500).json({ message: err });


    }

}


export const updatedPlayer: RequestHandler = async (req, res) => {
    try {

        const playerId: any = req.params.id
        const playerData = {
            jersey_no: req.body.jerseyNo
        }
        const playerDataSave = await PLAYER.findByIdAndUpdate(playerId, playerData)

        res.status(200).json({ message: "Player Updated Succesfully", data: playerDataSave });

    } catch (err: any) {
        res.status(500).json({ message: err });
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