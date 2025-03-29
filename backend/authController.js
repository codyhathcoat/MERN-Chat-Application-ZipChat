const User = require("./User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async(req, res) => {
    const {username, password} = req.body;

    try {
        //Try and find the user.
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        //Compare passwords.
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid password"});
        }

        //Create web token for 1 hour.
        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
}