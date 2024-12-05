"use client";

import { NavUser } from "./nav-user";
import { SidebarTrigger } from "./ui/sidebar";
import { NotificationsBell } from "./nav-notificationbell";
import { SearchBar } from "./nav-search";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-4">
        <SidebarTrigger />
        <div className="flex items-center space-x-6">
          <SearchBar />
          <NotificationsBell />
          <ModeToggle />
          <NavUser
            user={{
              name: "Esmaeil MIRZAEE",
              email: "",
              avatar: "",
            }}
          />
        </div>
      </div>
    </header>
  );
}
