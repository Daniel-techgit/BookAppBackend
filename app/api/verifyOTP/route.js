import connectMongo from "@/db/connectDb";
import User from "@/models/user";

connectMongo();


export async function POST(req) {
    const { email, otp } = await req.json();
    console.log("Request body:", req.body);
    console.log("Email type:", typeof email); // Add this line
    console.log("OTP type:", typeof otp); // Add this line

    try{
        // find the user with the OTP
        const user = await User.findOne({ email });
        if(!user){
            return Response.json(
                { error: "Invalid email or OTP."},{
                    status: 400,
                 }
            );
        }
        console.log("Stored OTP:", user.forgottenPasswordOTP);
// Check if the provided OTP matches the one stored in the database
if (otp !== user.forgottenPasswordOTP) {
    return Response.json({ error: "Incorrect code" }, { status: 401 });
  }


// Check if the OTP has expired
if (
    user.forgottenPasswordOTPExpires &&
    Date.now() > user.forgottenPasswordOTPExpires
  ) {
    return Response.json({ error: "OTP has expired" }, { status: 400 });
  }
 
     // Update the user's isVerified status
     user.isVerified = true;
     await user.save();
 
     return Response.json(
       { message: "You have been verified successfully" },
       { status: 200 }
     );
 
    
}catch(error){
    console.error("Error verifying OTP", error);
    return InternalServerError;
}
}