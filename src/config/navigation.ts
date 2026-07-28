export const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
] as const;

export const dashboardNavigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Listings", href: "/dashboard/listings" },
  { label: "Add New Car", href: "/dashboard/listings/new" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/dashboard/settings" },
] as const;
