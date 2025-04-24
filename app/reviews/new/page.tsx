"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import StarRating from "@/app/components/ui/StarRating";
import { useNotification } from "@/app/context/NotificationContext";

// Component to handle the search params logic
function ReviewFormContent() {
  const { isLoaded, isSignedIn } = useUser(); // Removed unused 'user' variable
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useNotification();
  
  // Form state management
  const [selectedVC, setSelectedVC] = useState("");
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    website: "",
    sector: "",
    role: "",
    location: ""
  });
  const [ratings, setRatings] = useState({
    responsiveness: 0,
    fairness: 0,
    support: 0
  });
  const [reviewDetails, setReviewDetails] = useState({
    content: "",
    stage: "",
    amount: "",
    year: "",
    anonymous: true,
    terms: false
  });
  const [otherVC, setOtherVC] = useState("");
  
  // Extract VC name from URL if provided
  const vcSlug = searchParams ? searchParams.get("vc") || "" : "";
  
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
  
  // Handle company info changes
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name.replace('company_', '')]: value
    }));
  };
  
  // Handle review details changes
  const handleReviewDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setReviewDetails(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  // Handle other VC name change
  const handleOtherVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherVC(e.target.value);
  };
  
  // Handle rating changes
  const handleRatingChange = (category: 'responsiveness' | 'fairness' | 'support', value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  // Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    // Check VC selection
    if (!selectedVC) return false;
    if (selectedVC === 'other' && !otherVC) return false;
    
    // Check ratings
    if (ratings.responsiveness === 0 || ratings.fairness === 0 || ratings.support === 0) return false;
    
    // Check review content
    if (!reviewDetails.content.trim()) return false;
    
    // Check terms agreement
    if (!reviewDetails.terms) return false;
    
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!areRequiredFieldsFilled()) {
      showAlert("Please fill in all required fields", "danger", {
        title: "Validation Error",
        autoClose: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send the data to your API here
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showAlert("Your review has been submitted successfully!", "success", {
        title: "Thank you for your feedback",
        autoClose: true,
        duration: 2000, // 2 seconds auto-fade
        variant: "flat",
        radius: "lg"
      });
      
      // Reset the form or redirect
      setTimeout(() => {
        router.push("/reviews");
      }, 2000);
      
    } catch (error) { 
      showAlert("An error occurred while submitting your review. Please try again.", "danger", {
        title: "Submission Error",
        autoClose: true,
      });
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                value={otherVC}
                onChange={handleOtherVCChange}
                required={selectedVC === 'other'}
              />
            </div>
          </div>
          
          {/* Company Information Section */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium">Your Company Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This information helps provide context for your review. If you choose to remain anonymous, your company details will still be shown with your review.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Your company name"
                  value={companyInfo.name}
                  onChange={handleCompanyInfoChange}
                />
              </div>
              
              <div>
                <label htmlFor="company_website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  id="company_website"
                  name="company_website"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="https://example.com"
                  value={companyInfo.website}
                  onChange={handleCompanyInfoChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company_sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry/Sector
                </label>
                <select
                  id="company_sector"
                  name="company_sector"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={companyInfo.sector}
                  onChange={handleCompanyInfoChange}
                >
                  <option value="">Select industry</option>
                  <option value="fintech">FinTech</option>
                  <option value="healthtech">HealthTech</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="ai">AI/Machine Learning</option>
                  <option value="consumer">Consumer</option>
                  <option value="enterprise">Enterprise Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="marketplaces">Marketplaces</option>
                  <option value="edtech">EdTech</option>
                  <option value="cleantech">CleanTech</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="company_role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  id="company_role"
                  name="company_role"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="CEO, CTO, Founder, etc."
                  value={companyInfo.role}
                  onChange={handleCompanyInfoChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="company_location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Location
              </label>
              <input
                type="text"
                id="company_location"
                name="company_location"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="City, Country or Region"
                value={companyInfo.location}
                onChange={handleCompanyInfoChange}
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
              <div className="flex items-center">
                <StarRating 
                  value={ratings.responsiveness}
                  onChange={(newRating) => handleRatingChange('responsiveness', newRating)} 
                />
                <input 
                  type="hidden" 
                  name="responsiveness" 
                  value={ratings.responsiveness}
                  required
                />
                {ratings.responsiveness > 0 && (
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    {ratings.responsiveness.toFixed(1)}
                  </span>
                )}
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
              <div className="flex items-center">
                <StarRating 
                  value={ratings.fairness}
                  onChange={(newRating) => handleRatingChange('fairness', newRating)} 
                />
                <input 
                  type="hidden" 
                  name="fairness" 
                  value={ratings.fairness}
                  required
                />
                {ratings.fairness > 0 && (
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    {ratings.fairness.toFixed(1)}
                  </span>
                )}
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
              <div className="flex items-center">
                <StarRating 
                  value={ratings.support}
                  onChange={(newRating) => handleRatingChange('support', newRating)} 
                />
                <input 
                  type="hidden" 
                  name="support" 
                  value={ratings.support}
                  required
                />
                {ratings.support > 0 && (
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    {ratings.support.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Review Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review <span className="text-red-500">*</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">
                Share your experience working with this VC. What was the interaction like? What went well? What could have been improved?
              </span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Write your review here..."
              value={reviewDetails.content}
              onChange={handleReviewDetailsChange}
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
                value={reviewDetails.stage}
                onChange={handleReviewDetailsChange}
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
                value={reviewDetails.amount}
                onChange={handleReviewDetailsChange}
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
              value={reviewDetails.year}
              onChange={handleReviewDetailsChange}
            >
              <option value="">Select year</option>
              {[...Array(10)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          
          {/* Privacy Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-700 rounded"
                checked={reviewDetails.terms}
                onChange={handleReviewDetailsChange}
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
              className={`w-full py-3 px-4 ${!areRequiredFieldsFilled() ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200'} text-white dark:text-black rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-colors`}
              disabled={!areRequiredFieldsFilled() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
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

// Loading fallback component
function LoadingForm() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
          
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
          
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the main component with Suspense
export default function SubmitReviewPage() {
  return (
    <Suspense fallback={<LoadingForm />}>
      <ReviewFormContent />
    </Suspense>
  );
}