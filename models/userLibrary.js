import mongoose from 'mongoose';

const userLibrarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

const UserLibrary = mongoose.models.UserLibrary || mongoose.model('UserLibrary', userLibrarySchema);

export default UserLibrary;