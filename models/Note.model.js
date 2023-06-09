const { mongoose, Schema, model } = require("mongoose");

const checklistSchema = new Schema({
  item: String,
  completed: {
    type: Boolean,
    default: false,
  },
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
    category: {
      type: String,
      enum: ["Personal Note", "Task", "Birthday", "Idea"],
      required: true,
    },
    checklist: [checklistSchema],
    image: {
      cloudinaryId: String,
      imageUrl: String,
    },
    backgroundColor: {
      type: String,
      enum: ["grey", "red", "green"],
      default: "grey",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
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

module.exports = model("Note", noteSchema);
