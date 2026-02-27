import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarLeft } from '@/components/sidebar-left';
import { SidebarRight } from '@/components/sidebar-right';
import { BreadcrumbNavigation } from '@/components/breadcrumb-navigation';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'ENGE401 Mastery',
  description: 'Interactive Engineering Mathematics — AUT ENGE401',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <SidebarLeft />
              <SidebarInset>
                <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <BreadcrumbNavigation />
                  <div className="ml-auto">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 p-4">{children}</main>
              </SidebarInset>
              <SidebarRight />
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
