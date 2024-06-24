import  connectMongo from "@/db/connectDb"
import User from "@/models/user";
import bcrypt from "bcryptjs"

connectMongo()

export async function POST(req){
    // Collecting user info from front end
const reqBody = await req.json() 
console.log(reqBody)
const {email,password,firstName,lastName, phoneNumber}=reqBody

const findUser = await User.findOne({email});
if (!!findUser){
    return Response.json(
        {
            error: "User Already Exists",
        },
        {status: 400}
    );
}

//hash password before saving user

const hashPassword = await bcrypt.hash(password,10)
const newUser = new User({
    email,
    firstName,
    lastName,
    password:hashPassword,
    phoneNumber,
});

const savedUser = await newUser.save();
console.log(savedUser);

return Response.json({
    data: savedUser,
    message:"User created Successfully"},{status:200})

}