const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const TodoSchema = Schema({
  name: {
    type: String,
  },
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

TodoSchema.plugin(mongoosePaginate);

module.exports = model("Todo", TodoSchema);
