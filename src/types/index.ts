export interface User {
    id:string ;
    name:string;
    email:string;
    password:string;
    profileImage?:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface AuthResponse  {
    token: string;
    user: User;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl: string;
    liveURL: string;
    imageURL: {
        url: string;
        public_id: string;
    };
    category?:string
    createdAt: Date;
    updatedAt: Date;
}

export interface Blog {
    id: string;
    title: string;
    description: string;
    url: string;
    platform: string;
    imageURL: {
        url: string;
        public_id: string;
    };
    published: boolean;
    publishedAt: Date;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GithubStats {
    username: string;
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
    following: number;
    languages: string[];
    avatarUrl?: string;
    bio?: string;
    location?: string;
    company?: string;
    blog?: string;
    lastUpdated: Date;
}

export interface DashboardStats {
    totalProjects: number;
    totalBlogs: number;
    totalContacts: number;
    totalSkills: number;
    publishedProjects: number;
    publishedBlogs: number;
    unreadContacts: number;
    github?: GithubStats;
}

export interface DashboardData {
    stats: DashboardStats;
    github: GithubStats | null;
    projects: Project[];
    blogs: Blog[];
    contacts: Contact[];
  //skills: Skill[];
}

export interface RecentActivity {
    id: string;
    type: 'project' | 'blog' | 'contact';
    createdAt: string;
    title?: string;
    name?: string;
    email?: string;
    message?: string;
}