import connectMongo from "@/db/connectDb"
import User from "@/models/user";

connectMongo()

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get("userId");

  try {
    const user = await User.findById(userId);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Extract the required user information
    const { email, firstName, lastName, phoneNumber } = user;

    return Response.json({
      data: {
        _id: user._id.toString(),
        email,
        firstName,
        lastName,
        phoneNumber
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json({ error: "Error fetching user profile" }, { status: 500 });
  }
}