const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, "Enter a valid email address"],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: {
            virtuals: true, 
        },
        id: false,
    }
);



userSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});
//User model created with the UserSchema
const User = model('User', userSchema);
// User Model export
module.exports = User;