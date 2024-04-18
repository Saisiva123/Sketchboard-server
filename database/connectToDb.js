const mongoose = require('mongoose');

const connectToDb = () => {
    const mongodbUrl = process.env.MONGO_CONNECTION_URL;

    mongoose.connect(mongodbUrl)
        .then(msg => console.log("connection successfull"))
        .catch(err => console.log("something went wrong while connecting database"))

}

module.exports = { connectToDb }