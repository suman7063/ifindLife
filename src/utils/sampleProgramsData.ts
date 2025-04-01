
import { Program, ProgramCategory } from '@/types/programs';
import { from } from '@/lib/supabase';

export const addSamplePrograms = async (programs: Program[]) => {
  // Check if we already have enough programs
  const existingCounts = {
    'quick-ease': programs.filter(p => p.category === 'quick-ease').length,
    'resilience-building': programs.filter(p => p.category === 'resilience-building').length,
    'super-human': programs.filter(p => p.category === 'super-human').length,
    'issue-based': programs.filter(p => p.category === 'issue-based').length
  };
  
  // Define sample programs data
  const samplePrograms: Partial<Program>[] = [];
  
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
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
  }
  
  // Resilience Building programs
  if (existingCounts['resilience-building'] < 5) {
    samplePrograms.push({
      title: "Bounce Back Stronger",
      description: "Build emotional resilience with this comprehensive program that teaches coping mechanisms for life's challenges.",
      duration: "8 weeks",
      sessions: 16,
      price: 4499,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzaWxpZW5jZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      category: 'resilience-building',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
    
    samplePrograms.push({
      title: "Emotional Strength Training",
      description: "Learn to process difficult emotions and develop the strength to face life's challenges with confidence.",
      duration: "6 weeks",
      sessions: 12,
      price: 3999,
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3RyZW5ndGh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      category: 'resilience-building',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
    
    samplePrograms.push({
      title: "Crisis Navigation",
      description: "Develop skills to handle major life changes and unexpected challenges while maintaining your mental wellness.",
      duration: "10 weeks",
      sessions: 20,
      price: 5499,
      image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3Jpc2lzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      category: 'resilience-building',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
    
    samplePrograms.push({
      title: "Adaptive Mindset",
      description: "Cultivate flexibility in thinking and develop the ability to adapt to changing circumstances while staying grounded.",
      duration: "7 weeks",
      sessions: 14,
      price: 4299,
      image: "https://images.unsplash.com/photo-1569161031678-f19b1f8e52a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWRhcHRhdGlvbnxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60",
      category: 'resilience-building',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
  }
  
  // Super Human programs
  if (existingCounts['super-human'] < 5) {
    samplePrograms.push({
      title: "Peak Performance Mindset",
      description: "Unlock your full potential with advanced cognitive techniques and performance psychology principles.",
      duration: "12 weeks",
      sessions: 24,
      price: 6999,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZm9ybWFuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      category: 'super-human',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
    
    samplePrograms.push({
      title: "Mental Mastery Elite",
      description: "Join our most comprehensive program for those seeking to achieve elite mental performance in all areas of life.",
      duration: "3 months",
      sessions: 36,
      price: 8999,
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFzdGVyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      category: 'super-human',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
    
    samplePrograms.push({
      title: "Flow State Mastery",
      description: "Learn how to consistently achieve and maintain the optimal state of flow for extraordinary productivity and creativity.",
      duration: "10 weeks",
      sessions: 20,
      price: 7499,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zmxvd3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60",
      category: 'super-human',
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
    
    samplePrograms.push({
      title: "Limitless Potential",
      description: "Break through mental barriers and discover techniques used by world-class performers to achieve extraordinary results.",
      duration: "14 weeks",
      sessions: 28,
      price: 7999,
      image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG90ZW50aWFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      category: 'super-human',
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
      created_at: new Date().toISOString(),
      enrollments: Math.floor(Math.random() * 50) + 10
    });
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
