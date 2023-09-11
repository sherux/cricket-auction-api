// User.ts

import mongoose, { Document, Schema } from 'mongoose';

// type: Schema.Types.ObjectId,

// Define the interface for the User document
interface Team extends Document {
    team_name: string;
    points: number;
    total_match: number
    won: number
    lost: number
    draw: number
    // player_id: mongoose.Types.ObjectId | Player

}

// Define the schema for the User model
const teamSchema = new Schema<Team>({
    team_name: { type: String, required: true },
    points: { type: Number, default: 0 },
    total_match: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    draw: { type: Number, default: 0 },



    // player_id: { type: Schema.Types.ObjectId, ref: 'Player', required: true }



}, {
    timestamps: true, // Add createdAt and updatedAt fields
});

// Create and export the User model
const Team = mongoose.model<Team>('Team', teamSchema);

export default Team;
