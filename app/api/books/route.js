// pages/api/books/seed.js
import connectMongo from "@/db/connectDb";
import Book from '../../../models/books';

connectMongo();
const responseWithJson = (status, data, success = true) => {
    return new Response(JSON.stringify({ success, data }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  
  export async function GET() {
    try {
      const books = await Book.find({});
      return responseWithJson(200, [books]);
    } catch (error) {
      return responseWithJson(400, error.message, false);
    }
  }
  
  export async function POST(request) {
    try {
      const body = await request.json();
      const book = await Book.create(body);
      return responseWithJson(201, book);
    } catch (error) {
      return responseWithJson(400, error.message, false);
    }
  }
  
  export async function PATCH(request) {
    const {searchParams} = request.nextUrl
    const id = searchParams.get("id")
    console.log(id)

    try {   
      const body = await request.json();
      const updatedBook = await Book.findByIdAndUpdate(id, {...body}, {
        new: true,
      });
      console.log('Updated book:', updatedBook);
      return Response.json({message:"Book Updated Successfully"},{status:200})
    } catch (error) {
      return  Response.json({error:" Failed to  Updated Book"},{status:400})
    }
  }
  
  export async function DELETE(request) {
    try {
      const deletedBook = await Book.findByIdAndDelete(request.query.id);
      return responseWithJson(200, deletedBook);
    } catch (error) {
      return responseWithJson(400, error.message, false);
    }
  }