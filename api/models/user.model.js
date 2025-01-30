const mongoose = require("mongoose");
const dayjs = require("../config/days");
const bcrypt = require("bcryptjs");

const SALT_WORK_FACTOR = 10;

const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const PASSWORD_PATTERN = /^.{8,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      maxLength: [30, "User name characters must be lower than 30"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "User email is required"],
      match: [EMAIL_PATTERN, "Invalid user email pattern"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      match: [PASSWORD_PATTERN, "Invalid user password pattern"],
    },
    avatar: {
      type: String,
      default: function () {
        return `https://i.pravatar.cc/350?u=${this.email}`;
      },
      validate: {
        validator: function (avatar) {
          try {
            new URL(avatar);
            return true;
          } catch (e) {
            return false;
          }
        },
        message: function () {
          return "Invalid avatar URL";
        },
      },
    },
    birthday: {
      type: Date,
      required: [true, "User birthdate is required"],
      validate: {
        validator: function (birthday) {
          return dayjs().diff(dayjs(birthday), "year", true) >= 18;
        },
      },
      message: "User must be at least 18 years old",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
        ret.id = doc.id;
        return ret;
      },
    },
  }
);

// Before saving user
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    // Generate hash
    bcrypt
      .hash(this.password, SALT_WORK_FACTOR)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
