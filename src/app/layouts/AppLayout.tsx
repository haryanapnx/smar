import { Outlet } from 'react-router-dom';
import { AppFooter } from '@/app/components/AppFooter';
import { AppHeader } from '@/app/components/AppHeader';

export const AppLayout = () => (
  <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,_rgba(219,234,254,.7),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#f1f6fb_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(30,64,175,.2),_transparent_34%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]">
    <AppHeader />
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
    <AppFooter />
  </div>
);
