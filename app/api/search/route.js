import connectMongo from "@/db/connectDb";
import Book from '../../../models/books';
import { NextResponse } from 'next/server';

connectMongo();

export async function GET(req) {
  try {
    const query = req.nextUrl.searchParams.get('query');
    console.log('Search query:', query);

    if (!query) {
      return NextResponse.json({ message: "No search query provided" }, { status: 400 });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });

    return NextResponse.json([books], { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}