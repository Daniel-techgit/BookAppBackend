import connectMongo from "@/db/connectDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectMongo();

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT or session token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    });
    console.log(token)
    return Response.json({message: "login successful", data:{
      token, 
      userId: user._id.toString() 
    }
  },  { status: 200 });
  } catch (error) {
    console.error("Error logging in:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}