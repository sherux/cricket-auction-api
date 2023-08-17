// User.ts

import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the User document
interface Player extends Document {
    name: string;
    email: string;
    age: number;
    jersey_no: Number
    gender: 'male' | 'female';
}

// Define the schema for the User model
const playerSchema = new Schema<Player>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    jersey_no: { type: Number, required: true },

    gender: { type: String, enum: ['male', 'female'], required: true },


}, {
    timestamps: true, // Add createdAt and updatedAt fields
});

// Create and export the User model
const Player = mongoose.model<Player>('player', playerSchema);

export default Player;
