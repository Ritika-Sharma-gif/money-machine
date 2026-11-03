import {
  LayoutDashboard,
  Compass,
  Handshake,
  Wallet,
  Megaphone,
  FileText,
  Bookmark,
  MessageSquare,
  ShieldCheck,
  Users,
  UserRound,
  Settings,
  Smartphone,
} from "lucide-react";
export const shared = [
  {
    path: "messages",
    label: "Messages",
    icon: MessageSquare,
    description: "Keep collaboration conversations together.",
  },
  {
    path: "agreements",
    label: "Agreements",
    icon: FileText,
    description: "Review offers, accepted versions, and future amendments.",
  },
  {
    path: "achievements",
    label: "Achievements",
    icon: ShieldCheck,
    description: "Explore account, collaboration, and commercial milestones.",
  },
  {
    path: "community",
    label: "Community",
    icon: Users,
    description: "Connect with the creator and business community.",
  },
  {
    path: "profile",
    label: "Profile",
    icon: UserRound,
    description: "Manage your profile and opt-in public visibility.",
  },
  {
    path: "settings",
    label: "Settings",
    icon: Settings,
    description: "Manage your workspace preferences.",
  },
  {
    path: "install",
    label: "Get the app",
    icon: Smartphone,
    description:
      "Installation guidance will be added when PWA support is ready.",
  },
];
export function navigation(role) {
  const business = role === "business";
  return [
    { path: "overview", label: "Overview", icon: LayoutDashboard },
    {
      path: "discover",
      label: business ? "Discover creators" : "Opportunities",
      icon: Compass,
      description: business
        ? "Find creators whose interests and availability fit your brief."
        : "Explore opportunities that fit your creative interests.",
    },
    ...(business
      ? [
          {
            path: "briefs",
            label: "Briefs",
            icon: FileText,
            description: "Outline your campaign, deliverables, and budget.",
          },
          {
            path: "shortlists",
            label: "Shortlists",
            icon: Bookmark,
            description: "Keep your favourite creator profiles in one place.",
          },
        ]
      : []),
    {
      path: "collaborations",
      label: "Collaborations",
      icon: Handshake,
      description: "Track deliverables, deadlines, and approvals.",
    },
    {
      path: "finances",
      label: business ? "Spending" : "Income",
      icon: Wallet,
      description:
        "Keep agreed, invoiced, and received amounts separate, with a source for every record.",
    },
    {
      path: "affiliates",
      label: business ? "Affiliate programs" : "Commissions",
      icon: Megaphone,
      description:
        "Track brand affiliate activity separately from platform referral rewards.",
    },
    ...shared,
  ];
}
