import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String, // 'inflow' or 'outflow'
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // null for global default categories
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
