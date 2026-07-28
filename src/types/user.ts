export interface Seller {
  id: string;
  name: string;
  avatarUrl: string;
  memberSince: string;
  email?: string;
  phone?: string;
  profileUrl?: string;
  subtitle?: string;
}

export interface UserProfile extends Seller {
  bio?: string;
  location?: string;
}
