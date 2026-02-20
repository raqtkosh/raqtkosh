'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Dialog } from '@headlessui/react';
import {
  Bell,
  Gift,
  Share2,
  Calendar,
  Droplet,
  HeartPulse,
  X,
  ChevronDown,
  AlertCircle,
  User,
  Award,
} from 'lucide-react';
import { useState, useEffect } from 'react';

type UserData = {
  points: number;
  bloodType: string;
  nextDonationDate: string;
  totalDonations: number;
  livesImpacted: number;
  rewardTier: string;
  nextReward: number;
  healthStatus: string;
  lastDonation: string;
  canDonate: boolean;
};

export default function UserDashboard({ userData }: { userData: UserData }) {
  const { user } = useUser();
  const router = useRouter();
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showCompleteProfileDialog, setShowCompleteProfileDialog] = useState(false);

  useEffect(() => {
    if (!userData.bloodType || userData.bloodType.toLowerCase() === 'unknown') {
      setShowCompleteProfileDialog(true);
    }
  }, [userData.bloodType]);

  const faqs = [
    {
      question: '🩸 Who can donate blood?',
      answer: 'Anyone aged 18–65, weighing over 50 kg, and in good health can donate blood.',
    },
    {
      question: '⏳ How often can I donate?',
      answer: 'Men can donate every 3 months, women every 4 months.',
    },
    {
      question: '🛡️ Is blood donation safe?',
      answer: 'Yes, all needles and bags are sterile and used only once.',
    },
    {
      question: '💧 How much blood is taken?',
      answer: 'Usually 350–450 ml, which your body replaces quickly.',
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleAddToGoogleCalendar = (eventDate: string, eventTitle: string) => {

    const startDate = new Date(eventDate);
    const startDateString = startDate.toISOString().replace(/-|:|\.\d+/g, "");


    const googleCalendarURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateString}%2F${startDateString}&details=Add%20this%20event%20to%20your%20calendar&location=Online&trp=false`;


    window.open(googleCalendarURL, '_blank');
  };

  const upcomingEvents = [
    { date: 'June 3', title: 'Community Blood Drive', points: 500 },
    { date: 'June 20', title: 'Community Blood Drive', points: 500 },
  ];

  const recommendedActions = userData.bloodType ? [
    {
      title: `Your ${userData.bloodType} is in high demand at local hospitals`,
      urgency: userData.canDonate ? 'high' : 'medium'
    },
  ] : [];
  const sectionFrame = 'bg-white border border-gray-200 rounded-lg shadow-sm';

  return (
    <div className="flex-1 bg-gray-50 h-full p-4 lg:p-6">
      <div className="mx-auto w-full max-w-[1920px] space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName || 'Donor'} 👋</h1>
            <p className="text-gray-600 mt-1">Thank you for being a life-saver!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>

        {/* Alerts Section (Full Width) */}
        {!userData.canDonate && (
          <div className="rounded-xl border-l-4 border-yellow-400 bg-yellow-50 p-4 shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-700" />
              <p className="ml-3 text-sm font-medium text-yellow-700">
                You can donate again after <span className="font-bold">{userData.nextDonationDate}</span>
              </p>
            </div>
          </div>
        )}

        {userData.bloodType?.toLowerCase() !== 'unknown' && recommendedActions.length > 0 && (
          <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-red-600 animate-pulse" />
                <div>
                  <h3 className="font-semibold text-red-900">{recommendedActions[0].title}</h3>
                  <p className="text-sm text-red-700">Urgency: {recommendedActions[0].urgency.toUpperCase()}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                onClick={() => router.push('/dashboard/user/donateblood/home')}
              >
                Donate Now
              </Button>
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (Stats & Impact) - Spans 2 cols */}
          <div className="lg:col-span-2 space-y-8">

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Points Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Royalty Points</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{userData.points}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {userData.nextReward > 0
                        ? `${userData.nextReward} pts to ${userData.rewardTier}`
                        : `Tier: ${userData.rewardTier}`}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-red-600">
                    <Gift className="h-6 w-6" />
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              {/* Blood Type Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Type</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{userData.bloodType || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <HeartPulse className="h-3.5 w-3.5" />
                      {userData.healthStatus} Health
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-red-600">
                    <Droplet className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Next Donation Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Donation</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{userData.nextDonationDate}</h3>
                    <p className="text-xs text-gray-400 mt-1">Last: {userData.lastDonation}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Impact Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lives Impacted</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{userData.livesImpacted}</h3>
                    <p className="text-sm text-gray-500 mt-1">{userData.totalDonations} Donations total</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-green-600">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">View All</Button>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 text-center bg-gray-100 rounded-lg p-2">
                      <span className="block text-xs font-bold text-gray-500 uppercase">{event.date.split(' ')[0]}</span>
                      <span className="block text-xl font-bold text-gray-900">{event.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          +{event.points} pts
                        </span>
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-200 hover:text-red-600 hover:border-red-200"
                        onClick={() => handleAddToGoogleCalendar(event.date, event.title)}
                      >
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Quick Actions & Help) - Spans 1 col */}
          <div className="lg:col-span-1 space-y-8">

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  className={`w-full justify-start h-12 text-left ${userData.canDonate ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 text-gray-400'}`}
                  onClick={() => router.push(userData.canDonate ? '/dashboard/user/donateblood' : '#')}
                  disabled={!userData.canDonate}
                >
                  <Droplet className="mr-3 h-5 w-5" />
                  Donate Blood
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-left text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={() => router.push('/dashboard/user/request-blood')}
                >
                  <HeartPulse className="mr-3 h-5 w-5" />
                  Request Blood
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-left text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => router.push('/dashboard/user/profile')}
                >
                  <User className="mr-3 h-5 w-5" />
                  Update Profile
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-left text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => router.push('/dashboard/user/refer')}
                >
                  <Share2 className="mr-3 h-5 w-5" />
                  Refer a Friend
                </Button>
              </div>
            </div>

            {/* My Badges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">My Badges</h2>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">View All</Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-yellow-100 rounded-full mb-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center">Life Saver</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Widget */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <h2 className="text-lg font-bold relative z-10">Need Assistance?</h2>
              <p className="text-gray-300 text-sm mt-2 relative z-10">
                Our support team is available 24/7 to help you with any blood donation related queries.
              </p>
              <div className="mt-6 flex flex-col gap-3 relative z-10">
                <a
                  href="mailto:support@raqtkosh.com"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                >
                  Contact Support
                </a>
                <button
                  onClick={() => setIsFAQOpen(true)}
                  className="text-sm text-gray-300 hover:text-white underline text-center"
                >
                  Read FAQs
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Dialogs */}
        {showCompleteProfileDialog && (
          <Dialog open={showCompleteProfileDialog} onClose={() => setShowCompleteProfileDialog(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</Dialog.Title>
                <Dialog.Description className="text-gray-600 mb-6">
                  Please complete your profile to unlock all features. We need your blood type to match you with donation requests.
                </Dialog.Description>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCompleteProfileDialog(false)} className="text-gray-700">
                    Later
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      router.push('/dashboard/user/profile');
                      setShowCompleteProfileDialog(false);
                    }}
                  >
                    Complete Profile
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}

        <Dialog open={isFAQOpen} onClose={() => setIsFAQOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl relative">
              <button
                onClick={() => setIsFAQOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</Dialog.Title>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      {faq.question}
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

      </div>
    </div>
  );
}
