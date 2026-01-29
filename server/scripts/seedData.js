const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Trainer = require('../models/Trainer.model');
const Class = require('../models/Class.model');
const ForumPost = require('../models/ForumPost.model');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({ email: { $ne: 'admin@fittracker.com' } });
        await Trainer.deleteMany({});
        await Class.deleteMany({});
        await ForumPost.deleteMany({});

        console.log('🧹 Cleared old data');

        // 1. Create Trainers (and their Users)
        const trainersData = [
            {
                name: 'Sarah Mitchell',
                email: 'sarah@fittracker.com',
                photo: 'https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=400&auto=format&fit=crop',
                bio: 'Certified Yoga and Pilates instructor with 8 years of experience in holistic wellness.',
                skills: ['Yoga', 'Pilates', 'Meditation'],
                experience: 8
            },
            {
                name: 'Marcus Chen',
                email: 'marcus@fittracker.com',
                photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=400&auto=format&fit=crop',
                bio: 'Strength and conditioning specialist focused on high-performance athletic training.',
                skills: ['Strength', 'HIIT', 'CrossFit'],
                experience: 10
            },
            {
                name: 'Elena Rodriguez',
                email: 'elena@fittracker.com',
                photo: 'https://images.unsplash.com/photo-1518310382957-39978403a93c?q=80&w=400&auto=format&fit=crop',
                bio: 'Nutritionist and cardio coach dedicated to sustainable weight loss and heart health.',
                skills: ['Nutrition', 'Cardio', 'Zumba'],
                experience: 6
            }
        ];

        for (const t of trainersData) {
            const user = await User.create({
                name: t.name,
                email: t.email,
                photoURL: t.photo,
                role: 'trainer',
                firebaseUid: `seed-${t.email}`
            });

            await Trainer.create({
                userId: user._id,
                bio: t.bio,
                skills: t.skills,
                experience: t.experience,
                rating: (4.5 + Math.random() * 0.5).toFixed(1),
                isApproved: true
            });
        }

        console.log('✨ Trainers created');

        // 2. Create Classes
        const classesData = [
            { name: 'Sunrise Yoga Flow', description: 'Begin your day with energy and mindfulness in this gentle morning flow.', difficulty: 'beginner', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
            { name: 'Elite Strength Circuit', description: 'Advanced weight training focus to build maximum muscle and power.', difficulty: 'advanced', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800' },
            { name: 'HIIT Burn 500', description: 'High intensity interval training designed to torch 500+ calories in one hour.', difficulty: 'intermediate', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800' },
            { name: 'Foundational Pilates', description: 'Core-focused movements to improve posture, flexibility, and stability.', difficulty: 'beginner', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800' },
            { name: 'Marathon Readiness', description: 'Endurance building for long-distance runners looking to improve their time.', difficulty: 'intermediate', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800' }
        ];

        await Class.insertMany(classesData.map(c => ({
            ...c,
            bookingCount: Math.floor(Math.random() * 200) + 50
        })));

        console.log('🏟️ Classes created');

        // 3. Create Forum Posts
        const trainerUsers = await User.find({ role: 'trainer' });
        const postsData = [
            { title: 'The Importance of Rest Days', content: 'Many people think progress only happens in the gym, but your muscles actually grow while you rest. Aim for at least 1-2 full recovery days per week.', category: 'Recovery' },
            { title: 'Pre-Workout Nutrition Guide', content: 'What you eat 60 minutes before training can significantly impact your performance. Simple carbs and moderate protein are best.', category: 'Nutrition' },
            { title: 'Morning vs Evening Workouts', content: 'The best time to work out is whenever you can be most consistent. Science suggests slight benefits for afternoon strength, but consistency is king.', category: 'General' }
        ];

        for (let i = 0; i < postsData.length; i++) {
            const author = trainerUsers[i % trainerUsers.length];
            await ForumPost.create({
                ...postsData[i],
                authorId: author._id,
                authorName: author.name,
                authorRole: author.role,
                upVotes: Math.floor(Math.random() * 50) + 10,
                views: Math.floor(Math.random() * 500) + 100
            });
        }

        console.log('📝 Forum posts created');
        console.log('✅ Seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
