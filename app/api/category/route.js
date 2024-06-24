// pages/api/books/category.js
import Book from '../../../models/books';
import connectMongo from "@/db/connectDb";
import { NextResponse } from 'next/server';

connectMongo();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('query');


  try {
    if(category){
        const books = await Book.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
        return NextResponse.json([books]);
    } else {
        const books = await Book.find();
        return NextResponse.json([books]);
      }

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}