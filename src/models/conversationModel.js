import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Conversations name is required."],
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "UserModel",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "MessageModel",
    },
    admin: {
      type: ObjectId,
      ref: "UserModel",
    },

    // // CAMPOS ADICIONADOS ABAIXO para bater com os services/controllers
    // sender: {
    //   type: ObjectId,
    //   ref: "UserModel",
    // },
    // receiver: {
    //   type: ObjectId,
    //   ref: "UserModel",
    // },
    // order: {
    //   type: ObjectId,
    //   ref: "OrderModel", // Ajusta conforme o nome real do seu model de pedidos
    // },
    // status: {
    //   type: String,
    //   enum: ["pending", "accepted", "rejected"],
    //   default: "pending",
    // },
  },
  {
    collection: "conversations",
    timestamps: true,
  }
);

const ConversationModel =
  mongoose.models.ConversationModel ||
  mongoose.model("ConversationModel", conversationSchema);

export default ConversationModel;
