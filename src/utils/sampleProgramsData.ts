
import { Program, ProgramCategory, ProgramType } from '@/types/programs';
import { from } from '@/lib/supabase';

export const addSamplePrograms = async (programType: ProgramType = 'wellness') => {
  // Check if we already have enough programs of this type
  const { data: existingPrograms, error } = await from('programs')
    .select('*')
    .eq('programType', programType);
    
  if (error) {
    console.error('Error checking existing programs:', error);
    return false;
  }
  
  // Cast to Program type
  const programs = existingPrograms as unknown as Program[];
  
  // Define sample programs data based on program type
  const samplePrograms: Partial<Program>[] = [];
  
  if (programType === 'wellness') {
    // Count by category
    const existingCounts = {
      'quick-ease': programs.filter(p => p.category === 'quick-ease').length,
      'resilience-building': programs.filter(p => p.category === 'resilience-building').length,
      'super-human': programs.filter(p => p.category === 'super-human').length,
      'issue-based': programs.filter(p => p.category === 'issue-based').length
    };
    
    // QuickEase programs
    if (existingCounts['quick-ease'] < 5) {
      samplePrograms.push({
        title: "Stress Relief Quick Program",
        description: "A short program designed to help you quickly reduce stress and anxiety through guided meditation and breathing exercises.",
        duration: "2 weeks",
        sessions: 6,
        price: 1999,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'quick-ease',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Sleep Enhancement Program",
        description: "Improve your sleep quality with this short but effective program featuring relaxation techniques and sleep hygiene practices.",
        duration: "10 days",
        sessions: 5,
        price: 1499,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2xlZXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'quick-ease',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Mindful Moments",
        description: "Learn quick mindfulness techniques to integrate into your busy day for instant stress relief and mental clarity.",
        duration: "3 weeks",
        sessions: 9,
        price: 2499,
        image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1pbmRmdWxuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        category: 'quick-ease',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Focus Boost",
        description: "Enhance your concentration and productivity with quick daily exercises designed for busy professionals.",
        duration: "2 weeks",
        sessions: 10,
        price: 1899,
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'quick-ease',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
    
    // Issue-Based programs
    if (existingCounts['issue-based'] < 5) {
      samplePrograms.push({
        title: "Anxiety Freedom Program",
        description: "A targeted program designed specifically to help you overcome anxiety with evidence-based approaches.",
        duration: "6 weeks",
        sessions: 12,
        price: 3499,
        image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW54aWV0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'issue-based',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Depression Recovery Path",
        description: "Find your way back to joy and motivation with this comprehensive program for managing depression.",
        duration: "8 weeks",
        sessions: 16,
        price: 4999,
        image: "https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVjb3Zlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'issue-based',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "PTSD Healing Journey",
        description: "A structured, trauma-informed program to help you process and recover from post-traumatic stress.",
        duration: "12 weeks",
        sessions: 24,
        price: 5999,
        image: "https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhbGluZ3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'issue-based',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "OCD Management",
        description: "Learn effective strategies to manage obsessive-compulsive patterns and reclaim control of your daily life.",
        duration: "9 weeks",
        sessions: 18,
        price: 4799,
        image: "https://images.unsplash.com/photo-1484069560501-87d72b0c3669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b3JkZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'issue-based',
        programType: 'wellness',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
  } else if (programType === 'academic') {
    // Academic Institute Programs (if we have less than 5)
    if (programs.length < 5) {
      samplePrograms.push({
        title: "Student Counseling Programs",
        description: "Comprehensive counseling programs designed specifically for students to address academic stress, social challenges, and personal development.",
        duration: "12 weeks",
        sessions: 24,
        price: 5999,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGVudHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        programType: 'academic',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Teacher Mental Health Support",
        description: "Support programs specifically designed to help teachers manage stress, prevent burnout, and maintain their mental wellbeing in challenging educational environments.",
        duration: "8 weeks",
        sessions: 16,
        price: 4500,
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVhY2hlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        programType: 'academic',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Crisis Intervention Resources",
        description: "Specialized training and resources for educational institutions to handle crisis situations, including mental health emergencies and traumatic events.",
        duration: "6 weeks",
        sessions: 12,
        price: 4999,
        image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3Jpc2lzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        programType: 'academic',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Bullying Prevention Strategies",
        description: "Comprehensive program to implement effective anti-bullying initiatives, foster inclusive environments, and build a culture of respect in academic settings.",
        duration: "10 weeks",
        sessions: 20,
        price: 4199,
        image: "https://images.unsplash.com/photo-1608354580875-30675e7f1a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVsbHlpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        programType: 'academic',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Wellness Workshops for Campus Life",
        description: "Interactive workshops designed to promote overall wellness, mental health awareness, and positive lifestyle choices throughout campus communities.",
        duration: "5 weeks",
        sessions: 10,
        price: 3499,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtcHVzJTIwbGlmZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'resilience-building',
        programType: 'academic',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
  } else if (programType === 'business') {
    // Business Programs (if we have less than 5)
    if (programs.length < 5) {
      samplePrograms.push({
        title: "Employee Wellness Programs",
        description: "Comprehensive wellness initiatives to boost employee morale, reduce absenteeism, and create a healthier, more productive workplace environment.",
        duration: "12 weeks",
        sessions: 24,
        price: 7499,
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        programType: 'business',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Leadership Mental Fitness Training",
        description: "Advanced mental fitness training for executives and team leaders to enhance decision-making, emotional intelligence, and resilience under pressure.",
        duration: "10 weeks",
        sessions: 20,
        price: 8999,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGVhZGVyc2hpcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        programType: 'business',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Workplace Stress Management",
        description: "Evidence-based strategies to identify stress triggers in the workplace and implement effective management techniques for improved organizational health.",
        duration: "8 weeks",
        sessions: 16,
        price: 6999,
        image: "https://images.unsplash.com/photo-1573497620285-d7f0885fa473?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        programType: 'business',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Team Building for Psychological Safety",
        description: "Specialized program to foster psychological safety within teams, enhancing collaboration, innovation, and open communication in the workplace.",
        duration: "6 weeks",
        sessions: 12,
        price: 5999,
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbXdvcmt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        programType: 'business',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
      
      samplePrograms.push({
        title: "Burnout Prevention Strategies",
        description: "Proactive approaches to identify and address burnout risks within organizations, creating sustainable work practices and supportive corporate cultures.",
        duration: "8 weeks",
        sessions: 16,
        price: 6499,
        image: "https://images.unsplash.com/photo-1626197031507-c17099753214?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVybm91dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        category: 'super-human',
        programType: 'business',
        created_at: new Date().toISOString(),
        enrollments: Math.floor(Math.random() * 50) + 10
      });
    }
  }
  
  // Only add programs if we have any to add
  if (samplePrograms.length > 0) {
    try {
      for (const program of samplePrograms) {
        await from('programs').insert(program);
      }
      return true; // Successfully added programs
    } catch (error) {
      console.error('Error adding sample programs:', error);
      return false;
    }
  }
  
  return false; // No programs needed to be added
};
