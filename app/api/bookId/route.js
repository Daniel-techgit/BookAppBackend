import Book from '../../../models/books';
import connectMongo from "@/db/connectDb";
import { NextResponse } from 'next/server';

connectMongo();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('_id');

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    } else {
      return NextResponse.json([book]);
    }
  } catch (err) {
    console.error("Error fetching book:", error);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}