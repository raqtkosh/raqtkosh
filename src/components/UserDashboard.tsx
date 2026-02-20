'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Dialog } from '@headlessui/react';
import { User } from 'lucide-react';
import { 
  Bell,
  Gift,
  Share2,
  Calendar,
  Droplet,
  HeartPulse,
  X,
  ChevronDown,
  AlertCircle
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
    <div className="bg-gray-100 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
      {!userData.canDonate && (
        <div className="mb-4 rounded-lg border-l-4 border-yellow-400 bg-yellow-100 p-3 shadow-sm sm:mb-5 sm:p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-700" />
            <p className="ml-2 text-yellow-700">
              You can donate again after {userData.nextDonationDate}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-4 md:space-y-5 lg:max-w-7xl lg:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm md:p-5 lg:p-6">
          <div>
            <h1 className="text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl">Welcome, {user?.firstName || 'Donor'}</h1>
            <p className="text-gray-600">Thank you for being a life-saver!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hero Status Card */}
        <section className={sectionFrame}>
          <div className="px-4 pt-4 sm:px-5 lg:px-6 lg:pt-5">
            <h2 className="text-lg font-semibold text-gray-800">Your Donor Status</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 sm:gap-4 sm:p-5 md:grid-cols-3 lg:p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">{userData.points} Royalty Points</span>
                  <p className="text-sm text-gray-500">
                    {userData.nextReward > 0 
                      ? `${userData.nextReward} pts to ${userData.rewardTier} tier`
                      : `You've reached ${userData.rewardTier} tier!`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                  <Droplet className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">Blood Type: {userData.bloodType || 'Unknown'}</span>
                  <p className="text-sm text-gray-500">{userData.healthStatus} donor health</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">Next donation: {userData.nextDonationDate}</span>
                  <p className="text-sm text-gray-500">Last donated: {userData.lastDonation}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Button 
            variant="outline"
            className="h-12 border border-gray-300 bg-white hover:border-red-300 hover:bg-red-50 sm:h-14 lg:h-16"
            onClick={() => router.push(userData.canDonate ? '/dashboard/user/donateblood' : '#')}
            disabled={!userData.canDonate}
          >
            <div className="flex items-center gap-2 text-red-600">
              <Droplet className="h-5 w-5" />
              <span>Donate Now</span>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="h-12 border border-gray-300 bg-white hover:border-red-300 hover:bg-red-50 sm:h-14 lg:h-16"
            onClick={() => router.push('/dashboard/user/request-blood')}
          >
            <div className="flex items-center gap-2 text-red-600">
              <HeartPulse className="h-5 w-5" />
              <span>Request Blood</span>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="h-12 border border-gray-300 bg-white hover:border-red-300 hover:bg-red-50 sm:h-14 lg:h-16"
            onClick={() => router.push('/dashboard/user/profile')}
          >
            <div className="flex items-center gap-2 text-red-600">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="h-12 border border-gray-300 bg-white hover:border-red-300 hover:bg-red-50 sm:h-14 lg:h-16"
            onClick={() => router.push('/dashboard/user/refer')}
          >
            <div className="flex items-center gap-2 text-red-600">
              <Share2 className="h-5 w-5" />
              <span>Refer Friends</span>
            </div>
          </Button>
        </div>

        {/* Stats Widgets */}
        <section className={`${sectionFrame} p-4 sm:p-5 lg:p-6`}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">
            <div>
              <p className="text-gray-500 text-sm">Total Requests Completed</p>
              <p className="text-2xl font-semibold text-gray-800 lg:text-3xl">{userData.totalDonations}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Lives Impacted</p>
              <p className="text-2xl font-semibold text-gray-800 lg:text-3xl">{userData.totalDonations * 1}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Current Tier</p>
              <p className="text-2xl font-semibold text-gray-800 lg:text-3xl">{userData.rewardTier}</p>
            </div>
          </div>
        </section>

        {userData.bloodType?.toLowerCase() !== 'unknown' && (
  <div className="space-y-3 sm:space-y-4">
    {recommendedActions.map((action, index) => (
      <section 
        key={index} 
        className={`${sectionFrame} border-l-4 ${
          action.urgency === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'
        }`}
      >
        <div className="px-4 pt-4 sm:px-5 lg:px-6 lg:pt-5">
          <h3 className="text-lg flex items-center gap-2 text-gray-800 font-semibold">
            <Bell className="h-5 w-5" />
            {action.title}
          </h3>
        </div>
        <div className="px-4 pb-4 sm:px-5 lg:px-6 lg:pb-5">
          <Button 
            variant={action.urgency === 'high' ? 'destructive' : 'outline'}
            className={action.urgency !== 'high' ? 'border-red-300 bg-white hover:bg-red-50 text-red-600' : ''}
            onClick={() => router.push('/dashboard/user/donateblood/home')}
          >
            {action.urgency === 'high' ? 'DONATE' : 'Learn More'}
          </Button>
        </div>
      </section>
    ))}
  </div>
)}

        {/* Upcoming Events */}
        <section className={sectionFrame}>
  <div className="px-4 pt-4 sm:px-5 lg:px-6 lg:pt-5">
    <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
  </div>
  <div className="space-y-3 p-4 sm:space-y-4 sm:p-5 lg:p-6">
    {upcomingEvents.map((event, index) => (
      <div key={index} className="flex items-start gap-4">
        <div className="bg-gray-200 rounded-lg p-3 flex flex-col items-center min-w-[60px]">
          <span className="text-sm font-medium text-gray-700">{event.date}</span>
          {event.points > 0 && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mt-1">
              +{event.points}pts
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{event.title}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 border-red-300 bg-white hover:bg-red-50 text-red-600"
            onClick={() => handleAddToGoogleCalendar(event.date, event.title)}
          >
            Add to Google Calendar
          </Button>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* Help Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm sm:p-5 lg:p-6">
          <p className="mb-2 text-gray-700">
            Need help?{' '}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=support@raqtkosh.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:underline font-medium"
            >
              Contact us at support@raqtkosh.com
            </a>
          </p>
          <p className="mt-4 text-gray-700">
            Learn more about blood donation{' '}
            <button
              onClick={() => setIsFAQOpen(true)}
              className="text-red-600 hover:underline font-medium"
            >
              here
            </button>
            .
          </p>
        </div>

        {/* Complete Profile Dialog */}
        {showCompleteProfileDialog && (
          <Dialog open={showCompleteProfileDialog} onClose={() => setShowCompleteProfileDialog(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">Complete Your Profile</Dialog.Title>
                <Dialog.Description className="text-gray-600 mb-6">
                  Thankyou for being a valued donor! 
                  To ensure we can provide you with the best experience, please complete your profile by adding your blood type and other details. This will help us match you with donation opportunities and rewards tailored to you.
              
                </Dialog.Description>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowCompleteProfileDialog(false)}
                  >
                    Later
                  </Button>
                  <Button 
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

        {/* FAQ Dialog */}
        <Dialog open={isFAQOpen} onClose={() => setIsFAQOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl relative">
              <button
                onClick={() => setIsFAQOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>

              <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</Dialog.Title>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="flex justify-between w-full text-left font-medium text-gray-800 hover:text-red-600"
                    >
                      {faq.question}
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <p className="text-gray-600 mt-2 pl-2">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Still curious? Visit{' '}
                <a
                  href="https://www.who.int/campaigns/world-blood-donor-day"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline font-medium"
                >
                  WHO Blood Donation Info
                </a>
                .
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
