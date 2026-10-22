const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },

    lName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    phone:{
        type:String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function(){
        return this.provider=="system" ? true : false
      },
      trim: true,
    },

    age: {
      type: Number,
      required: function(){
        return this.provider=="system" ? true : false
      },
      min: 20,
      max: 60,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImage: String,
    coverImage: [String],
    provider: {
      type: String,
      enum: ["system", "google"],
      default: "system",
    },
    changecredital:Date,
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports={User}
