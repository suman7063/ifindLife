
import { supabase, from } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to check if a table exists using the PostgreSQL function we created
const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Using the PostgreSQL function we created to check if the table exists
    const { data, error } = await supabase.rpc('check_if_table_exists', { table_name: tableName });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// Helper function to safely query a table
const safeQuery = async (tableName: string, query: any) => {
  try {
    const exists = await tableExists(tableName);
    
    if (!exists) {
      console.log(`Table ${tableName} does not exist in Supabase`);
      return { data: null, error: new Error(`Table ${tableName} does not exist`) };
    }
    
    return await query();
  } catch (error) {
    console.error(`Error querying table ${tableName}:`, error);
    return { data: null, error };
  }
};

export const migrateExpertsToSupabase = async (): Promise<boolean> => {
  try {
    const storedExperts = localStorage.getItem('ifindlife-experts');
    if (!storedExperts) {
      console.log('No experts data found in localStorage to migrate');
      return false;
    }

    // Check if experts table exists
    const hasExpertsTable = await tableExists('experts');
    if (!hasExpertsTable) {
      console.log('Experts table does not exist in Supabase');
      toast.error('Experts table does not exist. Please create it first.');
      return false;
    }

    const experts = JSON.parse(storedExperts);
    
    // First check if experts already exist in Supabase
    const { data: existingExperts, error: expertsError } = await safeQuery('experts', () => 
      from('experts').select('email')
    );
    
    if (expertsError) {
      throw expertsError;
    }
    
    const existingEmails = existingExperts?.map((e: any) => e.email) || [];
    
    // Filter out experts that already exist
    const expertsToMigrate = experts.filter((e: any) => !existingEmails.includes(e.email));
    
    if (expertsToMigrate.length === 0) {
      console.log('All experts are already migrated to Supabase');
      return false;
    }
    
    // Transform expert data to match Supabase schema
    const formattedExperts = expertsToMigrate.map((expert: any) => ({
      id: expert.id,
      name: expert.name,
      email: expert.email,
      phone: expert.phone,
      address: expert.address,
      city: expert.city,
      state: expert.state,
      country: expert.country,
      specialization: expert.specialization,
      experience: expert.experience,
      bio: expert.bio,
      certificate_urls: expert.certificateUrls,
      profile_picture: expert.profilePicture,
      selected_services: expert.selectedServices,
      created_at: new Date().toISOString(),
    }));
    
    // Insert experts data to Supabase
    const { error } = await safeQuery('experts', () => 
      from('experts').insert(formattedExperts)
    );
    
    if (error) {
      throw error;
    }
    
    // Handle reported users migration if needed
    const hasExpertReportsTable = await tableExists('expert_reports');
    if (hasExpertReportsTable) {
      for (const expert of experts) {
        if (expert.reportedUsers && expert.reportedUsers.length > 0) {
          const expertReports = expert.reportedUsers.map((report: any) => ({
            expert_id: expert.id,
            user_id: report.userId,
            user_name: report.userName,
            reason: report.reason,
            details: report.details,
            date: report.date,
            status: report.status
          }));
          
          const { error: reportError } = await safeQuery('expert_reports', () => 
            from('expert_reports').insert(expertReports)
          );
          
          if (reportError) {
            console.error('Error migrating expert reports:', reportError);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error migrating experts to Supabase:', error);
    return false;
  }
};

export const migrateUsersToSupabase = async (): Promise<boolean> => {
  try {
    const storedUsers = localStorage.getItem('ifindlife-users');
    if (!storedUsers) {
      console.log('No users data found in localStorage to migrate');
      return false;
    }

    // Check if users table exists
    const hasUsersTable = await tableExists('users');
    if (!hasUsersTable) {
      console.log('Users table does not exist in Supabase');
      toast.error('Users table does not exist. Please create it first.');
      return false;
    }
    
    const users = JSON.parse(storedUsers);
    
    // First check if users already exist in Supabase
    const { data: existingUsers, error: usersError } = await safeQuery('users', () => 
      from('users').select('email')
    );
    
    if (usersError) {
      throw usersError;
    }
    
    const existingEmails = existingUsers?.map((u: any) => u.email) || [];
    
    // Filter out users that already exist
    const usersToMigrate = users.filter((u: any) => !existingEmails.includes(u.email));
    
    if (usersToMigrate.length === 0) {
      console.log('All users are already migrated to Supabase');
      return false;
    }
    
    // Transform user data to match Supabase schema
    const formattedUsers = usersToMigrate.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
      currency: user.currency,
      profile_picture: user.profilePicture,
      wallet_balance: user.walletBalance,
      created_at: new Date().toISOString(),
    }));
    
    // Insert users data to Supabase
    const { error } = await safeQuery('users', () => 
      from('users').insert(formattedUsers)
    );
    
    if (error) {
      throw error;
    }
    
    // Conditionally migrate related user data
    // Only attempt to insert into tables if they exist
    for (const user of users) {
      // Migrate favorite experts
      if (user.favoriteExperts && user.favoriteExperts.length > 0) {
        const hasTable = await tableExists('user_favorites');
        if (hasTable) {
          const favorites = user.favoriteExperts.map((fav: any) => ({
            user_id: user.id,
            expert_id: fav.id
          }));
          
          await safeQuery('user_favorites', () => 
            from('user_favorites').insert(favorites)
          );
        }
      }
      
      // Migrate transactions
      if (user.transactions && user.transactions.length > 0) {
        const hasTable = await tableExists('user_transactions');
        if (hasTable) {
          const transactions = user.transactions.map((txn: any) => ({
            id: txn.id,
            user_id: user.id,
            date: txn.date,
            type: txn.type,
            amount: txn.amount,
            currency: txn.currency,
            description: txn.description
          }));
          
          await safeQuery('user_transactions', () => 
            from('user_transactions').insert(transactions)
          );
        }
      }
      
      // Migrate reviews
      if (user.reviews && user.reviews.length > 0) {
        const hasTable = await tableExists('user_reviews');
        if (hasTable) {
          const reviews = user.reviews.map((review: any) => ({
            id: review.id,
            user_id: user.id,
            expert_id: review.expertId,
            rating: review.rating,
            comment: review.comment,
            date: review.date
          }));
          
          await safeQuery('user_reviews', () => 
            from('user_reviews').insert(reviews)
          );
        }
      }
      
      // Migrate reports
      if (user.reports && user.reports.length > 0) {
        const hasTable = await tableExists('user_reports');
        if (hasTable) {
          const reports = user.reports.map((report: any) => ({
            id: report.id,
            user_id: user.id,
            expert_id: report.expertId,
            reason: report.reason,
            details: report.details,
            date: report.date,
            status: report.status
          }));
          
          await safeQuery('user_reports', () => 
            from('user_reports').insert(reports)
          );
        }
      }
      
      // Migrate courses
      if (user.enrolledCourses && user.enrolledCourses.length > 0) {
        const hasTable = await tableExists('user_courses');
        if (hasTable) {
          const courses = user.enrolledCourses.map((course: any) => ({
            id: course.id,
            user_id: user.id,
            title: course.title,
            expert_id: course.expertId,
            expert_name: course.expertName,
            enrollment_date: course.enrollmentDate,
            progress: course.progress,
            completed: course.completed
          }));
          
          await safeQuery('user_courses', () => 
            from('user_courses').insert(courses)
          );
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error migrating users to Supabase:', error);
    return false;
  }
};

export const migrateServicesToSupabase = async (): Promise<boolean> => {
  try {
    const storedContent = localStorage.getItem('ifindlife-content');
    if (!storedContent) {
      return false;
    }

    // Check if services table exists
    const hasServicesTable = await tableExists('services');
    if (!hasServicesTable) {
      console.log('Services table does not exist in Supabase');
      toast.error('Services table does not exist. Please create it first.');
      return false;
    }

    const content = JSON.parse(storedContent);
    if (!content.categories) {
      return false;
    }
    
    // Transform categories to services
    const services = content.categories.map((category: any, index: number) => ({
      id: index + 1,
      name: category.title,
      description: category.description,
      rate_usd: 30 + (index * 5),
      rate_inr: (30 + (index * 5)) * 80,
    }));
    
    // First check if services already exist in Supabase
    const { data: existingServices, error: servicesError } = await safeQuery('services', () => 
      from('services').select('id')
    );
    
    if (servicesError) {
      throw servicesError;
    }
    
    if (existingServices && existingServices.length > 0) {
      console.log('Services are already migrated to Supabase');
      return false;
    }
    
    // Insert services data to Supabase
    const { error } = await safeQuery('services', () => 
      from('services').insert(services)
    );
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error migrating services to Supabase:', error);
    return false;
  }
};

export const runMigrations = async () => {
  toast.info('Starting data migration to Supabase...');
  
  try {
    const servicesMigrated = await migrateServicesToSupabase();
    const expertsMigrated = await migrateExpertsToSupabase();
    const usersMigrated = await migrateUsersToSupabase();
    
    if (servicesMigrated || expertsMigrated || usersMigrated) {
      toast.success('Data successfully migrated to Supabase!');
    } else {
      toast.info('No new data to migrate. Database is up to date.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    toast.error('Error migrating data to Supabase');
  }
};
