import { Link } from 'react-router-dom';
import {
  Wallet,
  PieChart,
  Target,
  Shield,
  TrendingUp,
  Smartphone,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: PieChart,
      title: 'Smart Analytics',
      description: 'Visualize your spending with beautiful charts and insights. Track expenses by category, see monthly trends, and understand where your money goes.',
      color: 'emerald',
    },
    {
      icon: Target,
      title: 'Budget Control',
      description: 'Set monthly budgets for each category and get alerts when approaching limits. Stay on top of your finances with real-time tracking.',
      color: 'blue',
    },
    {
      icon: TrendingUp,
      title: 'Financial Reports',
      description: 'Generate detailed reports to analyze your spending patterns over time. Export data to CSV for deeper analysis.',
      color: 'purple',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays yours. With end-to-end encryption and strict data isolation, your financial information is completely private.',
      color: 'red',
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Access your expense tracker from any device. The beautifully designed interface works seamlessly on desktop, tablet, and mobile.',
      color: 'orange',
    },
    {
      icon: Wallet,
      title: 'INR Support',
      description: 'Built for Indian users with full INR (Rupee) support. Track expenses in your local currency with proper formatting.',
      color: 'teal',
    },
  ];

  const colorClasses = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  };

  const benefits = [
    'Track all your expenses in one place',
    'Set and manage budgets by category',
    'Visualize spending with beautiful charts',
    'Generate detailed financial reports',
    'Dark and light mode support',
    'Secure authentication with email verification',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SpendSmart</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Free to use - No credit card required
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            SpendSmart
            <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-gray-600 dark:text-gray-400 mt-2">
              Personal Expense Tracking & Budget Management System
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Track expenses, set budgets, and gain insights into your spending habits.
            Built with simplicity and privacy in mind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-lg rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-xl shadow-emerald-500/30"
            >
              Start Tracking Free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-lg rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to manage expenses
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you understand and control your spending
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  colorClasses[feature.color as keyof typeof colorClasses]
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why choose ExpenseTrack?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We believe managing finances should be simple, private, and effective.
                Here's what makes us different:
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl shadow-emerald-500/30">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">This Month</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Rs 45,230</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Food</p>
                      <p className="font-bold text-gray-900 dark:text-white">Rs 12K</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Transport</p>
                      <p className="font-bold text-gray-900 dark:text-white">Rs 8K</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Shopping</p>
                      <p className="font-bold text-gray-900 dark:text-white">Rs 15K</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of users who are managing their expenses smarter.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold text-lg rounded-2xl hover:bg-emerald-50 transition-all shadow-xl"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SpendSmart</span>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2024 SpendSmart. Personal Expense Tracking & Budget Management System.</p>
            <p className="mt-2 text-gray-500">Created by <span className="text-emerald-400 font-medium">Ghouse</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
