import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  authorBio: { type: String, required: true },
  releaseDate: { type: Date, default: Date.now },
  category: { type: String, required: true },
  pdfUrl: { type: String}
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;