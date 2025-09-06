"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";
import {
  ShoppingCart,
  Package,
  BookOpen,
  History,
  Settings,
  Menu,
  X,
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  purchaseItemCount?: number;
}

const navigationItems = [
  {
    id: "catalog",
    label: "Catalog",
    icon: Package,
  },
  {
    id: "purchase-list",
    label: "My List",
    icon: ShoppingCart,
    showCount: true,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Navigation({
  activeTab,
  onTabChange,
  purchaseItemCount = 0,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6 pt-16 lg:pt-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Grocery Manager</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your shopping lists
            </p>
          </div>

          <nav className="flex-1 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showCount = item.showCount && purchaseItemCount > 0;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleTabChange(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {showCount && (
                    <Badge variant="secondary" className="ml-auto">
                      {purchaseItemCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>
          {/* Centered theme toggle above border */}
          <div className="py-4 justify-center flex">
            <ThemeToggle />
          </div>
          <div className="mt-auto pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <p>Grocery Manager v1.0</p>
              <p className="mt-1">Built with Next.js & Prisma</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
