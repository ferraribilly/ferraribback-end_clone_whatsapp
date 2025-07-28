import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const ordersSchema = mongoose.Schema(
  {
    sender: {
      type: ObjectId,
      ref: "UserModel",
    },
    messageAutomatica: {
     enum: ["text", "image"],
  },
  messageAutomatica: String,
  imageUrl: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
    conversation: {
      type: ObjectId,
      ref: "ConversationModel",
    },
    
    
    files: [],
  },

 
  {
    collection: "Orders",
    timestamps: true,
  }
);

const OrdersModel =
  mongoose.models.OrdersModel || mongoose.model("OrdersModel", ordersSchema);

export default OrdersModel;

