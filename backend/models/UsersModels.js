// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'user'], // Backend stores as admin or user
//         default: 'user'
//     }
// }, {
//     timestamps: true
// });

// // Password hash karna before saving
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
    
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// // Password compare karna for login
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// export default mongoose.model('User', userSchema);