const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//-------------------------------------------route middleware---------------------------

app.use(express.json());

import playerRoutes from "./routes/player.routes";
import teamRoutes from "./routes/team.routes";
import selectedPlayerRoutes from "./routes/selectedPlayer.routes";
import matchesRoutes from "./routes/match.routes";



app.use("/player", playerRoutes)
app.use("/team", teamRoutes)
app.use("/selectedplayer", selectedPlayerRoutes)
app.use("/match", matchesRoutes)







// -----------------------------------connect to the database----------------------

mongoose
    .connect(`${process.env.MongoUrl}`)
    .then(() => {
        console.log("database is connected");
    })
    .catch((err: any) => {
        console.log(err.message);
    });

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}....`);
});
