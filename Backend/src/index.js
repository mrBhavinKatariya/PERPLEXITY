
import dotenv from "dotenv";
import connectDB from './config/db/db.js';
import { app } from './app.js';

dotenv.config({
    path: './.env',
});


connectDB()
.then(() => {
    app.on("error", (err) => {
        console.log("Express Error", err);
        throw err;
    })

    app.listen(process.env.PORT || 8001, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        
    });
}).catch((err) => {
    console.log("MongoDB Connection Failed", err);
    
});