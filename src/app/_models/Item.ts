import { models, model, Schema } from "mongoose";

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  completionDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: String,

  }
},
  { timestamps: true }
);

export default models.Item || model("Item", itemSchema);

