import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { SupportModal } from './components/SupportModal';
import { ProductShareModal } from './components/ProductShareModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage, RegisterPage, ProfilePage } from './pages/AuthPages';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage, ContactPage, FaqPage, PolicyPage } from './pages/StaticPages';
import { Phone, MessageCircle, Headphones } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, currentParam, websiteSettings, setIsSupportModalOpen } = useShop();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, currentParam]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'flash-sale':
        return <ShopPage initialTag="flash-sale" />;
      case 'new-arrivals':
        return <ShopPage initialTag="new-arrivals" />;
      case 'trending':
        return <ShopPage initialTag="trending" />;
      case 'best-sellers':
        return <ShopPage initialTag="best-sellers" />;
      case 'collections':
        return <ShopPage />;
      case 'category':
        return <ShopPage initialCategory={currentParam || undefined} />;
      case 'search':
        return <ShopPage />;
      case 'product':
        return <ProductDetailsPage productId={currentParam || ''} />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage orderNumber={currentParam || ''} />;
      case 'track-order':
        return <TrackOrderPage initialOrderNumber={currentParam || undefined} />;
      case 'my-orders':
        return <MyOrdersPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'contact':
      case 'support':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'shipping-policy':
        return <PolicyPage type="shipping" />;
      case 'return-policy':
        return <PolicyPage type="return" />;
      case 'refund-policy':
        return <PolicyPage type="refund" />;
      case 'cancellation-policy':
        return <PolicyPage type="cancellation" />;
      case 'terms':
        return <PolicyPage type="terms" />;
      case 'privacy-policy':
        return <PolicyPage type="privacy" />;
      default:
        return <HomePage />;
    }
  };

  // Completely isolated Standalone Admin Portal layout (no customer header, footer, cart drawer or public popups)
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 font-sans selection:bg-rose-500 selection:text-white admin-portal-wrapper">
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
      {/* Universal Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* 3-Channel Support Modal (WhatsApp, Messenger, Phone Call) */}
      <SupportModal />

      {/* Real-Domain Product Share Modal */}
      <ProductShareModal />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Floating 24/7 Support Quick Action Button */}
      <button
        type="button"
        onClick={() => setIsSupportModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 cursor-pointer"
        title="24/7 Customer Support (WhatsApp, Messenger, Phone)"
        aria-label="Customer Support"
      >
        <Headphones className="w-6 h-6 text-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold px-0 group-hover:px-1.5">
          24/7 Support
        </span>
      </button>
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;
