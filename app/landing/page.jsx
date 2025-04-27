'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Head from 'next/head';
import "@/app/globals.css";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }; 

  return (
    <><div className="w-[900px] flex flex-col">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* NavBar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#a3e635]/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#a3e635] to-[#84cc16] bg-clip-text text-transparent">
              GymLense
            </span>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </button>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('problems')} className="text-white/70 hover:text-[#a3e635] transition-colors">
              Problems
            </button>
            <button onClick={() => scrollToSection('solution')} className="text-white/70 hover:text-[#a3e635] transition-colors">
              Solution
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-white/70 hover:text-[#a3e635] transition-colors">
              Pricing
            </button>
            <button onClick={() => window.location.href = '/signin'} className="bg-[#a3e635] text-black hover:bg-[#a3e635]/90 transition-colors px-4 py-2 rounded">
              Try Demo
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md p-4 space-y-4 fixed top-16 left-0 right-0 z-40">
            <button onClick={() => { scrollToSection('problems'); setMobileMenuOpen(false); }} className="w-full text-left text-white/70 hover:text-[#a3e635]">Problems</button>
            <button onClick={() => { scrollToSection('solution'); setMobileMenuOpen(false); }} className="w-full text-left text-white/70 hover:text-[#a3e635]">Solution</button>
            <button onClick={() => { scrollToSection('pricing'); setMobileMenuOpen(false); }} className="w-full text-left text-white/70 hover:text-[#a3e635]">Pricing</button>
            <button onClick={() => window.location.href = '/signin'} className="w-full bg-[#a3e635] text-black hover:bg-[#a3e635]/90 px-4 py-2 rounded">Try Demo</button>
          </div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <div id="hero" className="my-16 flex items-center justify-center bg-black relative overflow-hidden pt-16">
      {/* absolute */}
        <div className=" inset-0 bg-gradient-to-b from-[#a3e635]/10 to-transparent animate-pulse" />
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white max-w-3xl"
            >
              Transform Your Gym's{' '}
              <span className="bg-gradient-to-r from-[#a3e635] to-[#84cc16] bg-clip-text text-transparent">
                Member Experience
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/70 max-w-2xl"
            >
              AI-powered equipment scanning that helps new members succeed. Boost retention, reduce costs, and create happier gym experiences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 w-full max-w-md"
            >
              <button onClick={() => window.location.href = '/signin'} className="inline-flex items-center bg-[#a3e635] text-black hover:bg-[#a3e635]/90 px-5 py-3 rounded-lg text-lg font-medium">
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><rect width="10" height="8" x="7" y="8" rx="1"></rect>
                </svg>
                Try Demo
              </button>
              <button onClick={() => scrollToSection('pricing')} className="inline-flex items-center border border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635]/10 px-5 py-3 rounded-lg text-lg font-medium">
                View Pricing
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <section id="problems" className="py-20 bg-black  ">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Common Challenges in Modern Gyms</h2>
            <p className="text-white/70 max-w-2xl mx-auto">These issues affect both members and gym owners, leading to lost revenue and opportunities</p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 ">
            {[
              { title: 'Member Intimidation', description: '50% of new members feel lost and intimidated by unfamiliar equipment', stat: '50%' },
              { title: 'High Churn Rate', description: 'After trial period, only 10-12% of members continue their membership', stat: '88%' },
              { title: 'Costly Onboarding', description: '€9,600+ spent monthly per branch on personal coaching for newcomers', stat: '€9.6K' },
            ].map((p, idx) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <div className="bg-black/50 border border-[#a3e635]/10 p-6 backdrop-blur-lg hover:border-[#a3e635]/50 transition-colors rounded-lg h-full flex flex-col">
                  <div className="text-4xl font-bold text-[#a3e635] mb-4">{p.stat}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-white/70">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-black relative overflow-hidden ">
        {/* absolute */}
        <div className=" 
        inset-0 bg-gradient-to-b from-[#a3e635]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              The Smart Solution for Modern Gyms
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our AI-powered scanning technology transforms the gym experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                'Instant equipment identification',
                'Personalized workout recommendations',
                'Form guidance and safety tips',
                'Progress tracking and motivation',
                "Integration with your gym's app",
                'Multi-language support',
              ].map((feat) => (
                <div key={feat} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#a3e635]/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-white">{feat}</span>
                </div>
              ))}
            </div>
            <div className="bg-black/50 border border-[#a3e635]/10 backdrop-blur-lg rounded-lg">
              <div className="aspect-[9/16] rounded-lg overflow-hidden relative">
                <video 
                  className="w-full h-full object-cover rounded-lg" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  poster="/lift-unscreen.gif"
                >
                  <source src="/demo_video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-white/70 max-w-2xl mx-auto">Choose the plan that best fits your gym's needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Basic', price: '€1,000', period: 'per month / branch', features: ['Equipment scanning', 'Basic analytics', 'Email support', 'Up to 1000 active users', 'Standard integration'] },
              { name: 'Enterprise', price: '€10,000', period: 'per month / branch', features: ['Everything in Basic', 'Full API access', 'White-label solution', 'Unlimited active users', 'Priority support', 'Custom features', 'Advanced analytics'] },
            ].map((plan) => (
              <div key={plan.name} className="bg-black/50 border border-[#a3e635]/10 p-8 backdrop-blur-lg hover:border-[#a3e635]/50 transition-colors rounded-lg h-full flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#a3e635]">{plan.price}</span>
                  <span className="text-white/70 ml-2">{plan.period}</span>
                </div>
                <div className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#a3e635] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-white">{feat}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-[#a3e635] text-black hover:bg-[#a3e635]/90 py-3 rounded-lg transition-colors mt-auto">Request Demo</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-[#a3e635]/10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-bold bg-gradient-to-r from-[#a3e635] to-[#84cc16] bg-clip-text text-transparent">GymVision</h4>
              <p className="text-white/70">Transforming gym experiences through AI technology</p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Product</h5>
              <ul className="space-y-2">
                <li><a href="#features" className="text-white/70 hover:text-[#a3e635]">Features</a></li>
                <li><a href="#pricing" className="text-white/70 hover:text-[#a3e635]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Company</h5>
              <ul className="space-y-2">
                <li><a href="#about" className="text-white/70 hover:text-[#a3e635]">About</a></li>
                <li><a href="#contact" className="text-white/70 hover:text-[#a3e635]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-white/70 hover:text-[#a3e635]">Privacy Policy</a></li>
                <li><a href="#terms" className="text-white/70 hover:text-[#a3e635]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#a3e635]/10 text-center text-white/50">2023 GymVision. All rights reserved.</div>
        </div>
      </footer>
      </div>
    </>
  );
}