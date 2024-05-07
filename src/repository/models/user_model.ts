import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  isRegistered: { type: Boolean },
  profileImage: [{ url: { type: String } }],
  favorites: [
    {
      album: {
        spotifyUrl: { type: String },
        name: { type: String },
        image: { type: String },
        id: { type: String },
      },
      song: {
        name: { type: String },
        isPlayable: { type: Boolean },
        previewUrl: { type: String },
        id: { type: String },
      },
    },
  ],
  tokens: {
    access_token: { type: String },
    token_type: { type: String },
    expires_in: { type: Number },
    expiration_date: { type: Number },
    refresh_token: { type: String },
    scope: { type: String },
  },
});

const userModel = mongoose.models.User || mongoose.model("Users", userSchema);

export default userModel;
