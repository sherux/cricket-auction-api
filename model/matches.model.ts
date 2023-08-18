import mongoose, { Schema, Document } from 'mongoose';
import player from './player.model';
import Team from './team.model';

interface Match extends Document {
    team1: mongoose.Types.ObjectId | Team
    team2: mongoose.Types.ObjectId | Team
    winner: mongoose.Types.ObjectId | Team
    createdAt: Date;
}

const matchSchema = new Schema<Match>({
    team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    winner: { type: Schema.Types.ObjectId, ref: 'Team' },
    createdAt: { type: Date, default: Date.now },
});

const MatchModel = mongoose.model<Match>('Match', matchSchema);
export default MatchModel
