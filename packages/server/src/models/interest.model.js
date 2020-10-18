const { Schema, model } = require("mongoose");

const InterestSchema = Schema({
  name: {
    type: String,
    trim: true,
    unique: "An interest with that name already exists",
    required: "Name of interest is required",
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

InterestSchema.virtual("appendedUser").set(function (newUser) {
  this.users = [...this.users, newUser];
});

InterestSchema.virtual("removedUser").set(function (removedUser) {
  this.users = this.users.filter(userId => {
    return userId.toString() !== removedUser.toString();
  });
});

module.exports = model("Interest", InterestSchema);
