
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  category: string;
  date: string;
  content: string;
  summary: string;
  author?: string;
}

export interface BlogSettings {
  featuredPosts: number[];
  categoriesOrder: string[];
}
