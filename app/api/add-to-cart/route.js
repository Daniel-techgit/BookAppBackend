import connectMongo from "@/db/connectDb";
import UserCart from "@/models/userCart";
import UserLibrary from "@/models/userLibrary";
import jwt from "jsonwebtoken";

connectMongo();

export async function POST(req) {
  try {
    // Verify the user's authentication token
    const token = req.headers.get('authorization')?.split(" ")[1];
    console.log('Received token:', token);
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get the bookId from the request body
    const { bookId } = await req.json();

    // Check if the book is already in the user's library
    const userLibrary = await UserLibrary.findOne({ userId });
    if (userLibrary) {
      const bookExists = userLibrary.books.some((book) => book.bookId.toString() === bookId);
      if (bookExists) {
        return new Response(JSON.stringify({ error: 'Book already in library' }), { status: 400 });
      }
    }

    // Check if the user's Cart exists
    let userCart = await UserCart.findOne({ userId });

    if (!userCart) {
      // Create a new Cart for the user
      userCart = new UserCart({ userId, books: [{ bookId }] });
    } else {
      // Check if the book is already in the user's library
      const bookExists = userCart.books.some((book) => book.bookId.toString() === bookId);

      if (bookExists) {
        return new Response(JSON.stringify({ error: 'Book already in cart' }), { status: 400 });
      }

      // Add the book to the user's library
      userCart.books.push({ bookId });
    }

    // Save the updated library
    await userCart.save();

    return new Response(JSON.stringify({ message: 'Book added to Cart' }), { status: 200 });
  } catch (error) {
    console.error('Error adding book to cart:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}