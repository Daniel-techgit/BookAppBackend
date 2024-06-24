// pages/api/books/new release.js
import Book from '../../../models/books';
import connectMongo from "@/db/connectDb";
import { NextResponse } from 'next/server';

connectMongo();

export async function GET(req) {
  try {
    const latestBook = await Book.findOne().sort({ releaseDate: -1 });
    return NextResponse.json([latestBook]);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}