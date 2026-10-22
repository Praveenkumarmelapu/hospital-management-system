const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_management';

const defaultSchedule = [
  { day: 'Monday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Tuesday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Wednesday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Thursday', startTime: '02:00 PM', endTime: '06:00 PM', isAvailable: true },
  { day: 'Friday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: true },
  { day: 'Saturday', startTime: '10:00 AM', endTime: '02:00 PM', isAvailable: true },
  { day: 'Sunday', startTime: '09:00 AM', endTime: '01:00 PM', isAvailable: false },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data and drop legacy indexes
    try {
      await mongoose.connection.db.collection('users').drop();
    } catch (e) {}
    try {
      await mongoose.connection.db.collection('departments').drop();
    } catch (e) {}
    try {
      await mongoose.connection.db.collection('doctors').drop();
    } catch (e) {}
    try {
      await mongoose.connection.db.collection('appointments').drop();
    } catch (e) {}

    console.log('Existing collections and legacy indexes cleared.');

    // 1. Create Admin & Patients
    const adminUser = await User.create({
      name: 'Dr. Administrator',
      email: 'admin@hospital.com',
      phone: '+44 20 7946 0900',
      password: 'Admin@123', // Academic plain text spec
      role: 'admin',
      gender: 'Male',
      address: '75 Harley Street, Admin Block, London W1G 8QW, UK',
      status: 'active',
    });

    const patient1 = await User.create({
      name: 'James Wilson',
      email: 'patient@gmail.com',
      phone: '+44 7700 900123',
      password: 'Patient@123',
      role: 'patient',
      dateOfBirth: '1992-05-14',
      gender: 'Male',
      address: '14 Kensington Gardens, London W8 4PX, UK',
      status: 'active',
    });

    const patient2 = await User.create({
      name: 'Emma Watson',
      email: 'ananya@gmail.com',
      phone: '+44 7700 900456',
      password: 'Patient@123',
      role: 'patient',
      dateOfBirth: '1998-11-20',
      gender: 'Female',
      address: '28 Baker Street, Marylebone, London NW1 6XE, UK',
      status: 'active',
    });

    console.log('Users seeded successfully.');

    // 2. Create Departments
    const departmentsData = [
      {
        name: 'Cardiology',
        description: 'Comprehensive heart care, interventional cardiology, ECG, echocardiography, and cardiac surgery.',
        image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Neurology',
        description: 'Advanced neurological diagnostics, brain injury rehabilitation, epilepsy management, and neurosurgery.',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Orthopedics',
        description: 'Joint replacements, bone fracture care, sports medicine, spine surgery, and musculoskeletal therapies.',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Pediatrics',
        description: 'Dedicated healthcare for infants, children, and adolescents with vaccination and growth tracking.',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Dermatology',
        description: 'Skin health, laser treatment, acne therapy, cosmetic dermatology, and hair restoration services.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'General Medicine',
        description: 'Primary care, chronic disease management, diabetes treatment, fever clinics, and preventive health screenings.',
        image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Gynecology',
        description: 'Women healthcare, high-risk pregnancy care, maternity services, laparoscopic gynecologic surgeries.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Dentistry',
        description: 'Oral health, dental implants, root canal therapy, teeth whitening, and orthodontic care.',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      },
    ];

    const seededDepts = await Department.insertMany(departmentsData);
    const deptMap = {};
    seededDepts.forEach((dept) => {
      deptMap[dept.name] = dept._id;
    });

    console.log('Departments seeded successfully.');

    // 3. Create Doctors
    const doctorsData = [
      {
        name: 'Dr. Ravi Kumar',
        email: 'ravi.kumar@hospital.com',
        phone: '+44 20 7946 0101',
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
        specialization: 'Senior Interventional Cardiologist',
        department: deptMap['Cardiology'],
        qualification: 'MBBS, MD (General Medicine), DM (Cardiology)',
        experience: 18,
        about: 'Dr. Ravi Kumar is a renowned cardiologist with over 18 years of experience in angioplasty and complex coronary interventions.',
        consultationFee: 800,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Priya Sundaram',
        email: 'priya.sundaram@hospital.com',
        phone: '+44 20 7946 0102',
        profileImage: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?auto=format&fit=crop&w=500&q=80',
        specialization: 'Consultant Neurologist',
        department: deptMap['Neurology'],
        qualification: 'MBBS, MD, DM (Neurology)',
        experience: 12,
        about: 'Specializes in stroke management, Parkinson disease, migraines, and nerve disorders.',
        consultationFee: 750,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Rajesh Rao',
        email: 'rajesh.rao@hospital.com',
        phone: '+44 20 7946 0103',
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
        specialization: 'Orthopedic & Joint Replacement Surgeon',
        department: deptMap['Orthopedics'],
        qualification: 'MBBS, MS (Orthopedics), M.Ch (UK)',
        experience: 15,
        about: 'Expert in total knee replacement, hip arthroplasty, fracture care, and trauma management.',
        consultationFee: 700,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Sunita Reddy',
        email: 'sunita.reddy@hospital.com',
        phone: '+44 20 7946 0104',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
        specialization: 'Senior Pediatrician',
        department: deptMap['Pediatrics'],
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        experience: 14,
        about: 'Compassionate pediatric care, child nutrition specialist, and infant immunology expert.',
        consultationFee: 600,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Arjun Mehta',
        email: 'arjun.mehta@hospital.com',
        phone: '+44 20 7946 0105',
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80',
        specialization: 'Dermatologist & Cosmetologist',
        department: deptMap['Dermatology'],
        qualification: 'MBBS, MD (Dermatology)',
        experience: 10,
        about: 'Expertise in skin diseases, laser therapy, anti-aging procedures, and hair fall solutions.',
        consultationFee: 650,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Vikram Patel',
        email: 'vikram.patel@hospital.com',
        phone: '+44 20 7946 0106',
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
        specialization: 'General Physician & Diabetologist',
        department: deptMap['General Medicine'],
        qualification: 'MBBS, MD (Internal Medicine)',
        experience: 16,
        about: 'Specialist in diabetes care, hypertension management, infectious diseases, and preventive checkups.',
        consultationFee: 500,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Sneha Kulkarni',
        email: 'sneha.kulkarni@hospital.com',
        phone: '+44 20 7946 0107',
        profileImage: 'https://images.unsplash.com/photo-1594824813566-88855ce78964?auto=format&fit=crop&w=500&q=80',
        specialization: 'Obstetrician & Gynecologist',
        department: deptMap['Gynecology'],
        qualification: 'MBBS, MS (Obstetrics & Gynecology)',
        experience: 11,
        about: 'Specializes in maternity care, high-risk delivery, infertility counseling, and laparoscopic surgery.',
        consultationFee: 700,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
      {
        name: 'Dr. Anand Joshi',
        email: 'anand.joshi@hospital.com',
        phone: '+44 20 7946 0108',
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
        specialization: 'Cosmetic Dentist & Implantologist',
        department: deptMap['Dentistry'],
        qualification: 'BDS, MDS (Prosthodontics)',
        experience: 9,
        about: 'Comprehensive dental treatment, smile designing, painless root canal, and laser dentistry.',
        consultationFee: 500,
        availability: defaultSchedule,
        slotDuration: 30,
        status: 'active',
      },
    ];

    const seededDoctors = await Doctor.insertMany(doctorsData);
    console.log('Doctors seeded successfully.');

    // 4. Create Initial Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const appointmentsData = [
      {
        patient: patient1._id,
        doctor: seededDoctors[0]._id, // Dr. Ravi Kumar
        department: deptMap['Cardiology'],
        appointmentDate: tomorrowStr,
        appointmentTime: '10:00 AM',
        reason: 'Routine cardiac checkup and BP monitoring.',
        status: 'Confirmed',
      },
      {
        patient: patient1._id,
        doctor: seededDoctors[5]._id, // Dr. Vikram Patel
        department: deptMap['General Medicine'],
        appointmentDate: nextWeekStr,
        appointmentTime: '11:30 AM',
        reason: 'Fever and general fatigue consultation.',
        status: 'Pending',
      },
      {
        patient: patient2._id,
        doctor: seededDoctors[1]._id, // Dr. Priya Sundaram
        department: deptMap['Neurology'],
        appointmentDate: tomorrowStr,
        appointmentTime: '11:00 AM',
        reason: 'Chronic migraine and neck stiffness.',
        status: 'Pending',
      },
      {
        patient: patient2._id,
        doctor: seededDoctors[4]._id, // Dr. Arjun Mehta
        department: deptMap['Dermatology'],
        appointmentDate: '2026-09-08', // Past appointment
        appointmentTime: '02:30 PM',
        reason: 'Skin allergy consultation.',
        status: 'Completed',
      },
    ];

    await Appointment.insertMany(appointmentsData);
    console.log('Appointments seeded successfully.');

    console.log('\n================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' MongoDB Connection: ' + MONGO_URI);
    console.log(' Admin Login: admin@hospital.com / Admin@123');
    console.log(' Patient Login: patient@gmail.com / Patient@123');
    console.log('================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedData();
