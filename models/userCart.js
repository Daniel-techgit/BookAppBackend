import mongoose from 'mongoose';

const userCartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

const UserCart = mongoose.models.UserCart || mongoose.model('UserCart', userCartSchema);

export default UserCart;