'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Calculator,
  ChevronRight,
  FileText,
  Flame,
  History,
  Home,
  LayoutDashboard,
  Library,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { chapters } from '@/lib/chapters';
import { useStats } from '@/hooks/use-stats';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// Navigation items for main menu
const mainNavItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Practice',
    url: '/practice',
    icon: BookOpen,
  },
  {
    title: 'Review',
    url: '/review',
    icon: History,
  },
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
];

// Chapter progress (mock data - would come from database)
const chapterProgress: Record<number, number> = {
  1: 75,
  2: 45,
  3: 20,
  4: 0,
  5: 0,
  6: 0,
};

export function SidebarLeft() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { stats, isLoading: statsLoading } = useStats();
  const { state } = useSidebar();

  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const isLoading = status === 'loading';

  return (
    <Sidebar side="left" variant="inset" collapsible="icon" data-testid="sidebar-left">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ENGE401</span>
                  <span className="truncate text-xs">Mastery</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chapters Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Chapters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapters.map((chapter) => (
                <Collapsible
                  key={chapter.id}
                  asChild
                  defaultOpen={pathname.startsWith(`/chapter/${chapter.id}`)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={chapter.title}>
                        <Library className="size-4" />
                        <span className="truncate">Ch {chapter.id}: {chapter.title}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {/* Progress indicator */}
                        <SidebarMenuSubItem>
                          <div className="px-2 py-1.5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{chapterProgress[chapter.id]}%</span>
                            </div>
                            <Progress value={chapterProgress[chapter.id]} className="h-1.5" />
                          </div>
                        </SidebarMenuSubItem>

                        {/* Theory link */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/chapter/${chapter.id}`}
                          >
                            <Link href={`/chapter/${chapter.id}`}>
                              <FileText className="size-3.5" />
                              <span>Theory</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Practice link */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/chapter/${chapter.id}/practice`}
                          >
                            <Link href={`/chapter/${chapter.id}/practice`}>
                              <Calculator className="size-3.5" />
                              <span>Practice</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Review link with badge */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/chapter/${chapter.id}/review`}
                          >
                            <Link href={`/chapter/${chapter.id}/review`}>
                              <RotateCcw className="size-3.5" />
                              <span>Review</span>
                              {stats.reviewsDue > 0 && (
                                <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1 text-[10px]">
                                  {stats.reviewsDue}
                                </Badge>
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter data-testid="sidebar-footer">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {isLoading && !user ? (
                    <>
                      <span className="truncate font-semibold">Loading...</span>
                      <span className="truncate text-xs text-muted-foreground">Please wait</span>
                    </>
                  ) : (
                    <>
                      <span className="truncate font-semibold" data-testid="user-name">
                        {user?.name || user?.email || 'Anonymous'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground" data-testid="user-status">
                        {user?.anonymousId ? 'Guest User' : 'Signed In'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Quick streak indicator */}
          {state === 'expanded' && (
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Flame className="size-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">
                  {statsLoading ? (
                    <Skeleton className="h-3 w-16" />
                  ) : (
                    <>
                      <span className="font-medium text-foreground">{stats.streak}</span> day streak
                    </>
                  )}
                </span>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
