const { mongoose, Schema, model } = require("mongoose");

const checklistSchema = new Schema({
  item: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const labelSchema = new Schema({
  name: String,
});

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    checklist: [checklistSchema],
    label: [labelSchema],
    imageURL: String,
    backgroundColor: {
      type: String,
      enum: ["grey", "red", "green"],
      default: "grey",
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Checklist", checklistSchema);
module.exports = model("Label", labelSchema);
module.exports = model("Note", noteSchema);
