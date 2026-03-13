// src/scripts/seedClubsWithAdmins.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Club } from '../models/Club';
import { Admin } from '../models/Admin';

dotenv.config();

const clubsData = [
  // SGC Club (Main Council)
  {
    name: "Students' Gymkhana Center",
    shortName: "SGC",
    category: "sgc",
    displayOrder: 0,
    email: "sgc@sgc.edu.in",
    adminName: "SGC General Secretary",
    password: "sgc@2026",
    description: "The apex student body governing all clubs and activities",
    isSGC: true
  },
  // Other Clubs
  {
    name: "Competitive Club",
    shortName: "Competitive",
    category: "technical",
    displayOrder: 1,
    email: "competitive@sgc.edu.in",
    adminName: "Competitive Club Admin",
    password: "comp@2026",
    description: "Master competitive programming and coding challenges"
  },
  {
    name: "Coding Club",
    shortName: "Coding",
    category: "technical",
    displayOrder: 2,
    email: "coding@sgc.edu.in",
    adminName: "Coding Club Admin",
    password: "coding@2026",
    description: "Learn and master various programming languages"
  },
  {
    name: "Electronics Club",
    shortName: "Electronics",
    category: "technical",
    displayOrder: 3,
    email: "electronics@sgc.edu.in",
    adminName: "Electronics Club Admin",
    password: "electronics@2026",
    description: "Explore the world of electronics and hardware"
  },
  {
    name: "Arts & Crafts Club",
    shortName: "Arts & Crafts",
    category: "cultural",
    displayOrder: 4,
    email: "arts@sgc.edu.in",
    adminName: "Arts Club Admin",
    password: "arts@2026",
    description: "Express creativity through various art forms"
  },
  {
    name: "Cultural & Choreography Club",
    shortName: "Cultural",
    category: "cultural",
    displayOrder: 5,
    email: "cultural@sgc.edu.in",
    adminName: "Cultural Club Admin",
    password: "cultural@2026",
    description: "Celebrate culture through dance and music"
  },
  {
    name: "Studio Club",
    shortName: "Studio",
    category: "cultural",
    displayOrder: 6,
    email: "studio@sgc.edu.in",
    adminName: "Studio Club Admin",
    password: "studio@2026",
    description: "Photography, videography, and media production"
  },
  {
    name: "Internship & Career Opportunities Club",
    shortName: "Internship",
    category: "academic",
    displayOrder: 7,
    email: "internship@sgc.edu.in",
    adminName: "Internship Club Admin",
    password: "intern@2026",
    description: "Connect students with internship and career opportunities"
  },
  {
    name: "Startup Club",
    shortName: "Startup",
    category: "other",
    displayOrder: 8,
    email: "startup@sgc.edu.in",
    adminName: "Startup Club Admin",
    password: "startup@2026",
    description: "Foster entrepreneurship and innovation"
  },
  {
    name: "Higher Education Club",
    shortName: "Higher Ed",
    category: "academic",
    displayOrder: 9,
    email: "higheredu@sgc.edu.in",
    adminName: "Higher Education Admin",
    password: "highered@2026",
    description: "Guidance for higher studies and competitive exams"
  },
  {
    name: "Sports and Games Club",
    shortName: "Sports",
    category: "sports",
    displayOrder: 10,
    email: "sports@sgc.edu.in",
    adminName: "Sports Club Admin",
    password: "sports@2026",
    description: "Promote sports and physical fitness"
  },
  {
    name: "Eco Club",
    shortName: "Eco",
    category: "other",
    displayOrder: 11,
    email: "eco@sgc.edu.in",
    adminName: "Eco Club Admin",
    password: "eco@2026",
    description: "Environmental awareness and sustainability"
  },
  {
    name: "Lecture Series Club",
    shortName: "Lectures",
    category: "academic",
    displayOrder: 12,
    email: "lectures@sgc.edu.in",
    adminName: "Lecture Series Admin",
    password: "lecture@2026",
    description: "Organize guest lectures and seminars"
  },
  {
    name: "Linguistic & Personality Development Club",
    shortName: "Linguistic",
    category: "academic",
    displayOrder: 13,
    email: "linguistic@sgc.edu.in",
    adminName: "Linguistic Club Admin",
    password: "linguistic@2026",
    description: "Enhance communication and soft skills"
  },
  {
    name: "Research Club",
    shortName: "Research",
    category: "academic",
    displayOrder: 14,
    email: "research@sgc.edu.in",
    adminName: "Research Club Admin",
    password: "research@2026",
    description: "Promote research and innovation"
  },
  {
    name: "Finance Club",
    shortName: "Finance",
    category: "academic",
    displayOrder: 15,
    email: "finance@sgc.edu.in",
    adminName: "Finance Club Admin",
    password: "finance@2026",
    description: "Learn about finance and investment"
  },
  {
    name: "Robotics Club",
    shortName: "Robotics",
    category: "technical",
    displayOrder: 16,
    email: "robotics@sgc.edu.in",
    adminName: "Robotics Club Admin",
    password: "robotics@2026",
    description: "Build and program robots"
  },
  {
    name: "Yoga Club",
    shortName: "Yoga",
    category: "sports",
    displayOrder: 17,
    email: "yoga@sgc.edu.in",
    adminName: "Yoga Club Admin",
    password: "yoga@2026",
    description: "Promote physical and mental wellness"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Club.deleteMany({});
    await Admin.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create Super Admins
    const webopsAdmin = await User.create({
      name: 'Webops Team',
      email: 'webopsmanager@sgcrguktsklm.org.in',
      password: 'webops@2026',
      role: 'super_admin',
      username: 'webops'
    });

    const president = await User.create({
      name: 'Student President',
      email: 'president@sgcrguktsklm.org.in',
      password: 'president@2026',
      role: 'president',
      username: 'president'
    });

    console.log('👑 Created Super Admins:');
    console.log(`   - Webops: webops@sgc.edu.in / webops@2026`);
    console.log(`   - President: president@sgc.edu.in / president@2026`);

    // Create SGC Council Members
    const vicePresident = await User.create({
      name: 'Vice President',
      email: 'vp@sgcrguktsklm.org.in  ',
      password: 'vp@2026',
      role: 'vice_president',
      sgcPosition: 'Vice President'
    });

    const generalSecretary = await User.create({
      name: 'General Secretary',
      email: 'gs@sgc.edu.in',
      password: 'gs@2026',
      role: 'general_secretary',
      sgcPosition: 'General Secretary'
    });

    const treasurer = await User.create({
      name: 'Treasurer',
      email: 'treasurer@sgc.edu.in',
      password: 'treasurer@2026',
      role: 'treasurer',
      sgcPosition: 'Treasurer'
    });

    console.log('👥 Created SGC Council Members');

    // Create clubs and their admins
    let sgcClubId = null;

    for (const clubData of clubsData) {
      // Create club admin
      const clubAdmin = await User.create({
        name: clubData.adminName,
        email: clubData.email,
        password: clubData.password,
        role: clubData.isSGC ? 'sgc_member' : 'club_admin',
        ...(clubData.isSGC && { sgcPosition: clubData.adminName })
      });

      console.log(`   ✅ Created admin for ${clubData.name}: ${clubData.email} / ${clubData.password}`);

      // Create club
      const club = await Club.create({
        name: clubData.name,
        shortName: clubData.shortName,
        description: clubData.description,
        about: [
          `Welcome to ${clubData.name}`,
          ...(clubData.isSGC 
            ? [`The central student body governing all clubs and activities at RGUKT Srikakulam`]
            : [`Join us for exciting activities and events`]
          ),
          `Develop your skills and network with like-minded peers`
        ],
        founded: clubData.isSGC ? 2022 : 2022,
        heroImage: clubData.isSGC 
          ? `/clubimgs/sgc.webp` 
          : `/clubimgs/${clubData.shortName.toLowerCase().replace(/\s+/g, '')}.webp`,
        backgroundImage: clubData.isSGC
          ? `/clubBgimgs/sgcBg.webp`
          : `/clubBgimgs/${clubData.shortName.toLowerCase().replace(/\s+/g, '')}Bg.webp`,
        clubAdmin: clubAdmin._id,
        coAdmins: [],
        members: [],
        events: [],
        contactEmail: clubData.email,
        category: clubData.category,
        displayOrder: clubData.displayOrder,
        meetingSchedule: clubData.isSGC ? "Every Monday, 5:00 PM" : "Every Friday, 4:00 PM",
        meetingVenue: clubData.isSGC ? "SGC Council Room" : "Club Room",
        isSGC: clubData.isSGC || false
      });

      if (clubData.isSGC) {
        sgcClubId = club._id;
        
        // Update SGC club with council members
        club.sgcCouncil = {
          president: president._id,
          vicePresident: vicePresident._id,
          generalSecretary: generalSecretary._id,
          treasurer: treasurer._id
        };
        await club.save();

        // Add council members to SGC club members
        club.members.push(vicePresident._id, generalSecretary._id, treasurer._id);
        await club.save();
      }

      // Update club admin with club reference
      clubAdmin.clubId = club._id;
      await clubAdmin.save();

      // Assign admin permissions
      await Admin.create({
        user: clubAdmin._id,
        club: club._id,
        role: 'primary_admin',
        assignedBy: webopsAdmin._id,
        permissions: {
          manageMembers: true,
          manageEvents: true,
          managePosts: true,
          editClubInfo: true
        }
      });

      console.log(`✅ Created club: ${club.name}`); 
    }

    // Assign super admins to all clubs
    const allClubs = await Club.find();
    for (const club of allClubs) {
      await Admin.create({
        user: webopsAdmin._id,
        club: club._id,
        role: 'primary_admin',
        assignedBy: webopsAdmin._id,
        permissions: {
          manageMembers: true,
          manageEvents: true,
          managePosts: true,
          editClubInfo: true
        }
      });

      await Admin.create({
        user: president._id,
        club: club._id,
        role: 'primary_admin',
        assignedBy: webopsAdmin._id,
        permissions: {
          manageMembers: true,
          manageEvents: true,
          managePosts: true,
          editClubInfo: true
        }
      });
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Total Clubs: ${allClubs.length}`);
    console.log(`   - Including SGC Council: Yes`);
    console.log(`   - Club Admins: ${clubsData.length}`);
    console.log(`   - Super Admins: 2`);
    console.log(`   - SGC Council Members: 4`);

    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('\n📧 SUPER ADMINS:');
    console.log('   Webops: webops@sgc.edu.in / webops@2026');
    console.log('   President: president@sgc.edu.in / president@2026');
    
    console.log('\n📧 SGC COUNCIL:');
    console.log('   Vice President: vp@sgc.edu.in / vp@2026');
    console.log('   General Secretary: gs@sgc.edu.in / gs@2026');
    console.log('   Treasurer: treasurer@sgc.edu.in / treasurer@2026');
    
    console.log('\n📧 CLUB ADMINS:');
    clubsData.slice(1).forEach(club => {
      console.log(`   ${club.name}: ${club.email} / ${club.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();