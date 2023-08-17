// User.ts

import mongoose, { Document, Schema } from 'mongoose';
import player from './player.model';
import Team from './team.model';


// type: Schema.Types.ObjectId,

// Define the interface for the User document
interface selectedPlayer extends Document {
    team_id: mongoose.Types.ObjectId | Team
    player_id: mongoose.Types.ObjectId | player

}

// Define the schema for the User model
const selectedPlayerSchema = new Schema<selectedPlayer>({
    team_id: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    player_id: { type: Schema.Types.ObjectId, ref: 'player', required: true }



}, {
    timestamps: true, // Add createdAt and updatedAt fields
});

// Create and export the User model
const selectedPlayer = mongoose.model<selectedPlayer>('selectedPlayer', selectedPlayerSchema);

export default selectedPlayer;
