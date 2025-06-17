
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  date: string;
  content: string;
  summary: string;
  author?: string;
  readTime?: string;
}

export interface BlogSettings {
  featuredPosts: string[];
  categoriesOrder: string[];
}
