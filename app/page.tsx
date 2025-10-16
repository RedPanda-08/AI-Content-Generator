import Link from 'next/link';
import { Bot, Zap, BarChart2, Lightbulb, TrendingUp, Star, Sparkles, ArrowRight, Users, Clock, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/*  Header  */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">ContentAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Log In</Link>
            <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </header>
      
      {/*Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="relative z-10 space-y-8 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-gray-300">AI-Powered Content Creation</span>
            <div className="px-2 py-0.5 bg-orange-500/20 rounded-full">
              <span className="text-xs font-semibold text-orange-400">NEW</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
            <span className="block">Create Content</span>
            <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              That Converts
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Transform your social media strategy with AI that understands your brand voice. Create engaging content in seconds, not hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link 
              href="/dashboard" 
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl font-semibold text-lg shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#demo" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold text-lg backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-200"
            >
              Watch Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              <span>1+ creators trust us</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="py-20 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-2">1</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-2">1</div>
              <div className="text-gray-400">Posts Generated</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-gray-400">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-2">4.9★</div>
              <div className="text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything you need to
              <span className="block bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                dominate social media
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful AI tools designed to streamline your content creation workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Lightning Fast Generation', desc: 'Create professional content in seconds with our advanced AI engine', color: 'from-orange-500 to-yellow-500' },
              { icon: Target, title: 'Brand Voice Matching', desc: 'AI learns your unique voice and maintains consistency across all content', color: 'from-pink-500 to-red-500' },
              { icon: BarChart2, title: 'Performance Analytics', desc: 'Get AI-powered insights to optimize your content strategy', color: 'from-purple-500 to-pink-500' },
              { icon: Clock, title: 'Schedule & Automate', desc: 'Stay organized — plan your content and never miss a day!', color: 'from-blue-500 to-cyan-500' },
              { icon: Sparkles, title: 'Multi-Platform Support', desc: 'Optimize content for Instagram, Twitter, LinkedIn, and more', color: 'from-green-500 to-emerald-500' },
              { icon: TrendingUp, title: 'Trend Analysis', desc: 'Stay ahead with real-time trending topic recommendations', color: 'from-red-500 to-orange-500' }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-shadow`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  How It Works Section  */}
      <section id="how-it-works" className="py-32 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Get started in
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> minutes</span>
            </h2>
            <p className="text-xl text-gray-400">Three simple steps to transform your content game</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            {[
              { num: '', title: 'Define Your Brand', desc: 'Set up your brand voice, tone, and content preferences in minutes', icon: Lightbulb },
              { num: '', title: 'Generate Content', desc: 'Enter a topic and watch AI create engaging posts tailored to your audience', icon: Sparkles },
              { num: '', title: 'Publish & Analyze', desc: 'Schedule posts and track performance with detailed analytics', icon: TrendingUp }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:border-orange-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-orange-500/50 relative z-10">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-white/10 absolute top-4 right-8">{step.num}</div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/*  Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-red-500/20 blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Ready to create
            <span className="block bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              amazing content?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI to transform their social media presence
          </p>
          <Link 
            href="/login" 
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl font-bold text-xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:-translate-y-1 transition-all duration-200"
          >
            Start Creating for Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-6 text-sm">No credit card required • 7-day free trial • Cancel anytime</p>
        </div>
      </section>
      
      {/*  Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">ContentAI</span>
              </div>
              <p className="text-gray-400 text-sm">Transform your content creation with AI-powered tools.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} ContentAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}