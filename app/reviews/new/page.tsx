"use client";

import { useUser } from "@clerk/nextjs";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubmitReviewPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedVC, setSelectedVC] = useState(searchParams?.get("vc") || "");
  
  // Extract VC name from URL if provided - fixed by using useSearchParams hook
  const vcSlug = searchParams?.get("vc") || undefined;
  
  // Redirect if not logged in
  useEffect(() => {
    if (isLoaded && !isSignedIn && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router, isRedirecting]);
  
  // Set initial VC value from URL parameter
  useEffect(() => {
    if (vcSlug) {
      setSelectedVC(vcSlug);
    }
  }, [vcSlug]);

  // Handle VC selection change
  const handleVCChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVC(e.target.value);
  };
  
  // Show loading state while checking auth
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Mock VC list - would come from your database in a real app
  const vcOptions = [
    { name: "Sequoia Capital", slug: "sequoia-capital" },
    { name: "Andreessen Horowitz", slug: "andreessen-horowitz" },
    { name: "Accel", slug: "accel" },
    { name: "Benchmark", slug: "benchmark" },
    { name: "Greylock Partners", slug: "greylock-partners" },
    { name: "Kleiner Perkins", slug: "kleiner-perkins" },
    { name: "Union Square Ventures", slug: "usv" },
    { name: "First Round Capital", slug: "first-round-capital" }
  ];
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reviews" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          ← Back to All Reviews
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Write a Review</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <form className="space-y-6">
          {/* VC Selection */}
          <div>
            <label htmlFor="vc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select VC Firm <span className="text-red-500">*</span>
            </label>
            <select
              id="vc"
              name="vc"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              value={selectedVC}
              onChange={handleVCChange}
              required
            >
              <option value="" disabled>Select a VC firm to review</option>
              {vcOptions.map((vc) => (
                <option key={vc.slug} value={vc.slug}>{vc.name}</option>
              ))}
              <option value="other">Other (Specify Below)</option>
            </select>
            
            <div className={`mt-3 ${selectedVC === 'other' ? 'block' : 'hidden'}`}>
              <label htmlFor="other-vc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specify VC Firm
              </label>
              <input
                type="text"
                id="other-vc"
                name="other-vc"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="Enter VC firm name"
                required={selectedVC === 'other'}
              />
            </div>
          </div>
          
          {/* Ratings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ratings <span className="text-red-500">*</span></h3>
            
            {/* Responsiveness Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Responsiveness 
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (How quickly they respond to communications and requests)
                </span>
              </label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex flex-col items-center">
                    <input 
                      type="radio" 
                      id={`responsiveness-${rating}`} 
                      name="responsiveness" 
                      value={rating}
                      className="sr-only"
                      required
                    />
                    <label 
                      htmlFor={`responsiveness-${rating}`}
                      className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <svg className="w-8 h-8 text-gray-400 hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </label>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rating}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Fairness Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fairness
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (How fair their term sheets and negotiations are)
                </span>
              </label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex flex-col items-center">
                    <input 
                      type="radio" 
                      id={`fairness-${rating}`} 
                      name="fairness" 
                      value={rating}
                      className="sr-only"
                      required
                    />
                    <label 
                      htmlFor={`fairness-${rating}`}
                      className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <svg className="w-8 h-8 text-gray-400 hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </label>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rating}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Support Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Support
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (The level of support and guidance provided post-investment)
                </span>
              </label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex flex-col items-center">
                    <input 
                      type="radio" 
                      id={`support-${rating}`} 
                      name="support" 
                      value={rating}
                      className="sr-only"
                      required
                    />
                    <label 
                      htmlFor={`support-${rating}`}
                      className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <svg className="w-8 h-8 text-gray-400 hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </label>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Review Content */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review <span className="text-red-500">*</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">
                Share your experience working with this VC. What was the interaction like? What went well? What could have been improved?
              </span>
            </label>
            <textarea
              id="review"
              name="review"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Write your review here..."
              required
            ></textarea>
          </div>
          
          {/* Stage and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Funding Stage
              </label>
              <select
                id="stage"
                name="stage"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              >
                <option value="">Select stage</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B</option>
                <option value="series-c">Series C</option>
                <option value="later-stage">Later stage</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Investment Amount
              </label>
              <select
                id="amount"
                name="amount"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              >
                <option value="">Select amount</option>
                <option value="<500k">Under $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-3m">$1M - $3M</option>
                <option value="3m-5m">$3M - $5M</option>
                <option value="5m-10m">$5M - $10M</option>
                <option value="10m-20m">$10M - $20M</option>
                <option value="20m+">$20M+</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          {/* Year of Interaction */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year of Investment/Interaction
            </label>
            <select
              id="year"
              name="year"
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="">Select year</option>
              {[...Array(10)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Privacy Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
            
            <div className="flex items-center mb-4">
              <input
                id="anonymous"
                name="anonymous"
                type="checkbox"
                className="h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-700 rounded"
                defaultChecked
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Submit anonymously (your identity will not be shared)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-700 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I confirm this review is based on my genuine experience and complies with the <Link href="/terms" className="underline">community guidelines</Link>
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-colors"
            >
              Submit Review
            </button>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
              Your review will be moderated before being published
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-6">
        <h4 className="font-medium text-black dark:text-white mb-2">Our Community Guidelines</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Be honest and factual about your experience</li>
          <li>Avoid personal attacks or defamatory statements</li>
          <li>Focus on the professional relationship and interactions</li>
          <li>Respect confidentiality clauses in your agreements</li>
          <li>Provide context where possible to help other founders</li>
        </ul>
      </div>
    </div>
  );
}