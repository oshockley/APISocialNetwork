const { User, Thought } = require("../models");

module.exports = {
    //get all users
    getUser(req, res) {
        User.find({})
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    //Get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("thoughts")
        .select("-__v")
        .then((user) =>
            !user
              ? res 
    }
}