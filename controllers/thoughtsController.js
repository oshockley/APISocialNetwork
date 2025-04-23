const { User, Thought } = require('../models');

module.exports = {
  // GET all thoughts
  getThought(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // GET a single thought by ID
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'Did not find thought within the ID...' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // POST a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Did not find User within the ID...' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // PUT to update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'Did not find thought within the ID...' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // DELETE a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'Did not find thought within the ID...' })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought deleted, but no user found.' })
          : res.json({ message: 'Thought successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // CREATE a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found within ID...' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // DELETE a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found within ID...' })
          : res.json({ message: 'Reaction successfully deleted!', thought })
      )
      .catch((err) => res.status(500).json(err));
  },
};
