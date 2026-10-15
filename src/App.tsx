import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { TendersPage } from './pages/TendersPage';
import { ConsortiumsPage } from './pages/ConsortiumsPage';
import { AwardsPage } from './pages/AwardsPage';
import { CalendarPage } from './pages/CalendarPage';
import { PricingPage } from './pages/PricingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';
import { TenderDetailModal } from './components/TenderDetailModal';
import { ConsortiumBuilderModal } from './components/ConsortiumBuilderModal';
import { WorkshopRegisterModal } from './components/WorkshopRegisterModal';
import { SubscriptionUpgradeModal } from './components/SubscriptionUpgradeModal';
import { JointBiddingSimulatorModal } from './components/JointBiddingSimulatorModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Tender } from './types';

function MainApp() {
  const { tenders, activeRole } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [consortiumBuilderTender, setConsortiumBuilderTender] = useState<Tender | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [upgradePlanCode, setUpgradePlanCode] = useState<'basic' | 'premium' | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  const handleOpenTenderDetailById = (tenderId: string) => {
    const t = tenders.find(item => item.id === tenderId);
    if (t) {
      setSelectedTender(t);
    }
  };

  const handleOpenConsortiumBuilder = (tender?: Tender) => {
    if (tender) {
      setConsortiumBuilderTender(tender);
    } else {
      setConsortiumBuilderTender(tenders[0] || null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden pb-20 md:pb-0">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openRegisterModal={() => setIsRegisterModalOpen(true)}
        openSimulator={() => setIsSimulatorOpen(true)}
        openNotificationDrawer={() => setIsNotificationOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            openRegisterModal={() => setIsRegisterModalOpen(true)}
            openSimulatorModal={() => setIsSimulatorOpen(true)}
            onSelectTender={tender => setSelectedTender(tender)}
            onOpenConsortiumBuilder={tender => handleOpenConsortiumBuilder(tender)}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            openRegisterModal={() => setIsRegisterModalOpen(true)}
            openSimulatorModal={() => setIsSimulatorOpen(true)}
            onSelectTender={tender => setSelectedTender(tender)}
            onOpenConsortiumBuilder={tender => handleOpenConsortiumBuilder(tender)}
          />
        )}

        {currentTab === 'tenders' && (
          <TendersPage
            onSelectTender={tender => setSelectedTender(tender)}
            onOpenConsortiumBuilder={tender => handleOpenConsortiumBuilder(tender)}
          />
        )}

        {currentTab === 'consortiums' && (
          <ConsortiumsPage
            onSelectTender={handleOpenTenderDetailById}
            openConsortiumBuilder={() => handleOpenConsortiumBuilder()}
          />
        )}

        {currentTab === 'awards' && <AwardsPage />}

        {currentTab === 'calendar' && (
          <CalendarPage
            onSelectTender={handleOpenTenderDetailById}
            onSelectConsortium={() => setCurrentTab('consortiums')}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingPage
            onSelectPlanUpgrade={planCode => setUpgradePlanCode(planCode)}
            openRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onSelectTender={tender => setSelectedTender(tender)}
            openConsortiumBuilder={tender => handleOpenConsortiumBuilder(tender)}
            openUpgradeModal={planCode => setUpgradePlanCode(planCode)}
          />
        )}

        {currentTab === 'admin' && <AdminPage />}

        {(currentTab === 'terms' || currentTab === 'privacy' || currentTab === 'contact') && (
          <LegalPage initialSection={currentTab as any} />
        )}
      </main>

      {/* Mobile Bottom Navigation for On-the-Go Workshop Owners */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Tender Detail Modal */}
      {selectedTender && (
        <TenderDetailModal
          tender={selectedTender}
          onClose={() => setSelectedTender(null)}
          onOpenConsortiumBuilder={tender => {
            setSelectedTender(null);
            setConsortiumBuilderTender(tender);
          }}
        />
      )}

      {/* Consortium Builder Modal */}
      {consortiumBuilderTender && (
        <ConsortiumBuilderModal
          tender={consortiumBuilderTender}
          onClose={() => setConsortiumBuilderTender(null)}
          onConsortiumCreated={consortiumId => {
            setCurrentTab('consortiums');
          }}
        />
      )}

      {/* Workshop Registration Modal */}
      {isRegisterModalOpen && (
        <WorkshopRegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          onRegistered={workshop => {
            setCurrentTab('dashboard');
          }}
        />
      )}

      {/* Subscription Upgrade Modal */}
      {upgradePlanCode && (
        <SubscriptionUpgradeModal
          planCode={upgradePlanCode}
          onClose={() => setUpgradePlanCode(null)}
        />
      )}

      {/* Joint Bidding & CPO Simulator Modal */}
      {isSimulatorOpen && (
        <JointBiddingSimulatorModal
          onClose={() => setIsSimulatorOpen(false)}
          onOpenConsortiumFromSim={() => {
            setIsSimulatorOpen(false);
            handleOpenConsortiumBuilder();
          }}
        />
      )}

      {/* In-App Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateTab={tab => setCurrentTab(tab)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
