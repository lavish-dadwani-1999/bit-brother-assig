const mongoose = require('mongoose');
const {sign} = require("jsonwebtoken")
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, trim: true,unique:true },
    password: { type: String, trim: true },
    token:{type:String}
  },
  { timestamps: true }
);

UserSchema.statics.findUserByToken = async (token)=>{
  try{
    const user = await User.findOne({token:token})
    if(!user) throw new Error("invalid Credentials")
     await user.save()
     console.log(user)
     return user
  }catch(err){
    err.name = 'Ststic Error';
    console.log(err);
    throw err
  }
}


UserSchema.methods.genrateToken = async function () {
  try {
    const user = this;
    const SecretKey = `${user.username}-${new Date(user.createdAt).getTime()}`;
    const token1 = await sign({ id: user._id }, SecretKey, { expiresIn: '5d' });
    user.token = token1;
    await user.save();
    return token1;
  } catch (err) {
    console.log(err);
  }
}

const User = mongoose.model('user', UserSchema);

module.exports = User;
