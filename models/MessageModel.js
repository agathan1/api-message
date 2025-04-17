import manggoose from "mongoose";

const messageSchema = new manggoose.Schema(
  {
    send_to: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    created_by: {
      type: manggoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = manggoose.model("Message", messageSchema);

export default Message;
