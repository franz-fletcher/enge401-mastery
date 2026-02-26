'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { chapters } from '@/lib/chapters';

interface BreadcrumbSegment {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [
    { label: 'Home', href: '/' },
  ];

  // Remove empty segments and split
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    segments[0].isCurrent = true;
    return segments;
  }

  let currentPath = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath += `/${part}`;

    // Handle special routes
    if (part === 'practice') {
      if (parts[i - 1] && parts[i - 1].startsWith('chapter-')) {
        // Chapter practice - already added chapter, just update label
        continue;
      }
      segments.push({
        label: 'Practice',
        href: currentPath,
        isCurrent: i === parts.length - 1,
      });
    } else if (part === 'dashboard') {
      segments.push({
        label: 'Dashboard',
        href: currentPath,
        isCurrent: i === parts.length - 1,
      });
    } else if (part === 'chapter') {
      // Next part should be chapter slug
      continue;
    } else if (part.startsWith('chapter-') || parts[i - 1] === 'chapter') {
      // Find chapter by slug
      const chapter = chapters.find(
        (c) => c.slug === part || c.slug === part.replace('chapter-', '')
      );
      
      if (chapter) {
        segments.push({
          label: `Chapter ${chapter.id}`,
          href: currentPath,
          isCurrent: i === parts.length - 1 && parts[i + 1] !== 'practice',
        });

        // Check if next segment is practice
        if (parts[i + 1] === 'practice') {
          segments.push({
            label: 'Practice',
            href: `${currentPath}/practice`,
            isCurrent: i + 1 === parts.length - 1,
          });
          i++; // Skip the practice segment
        }
      } else {
        segments.push({
          label: part.charAt(0).toUpperCase() + part.slice(1),
          href: currentPath,
          isCurrent: i === parts.length - 1,
        });
      }
    } else if (part === 'review') {
      segments.push({
        label: 'Review',
        href: currentPath,
        isCurrent: i === parts.length - 1,
      });
    } else {
      // Generic segment
      const label = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      segments.push({
        label,
        href: currentPath,
        isCurrent: i === parts.length - 1,
      });
    }
  }

  // Mark last segment as current if not already marked
  if (segments.length > 0 && !segments[segments.length - 1].isCurrent) {
    segments[segments.length - 1].isCurrent = true;
  }

  return segments;
}

export function BreadcrumbNavigation() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((segment, index) => (
          <React.Fragment key={segment.label + index}>
            <BreadcrumbItem>
              {segment.isCurrent ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={segment.href || '/'}>
                    {index === 0 ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      segment.label
                    )}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
