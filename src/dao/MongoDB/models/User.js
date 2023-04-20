import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import {Schema, model} from "mongoose";

const url = process.env.URLMONGODB

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// const userModel = model('Users', userSchema);
// export default userModel
class ManagerUserMongoDB extends ManagerMongoDB {
  constructor() {
      super(url, "users", userSchema)
  }
}

export default ManagerUserMongoDB