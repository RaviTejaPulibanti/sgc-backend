const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to your database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/club_management';

// Define Admin Schema (minimal version for the script)
const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean
});

const Admin = mongoose.model('Admin', adminSchema);

async function resetAllPasswords() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find all admins
    const admins = await Admin.find({});
    console.log(`📊 Found ${admins.length} admins`);
    
    for (const admin of admins) {
      // Determine new password based on email or role
      let newPassword;
      if (admin.email === 'admin1@gmai.com') {
        newPassword = 'Admin@123';
      } else if (admin.email === 'rakesh@gmail.com') {
        newPassword = 'rakesh123';
      } else if (admin.email === 'sam@gmail.com') {
        newPassword = 'sam123';
      } else {
        // Default password for other admins
        newPassword = 'Default@123';
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update the admin password
      admin.password = hashedPassword;
      await admin.save();
      
      console.log(`✅ Reset password for: ${admin.email} (${admin.role})`);
      console.log(`   New password: ${newPassword}`);
      console.log(`   New hash: ${hashedPassword.substring(0, 30)}...`);
      
      // Verify the new password works
      const verifyMatch = await bcrypt.compare(newPassword, hashedPassword);
      console.log(`   Verification: ${verifyMatch ? '✅' : '❌'}`);
    }
    
    console.log('\n🎉 All passwords reset successfully!');
    console.log('\n📝 Login credentials:');
    console.log('----------------------------------------');
    console.log('Super Admin: admin1@gmai.com / Admin@123');
    console.log('Club Admin (rakesh): rakesh@gmail.com / rakesh123');
    console.log('Club Admin (sam): sam@gmail.com / sam123');
    console.log('----------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAllPasswords();