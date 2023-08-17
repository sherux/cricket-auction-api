// User.ts

import mongoose, { Document, Schema } from 'mongoose';

// type: Schema.Types.ObjectId,

// Define the interface for the User document
interface Team extends Document {
    team_name: string;
    team_jersey_color: string
    // player_id: mongoose.Types.ObjectId | Player

}

// Define the schema for the User model
const teamSchema = new Schema<Team>({
    team_name: { type: String, required: true },
    team_jersey_color: { type: String, required: true },
    // player_id: { type: Schema.Types.ObjectId, ref: 'Player', required: true }



}, {
    timestamps: true, // Add createdAt and updatedAt fields
});

// Create and export the User model
const Team = mongoose.model<Team>('Team', teamSchema);

export default Team;
