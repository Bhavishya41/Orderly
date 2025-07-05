require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const updateUserVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find user by email
    const user = await User.findOne({ email: 'bhavishyajain707@gmail.com' });
    
    if (user) {
      user.emailVerified = true;
      await user.save();
      console.log('✅ User email marked as verified:', user.email);
    } else {
      console.log('❌ User not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

updateUserVerification(); 