const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUser(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user and their thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and their thoughts have been deleted." }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};