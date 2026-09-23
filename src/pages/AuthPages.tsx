import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  LogOut,
  Package
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LoginPage: React.FC = () => {
  const { login, navigateTo, showToast } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    login(email.trim());
    navigateTo('home');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Shop BD</h1>
          <p className="text-xs text-slate-500">Access your orders, wishlist, and profile</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@shopbd.top"
                className="w-full text-xs p-3 pl-9 rounded-xl border border-slate-300 outline-none focus:border-rose-500 text-slate-900 bg-white"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 pl-9 rounded-xl border border-slate-300 outline-none focus:border-rose-500 text-slate-900 bg-white"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don't have an account? </span>
          <button 
            type="button" 
            onClick={() => navigateTo('register')} 
            className="font-bold text-rose-600 hover:underline"
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { login, navigateTo, showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showToast('Please fill out all registration fields', 'error');
      return;
    }

    login(email.trim());
    showToast('Registration successful! Welcome to Shop BD.', 'success');
    navigateTo('home');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Shop BD Account</h1>
          <p className="text-xs text-slate-500">Join thousands of smart shoppers in Bangladesh</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Asif Mahmud"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number (01XXXXXXXXX)
            </label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-none focus:border-rose-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 outline-none focus:border-rose-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-rose-600/20"
          >
            Create Account & Get ৳100 Off
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already registered? </span>
          <button 
            type="button" 
            onClick={() => navigateTo('login')} 
            className="font-bold text-rose-600 hover:underline"
          >
            Sign In here
          </button>
        </div>

      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, navigateTo } = useShop();

  if (!currentUser) {
    navigateTo('login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 font-black text-2xl flex items-center justify-center">
            {currentUser.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{currentUser.displayName}</h1>
            <p className="text-xs text-slate-500">{currentUser.email} • {currentUser.phoneNumber || '+880 1712-345678'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {currentUser.role === 'admin' ? 'Administrator' : 'Customer Account'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigateTo('my-orders')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-rose-400 transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Orders & Invoices</h3>
            <p className="text-xs text-slate-500">Track current shipments and view history</p>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('wishlist')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-rose-400 transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Saved Wishlist</h3>
            <p className="text-xs text-slate-500">Items you loved and saved for later</p>
          </div>
        </div>
      </div>
    </div>
  );
};
