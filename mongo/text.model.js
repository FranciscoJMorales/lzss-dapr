import mongoose from 'mongoose';

const TextSchema = mongoose.Schema(
    {
        original: String,
        compressed: String
    },
    {
        timestamps: true
    }
);

const Text = mongoose.model("text", TextSchema);

export { Text };
