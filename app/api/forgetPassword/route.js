import connectMongo from "@/db/connectDb";
import User from "@/models/user";
import crypto from "crypto";
import nodemailer from "nodemailer";



connectMongo();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "adefisoyed@gmail.com",
        pass: "dbsf snbl ggam sjwe",
    },
});

export async function POST(req){
    const { email } = await req.json();
    console.log("Request body:", req.body);

    try {
        //find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return Response.json(
                {error: "No account with that email address exists."},
                {status: 404 }
            );
        }
        //generate a 4 digit OTP
        const otp = ('0000' + crypto.randomInt(1000, 9999).toString()).slice(-4);
        //Send the OTP via email
        const mailOptions ={
            from: "Peace House Book App",
            to: user.email,
            subject: "Your One Time Password (OTP)",
            text: `Your one time password is ${otp}`,
        };

        try {
            // Send the email with the OTP
            await transporter.sendMail(mailOptions);
      
            // Store the OTP and OTP expiration time in the user document
            const otpExpiresIn = 10 * 60 * 1000; // 10 minutes in milliseconds
            const forgottenPasswordOTPExpires = Date.now() + otpExpiresIn;

            console.log("OTP:", otp);
            console.log("OTP Expiration Time:", forgottenPasswordOTPExpires);
            
            const updateResult= await User.findByIdAndUpdate(user._id, {
              forgottenPasswordOTP: otp,
              forgottenPasswordOTPExpires: forgottenPasswordOTPExpires,
            });

            console.log("Update Result:", updateResult);

            if (!updateResult) {
                console.error("Failed to update user document with OTP");
                return Response.json({ error: "Internal server error" }, { status: 500 });
              }
      
            return Response.json({ message: "OTP sent to your email address" }, { status: 200 });
          } catch (error) {
            console.log("Error in sending OTP:", error);
            return Response.json({ error: "Internal server error" }, { status: 500 });
          }


    } catch (error){
        console.log("Error in sending OTP:", error);
        return Response.json({error: "Internal server error"}, { status: 500});
    }
}