
export interface Session {
  id: number;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: string;
  created_at?: string;
}

export interface ColorOption {
  name: string;
  value: string;
}

export interface IconOption {
  name: string;
  value: string;
}
