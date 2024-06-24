import connectMongo from "@/db/connectDb";
import UserLibrary from "@/models/userLibrary";
import jwt from "jsonwebtoken";

connectMongo();

export async function GET(req) {
  try {
    // Verify the user's authentication token
    const token = req.headers.get('authorization')?.split(" ")[1];
    console.log('token:', token)
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const userId = decoded.userId;

    // Find the user's library
    const userLibrary = await UserLibrary.findOne({ userId }).populate('books.bookId');

    if (!userLibrary) {
      return new Response(JSON.stringify({ error: 'User library not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(userLibrary), { status: 200 });
  } catch (error) {
    console.error('Error fetching user library:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}