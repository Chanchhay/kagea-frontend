export type Company = {
  name: string;
  category: string;
  location: string;
  featured: boolean;
  highlighted?: boolean;
  bg: string;
  text: string;
  logoText: string;
};

export type Job = {
  id: number;
  title: string;
  company: string;
};
