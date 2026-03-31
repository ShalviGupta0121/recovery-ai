import { AlertTriangle, LayoutDashboard, Users } from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Patients", icon: Users, to: "/patients" },
  { label: "Alerts", icon: AlertTriangle, to: "/alerts" }
];
