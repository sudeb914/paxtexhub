import type { Seller } from "@/types/user";

export const sellers: Seller[] = [
  {
    id: "seller-1",
    name: "John Doe",
    avatarUrl: "/images/sellers/john-doe.jpg",
    memberSince: "January 2022",
    email: "john.doe@autohub.example",
    phone: "+1 (212) 555-0184",
  },
  {
    id: "seller-2",
    name: "Michael Chen",
    avatarUrl: "/images/sellers/michael-chen.jpg",
    memberSince: "August 2021",
    email: "michael.chen@autohub.example",
    phone: "+1 (312) 555-0132",
  },
  {
    id: "seller-3",
    name: "Sarah Wilson",
    avatarUrl: "/images/sellers/sarah-wilson.jpg",
    memberSince: "March 2023",
    email: "sarah.wilson@autohub.example",
    phone: "+1 (305) 555-0176",
  },
];
