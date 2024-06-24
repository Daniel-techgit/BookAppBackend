import connectMongo from "@/db/connectDb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

connectMongo();

export async function POST(req) {
    const { email, newPassword } = await req.json();

    try{
        // find the user by email

        const user = await User.findOne({email});

        if(!user) {
            return Response.json(
                { error: "Invalid email."},
            {status: 400}
        );
        }
        // hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

       
        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return Response.json({message: "Password reset successful"}, {status: 200});

    } catch(error){
        console.error("Error resetting password:", error);
        return Response.json({error: "internal server error"}, {status:500})

    }
}