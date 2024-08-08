import connectMongo from "@/db/connectDb";
import UserCart from "@/models/userCart";
import jwt from "jsonwebtoken";

connectMongo();

export async function DELETE(req) {
  try {
    // Verify the user's authentication token
    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get the bookId from the request body
    const { bookId } = await req.json();

    // Find the user's cart
    let userCart = await UserCart.findOne({ userId });

    if (!userCart) {
      return new Response(JSON.stringify({ error: 'Cart not found' }), { status: 404 });
    }

    // Remove the book from the cart
    userCart.books = userCart.books.filter((book) => book.bookId.toString() !== bookId);

    // Save the updated cart
    await userCart.save();

    return new Response(JSON.stringify({ message: 'Book removed from cart' }), { status: 200 });
  } catch (error) {
    console.error('Error removing book from cart:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}