import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  ChevronDown 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { websiteSettings } = useShop();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
          About NM Shop BD
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Shop Smart, Live Better
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Delivering premium lifestyle gadgets, fashion, and home essentials to every doorstep in Bangladesh.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          Founded in Dhaka, <strong>NM Shop BD</strong> (operating at <strong>shopbd.top</strong>) is one of Bangladesh's premier multi-category e-commerce destinations. We curate 100% genuine consumer electronics, smart watches, authentic Punjabi & festive attire, beauty essentials, and modern kitchen gadgets.
        </p>

        <h3 className="text-lg font-black text-slate-900 pt-2">Our Core Commitments:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <Truck className="w-6 h-6 text-rose-600" />
            <h4 className="font-bold text-slate-900">Nationwide Reach</h4>
            <p className="text-xs text-slate-500">Fast 24-48h delivery inside Dhaka, and reliable 48-72h transit across all 64 districts in Bangladesh.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-slate-900">100% Original Products</h4>
            <p className="text-xs text-slate-500">Every item is rigorously verified for authenticity and official warranty compliance.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <RotateCcw className="w-6 h-6 text-amber-600" />
            <h4 className="font-bold text-slate-900">7-Day Replacement</h4>
            <p className="text-xs text-slate-500">Fair, straightforward return & replacement policies for your peace of mind.</p>
          </div>
        </div>

        <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 mt-6">
          <p className="text-xs text-rose-900 font-medium">
            <strong>Headquarters:</strong> {websiteSettings.address} <br />
            <strong>Official Helpline:</strong> {websiteSettings.phone} • <strong>Email:</strong> {websiteSettings.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { websiteSettings, showToast } = useShop();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been sent to our customer care team!', 'success');
    setForm({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact Customer Care</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have an inquiry about an order or product? We're available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Contact Information</h3>
          
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{websiteSettings.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{websiteSettings.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{websiteSettings.email}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <a 
              href={`https://wa.me/${websiteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Send Us a Direct Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Your Full Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tanvir Hasan"
                  className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Subject</label>
              <input 
                type="text" 
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="Order Inquiry / Product Question"
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Message</label>
              <textarea 
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help you today?"
                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-rose-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does delivery take across Bangladesh?',
      a: 'Inside Dhaka city, orders are typically delivered within 24 to 48 hours. For destinations outside Dhaka across all 64 districts, delivery takes between 48 to 72 hours via our partnered express couriers (Steadfast, RedX, Pathao).'
    },
    {
      q: 'Can I pay via Cash on Delivery (COD)?',
      a: 'Yes! We support 100% Cash on Delivery nationwide. You can inspect the package exterior upon arrival and pay cash directly to the delivery courier agent.'
    },
    {
      q: 'How do I pay using bKash, Nagad, or Rocket?',
      a: 'During checkout, select your preferred mobile banking method. You will receive the merchant/personal wallet number. Send the exact grand total and paste the generated Transaction ID (TrxID) in the provided box to instantly confirm your order.'
    },
    {
      q: 'What is your return and replacement policy?',
      a: 'We offer a 7-day hassle-free replacement warranty for defective, damaged, or mismatched products. Please record a brief video while unboxing your parcel and contact our hotline at +880 1700-000000 within 48 hours.'
    },
    {
      q: 'Are all products sold on Shop BD genuine?',
      a: 'Absolutely. We source all electronics, fashion, and home appliances directly from certified distributors, official brand outlets, and authorized importers.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-slate-500">Everything you need to know about shopping on Shop BD</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180 text-rose-600' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{ type: 'shipping' | 'return' | 'refund' | 'cancellation' | 'terms' | 'privacy' }> = ({ type }) => {
  const titles = {
    shipping: 'Shipping & Delivery Policy',
    return: '7-Day Return & Replacement Policy',
    refund: 'Refund & Settlement Policy',
    cancellation: 'Order Cancellation Policy',
    terms: 'Terms & Conditions of Service',
    privacy: 'Privacy Policy'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{titles[type]}</h1>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>
          Welcome to <strong>NM Shop BD</strong> (accessible via <strong>shopbd.top</strong>). We are committed to transparency, customer satisfaction, and safe e-commerce practices in Bangladesh.
        </p>

        {type === 'shipping' && (
          <>
            <h3 className="font-bold text-slate-900 text-base">Delivery Charges & Timelines:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Inside Dhaka Metro:</strong> Standard charge is ৳60. Typical delivery window: 24 to 48 business hours.</li>
              <li><strong>Outside Dhaka (64 Districts):</strong> Standard charge is ৳120. Typical delivery window: 48 to 72 business hours.</li>
              <li><strong>Free Delivery:</strong> Orders exceeding ৳2,000 qualify for nationwide zero delivery charges automatically.</li>
            </ul>
          </>
        )}

        {type === 'return' && (
          <>
            <h3 className="font-bold text-slate-900 text-base">Replacement Criteria:</h3>
            <p>
              Customers may request a replacement within 7 calendar days of parcel receipt if the product has manufacturing defects, physical transit damage, or does not match the product page specifications.
            </p>
          </>
        )}

        {type === 'refund' && (
          <>
            <h3 className="font-bold text-slate-900 text-base">Refund Methods:</h3>
            <p>
              Refunds for cancelled or returned orders paid via bKash, Nagad, Rocket, or Credit Card are disbursed back to the original funding account within 3 to 7 working days.
            </p>
          </>
        )}

        {type === 'terms' && (
          <>
            <h3 className="font-bold text-slate-900 text-base">Governing Jurisdiction:</h3>
            <p>
              These Terms and Conditions are governed by the Consumer Rights Protection Act of Bangladesh and applicable e-commerce guidelines issued by the Ministry of Commerce.
            </p>
          </>
        )}

        {type === 'privacy' && (
          <>
            <h3 className="font-bold text-slate-900 text-base">Data Protection:</h3>
            <p>
              We prioritize your privacy. Customer names, delivery addresses, and phone numbers are encrypted and utilized solely to facilitate delivery logistics and SMS tracking notifications.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
