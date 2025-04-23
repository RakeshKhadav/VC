import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

import { ClerkProvider } from '@clerk/nextjs'

export default function Home() {
  return (
    <ClerkProvider>
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Bringing Transparency to Venture Capital
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A trusted platform for founders to rate and review VCs anonymously.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <SignedOut>
                <Link 
                  href="/sign-up" 
                  className="px-6 py-3 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Write a Review
                </Link>
                
                <Link 
                  href="/sign-up" 
                  className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Explore Reviews
                </Link>
              </SignedOut>
              
              <SignedIn>
                <Link 
                  href="/reviews/new"
                  className="px-6 py-3 rounded-md bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Write a Review
                </Link>
                
                <Link 
                  href="/reviews"
                  className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Explore Reviews
                </Link>
              </SignedIn>
            </div>
          </div>
          <div className="flex-1 relative h-64 md:h-96 w-full">
            {/* Placeholder for hero illustration */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-32 h-32 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-5-7h10v-2H7v2zm0-4h10V7H7v2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Why It Matters Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Why It Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lack of Transparency",
                description: "The VC world operates behind closed doors.",
              },
              {
                title: "Backchannel DMs",
                description: "Founders rely on private messages to assess investors.",
              },
              {
                title: "Unreported Experiences",
                description: "Negative experiences often go unreported.",
              },
              {
                title: "Founders Need a Voice",
                description: "Founders deserve transparency and accountability.",
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up & Verify",
                description: "Sign up & verify your identity confidentially.",
              },
              {
                step: "2",
                title: "Submit Reviews",
                description: "Submit anonymized reviews of VCs.",
              },
              {
                step: "3",
                title: "Browse Insights",
                description: "Browse insights & find the right partner.",
              },
              {
                step: "4",
                title: "Build Reputations",
                description: "VCs can respond & build better reputations.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-6 left-16 w-[calc(100%-2rem)] h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Anonymous & Verified Reviews",
                description: "Share your experiences without revealing your identity, while our verification process ensures all reviews are from actual founders.",
              },
              {
                title: "Comprehensive Ratings",
                description: "Rate VCs on multiple criteria: responsiveness, fairness, support, and more.",
              },
              {
                title: "Community-driven Transparency",
                description: "Contribute to a more transparent ecosystem that benefits all founders.",
              },
              {
                title: "Optional Q&A",
                description: "Ask questions and get insights from other founders about their experiences.",
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Community Voices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform gave me the confidence to choose the right investors for my startup. The transparency is game-changing.",
                author: "Sarah J., Founder",
              },
              {
                quote: "I wish I had this resource when I was raising my seed round. It would have saved me from some painful investor relationships.",
                author: "Michael T., CEO",
              },
              {
                quote: "As someone who values honest feedback, I appreciate being able to see authentic reviews from other founders.",
                author: "Alex R., Entrepreneur",
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{item.quote}"</p>
                <p className="font-medium">{item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-20 px-4 md:px-8 bg-black dark:bg-white text-white dark:text-black">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Join the Founder Community</h2>
          <p className="text-xl text-gray-300 dark:text-gray-700">
            Help build transparency in venture capital while finding the right partners for your startup.
          </p>
          <div className="pt-4">
            <SignedOut>
              <Link 
                href="/sign-up" 
                className="inline-block px-8 py-4 rounded-md bg-white dark:bg-black text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/reviews/new"
                className="inline-block px-8 py-4 rounded-md bg-white dark:bg-black text-black dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
              >
                Write Your First Review
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>
    </div>
    </ClerkProvider>
  );
}