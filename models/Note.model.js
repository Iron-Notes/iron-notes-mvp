const { mongoose, Schema, model } = require("mongoose");

const checklistSchema = new Schema({
  item: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const tagSchema = new Schema({
  name: String
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
    tags: [tagSchema],
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
