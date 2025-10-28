import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Creates a TTL (Time-To-Live) Index. Document will be removed automatically after <REFRESH_TOKEN_TTL> seconds.
refreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.index({ userId: 1 });

const RefreshToken = model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
