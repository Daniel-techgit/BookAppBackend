export const dynamic = 'force-dynamic'
import connectMongo from "@/db/connectDb";
import UserCart from "@/models/userCart";
import jwt from "jsonwebtoken";

connectMongo();

export async function GET(req) {
  try {
    // Verify the user's authentication token
    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the user's library
    const userCart = await UserCart.findOne({ userId }).populate('books.bookId');

    if (!userCart) {
      return new Response(JSON.stringify({ error: 'User Cart not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(userCart), { status: 200 });
  } catch (error) {
    console.error('Error fetching user cart:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}