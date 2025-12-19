import React from 'react';
import Sidebar from '@/components/Sidebar';
import FeedbackWidget from '@/components/FeedbackWidget';
//import OnboardingTour from '@/components/OnboardingTour';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#131314] text-gray-200">
      {/*<OnboardingTour />*/}
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <FeedbackWidget/>
        {children}
      </main>
    </div>
  );
}