
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  Package,
  Tags,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "نمای کلی",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "سفارش‌ها",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "محصولات",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "دسته‌بندی‌ها",
    url: "/dashboard/categories",
    icon: Tags,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
      <Sidebar side="right" collapsible="icon" dir="rtl">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="size-5" />
            </div>

            <div className="grid flex-1 text-right text-sm leading-tight">
              <span className="truncate font-bold">فروشگاه من</span>
              <span className="truncate text-xs text-muted-foreground">
              پنل مدیریت
            </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>منوی اصلی</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const isActive =
                      pathname === item.url ||
                      (item.url !== "/dashboard" &&
                          pathname.startsWith(`${item.url}/`));

                  return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                            render={<Link href={item.url} />}
                            isActive={isActive}
                            tooltip={item.title}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <p className="px-2 py-2 text-xs text-muted-foreground">
            مدیریت فروشگاه
          </p>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
  );
}
