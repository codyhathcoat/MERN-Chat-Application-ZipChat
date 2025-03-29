//Connect to MongoDB using Mongoose
const mongoose = require("mongoose");

const connectDB = async(customUri = null) => {
    const dbURI = customUri || process.env.MONGO_URI;
    if(!dbURI){
        console.error("MongoDB URI is not set.");
        throw new Error("Database connection failed");
    }
    try{
        if(mongoose.connection.readyState !== 0){
            await mongoose.disconnect();
        }

        await mongoose.connect(dbURI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        })

        console.log("MongoDB Connected");
    } catch(err) {
        console.error("MongoDB not connected.", err);
        //process.exit(1)
        throw new Error("Database connection failed");
    }
};

const closeDB = async () => {
    try{
        if(mongoose.connection.readyState === 0){
            console.warn("No active connection to close");
            return;
        }

        await mongoose.connection.close();
        console.log("MongoDB Connection Close");
    } catch(err){
        console.error("Error closing MongoDB connection:",  err);
        throw err;
    }
};

module.exports = {connectDB, closeDB};