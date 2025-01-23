"use client";

import React, { useState, useEffect } from 'react';
import { Home, Search, Mail, User2, Star, LogOut, Send } from 'lucide-react';

const Sidebar = ({ children, className }) => (
  <div className={`h-screen w-64 bg-white border-r ${className}`}>
    {children}
  </div>
);

const SidebarContent = ({ children }) => (
  <div className="flex flex-col">
    {children}
  </div>
);

const SidebarHeader = ({ children, className }) => (
  <div className={`p-4 border-b ${className}`}>
    {children}
  </div>
);

const SidebarMenu = ({ children, className }) => (
  <div className={`flex flex-col ${className}`}>
    {children}
  </div>
);

const SidebarSubmenu = ({ items, isOpen, onSubmenuClick, activeSubmenuItem }) => {
  if (!isOpen || !items?.length) return null;

  return (
    <div className="ml-6 mt-1 space-y-1">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 py-1 cursor-pointer group"
          onClick={(e) => {
            e.stopPropagation();
            onSubmenuClick(item);
          }}
        >
          <div className={`w-2 h-2 rounded-full ${activeSubmenuItem === item ? 'bg-cyan-300': 'bg-gray-300'}`} />
          <span className={`text-sm transition-all group-hover:text-[#FC6E62] group-hover:text-lg group-active:font-bold ${activeSubmenuItem === item ? 'font-bold' : 'font-normal'}`}>{item}</span>
        </div>
      ))}
    </div>
  );
};

const SidebarMenuItem = ({
  icon: Icon,
  label,
  submenuItems = [],
  isActive,
  isSubmenuOpen,
  onClick,
  onSubmenuClick,
  activeSubmenuItem,
  className = ""
}) => {
  const hasSubmenu = submenuItems.length > 0;
  const baseClasses = "flex items-center w-full p-2 rounded-full transition-colors hover:bg-gray-100";
  const activeClasses = isActive ? "bg-[#FC6E62] text-white hover:bg-[#FC6E62]" : "";

  return (
    <div>
      <button
        onClick={onClick}
        className={`${baseClasses} ${activeClasses} ${className}`.trim()}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        <span>{label}</span>
      </button>
      {hasSubmenu && (
        <SidebarSubmenu 
          items={submenuItems} 
          isOpen={isSubmenuOpen} 
          onSubmenuClick={onSubmenuClick}
          activeSubmenuItem={activeSubmenuItem}
        />
      )}
    </div>
  );
};

const menuItems = [
  {
    icon: Home,
    label: "home",
    submenuItems: ["recommended", "popular", "social", "career", "campus", "academic", "upcoming"]
  },
  { icon: Search, label: "search" },
  { 
    icon: Mail, 
    label: "rsvp's",
    submenuItems: ["my rsvp's", "past events"]
  },
  { icon: User2, label: "profile" },
  { icon: Send, label: "post event" },
  { icon: LogOut, label: "log out" }
];

export function SidebarNav({ onSubmenuClick, activeSubmenuItem = "recommended" }) {
  const [activeItem, setActiveItem] = useState("home");
  const [openSubmenu, setOpenSubmenu] = useState("home");

  const handleMenuClick = (label) => {
    setActiveItem(label);
    if (openSubmenu === label) {
      setOpenSubmenu(null);
    } else if (menuItems.find(item => item.label === label)?.submenuItems?.length) {
      setOpenSubmenu(label);
    } else {
      setOpenSubmenu(null);
    }
  };

  const handleSubmenuClick = (submenu) => {
    onSubmenuClick(submenu);
  };

  // Keep home menu open when it contains the active submenu
  useEffect(() => {
    const activeItemMenu = menuItems.find(item => 
      item.submenuItems?.includes(activeSubmenuItem)
    );
    if (activeItemMenu) {
      setActiveItem(activeItemMenu.label);
      setOpenSubmenu(activeItemMenu.label);
    }
  }, [activeSubmenuItem]);

  return (
    <Sidebar className="border-r text-black">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-4xl">
          <span>💊 EventPill.</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="mt-4 space-y-4 px-8">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              submenuItems={item.submenuItems}
              isActive={activeItem === item.label}
              isSubmenuOpen={openSubmenu === item.label}
              onClick={() => handleMenuClick(item.label)}
              className={item.className}
              onSubmenuClick={handleSubmenuClick}
              activeSubmenuItem={activeSubmenuItem}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}