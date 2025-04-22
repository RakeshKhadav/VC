import Link from "next/link";
import { notFound } from "next/navigation";

// This would come from your database in a real app
const getVCData = (slug: string) => {
  // For demonstration purposes, we'll return mock data
  const vcs = {
    "sequoia-capital": {
      name: "Sequoia Capital",
      logo: "https://placekitten.com/200/200", // Placeholder for demo
      website: "https://www.sequoiacap.com",
      description: "Sequoia Capital is an American venture capital firm. The firm specializes in investments at all stages of a company.",
      averageRating: 4.2,
      totalReviews: 15,
      ratings: {
        responsiveness: 4.5,
        fairness: 4.0,
        support: 4.1
      },
      reviews: [
        {
          id: "1",
          date: "2025-03-10",
          rating: 5,
          content: "Sequoia has been incredibly helpful throughout our journey. Their advice and connections were vital to our success.",
          author: "Anonymous Founder",
          helpful: 12
        },
        {
          id: "2",
          date: "2025-01-22",
          rating: 4,
          content: "Great experience with their team. Very responsive and provided valuable feedback during our fundraising process.",
          author: "Anonymous Founder",
          helpful: 8
        },
        {
          id: "3",
          date: "2024-11-15",
          rating: 3,
          content: "Mixed experience. The team was responsive, but we felt the term sheet was aggressive compared to other offers.",
          author: "Anonymous Founder",
          helpful: 5
        }
      ]
    },
    "andreessen-horowitz": {
      name: "Andreessen Horowitz",
      logo: "https://placekitten.com/201/201", // Placeholder for demo
      website: "https://a16z.com",
      description: "Andreessen Horowitz (also called a16z) is a private American venture capital firm, founded in 2009 by Marc Andreessen and Ben Horowitz.",
      averageRating: 4.5,
      totalReviews: 18,
      ratings: {
        responsiveness: 4.7,
        fairness: 4.3,
        support: 4.5
      },
      reviews: [
        {
          id: "1",
          date: "2025-02-28",
          rating: 5,
          content: "a16z has been an incredible partner. Their operational support team helped us tremendously with hiring and strategy.",
          author: "Anonymous Founder",
          helpful: 15
        },
        {
          id: "2",
          date: "2025-01-05",
          rating: 5,
          content: "The partners at a16z are extremely founder-friendly. They understand the challenges of building a company and provide relevant advice.",
          author: "Anonymous Founder",
          helpful: 10
        }
      ]
    }
  };

  return vcs[slug as keyof typeof vcs];
};

export default function VCProfilePage({ params }: { params: { slug: string } }) {
  const vcData = getVCData(params.slug);
  
  if (!vcData) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/reviews" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          ← Back to All VCs
        </Link>
      </div>
      
      {/* VC Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            {vcData.logo && <img src={vcData.logo} alt={vcData.name} className="w-full h-full object-cover" />}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{vcData.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {vcData.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={vcData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-black dark:text-white hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                </svg>
                Website
              </Link>
              
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(vcData.averageRating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-lg font-medium">{vcData.averageRating}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-600 dark:text-gray-300">{vcData.totalReviews} reviews</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link href={`/reviews/new?vc=${params.slug}`} className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-block">
              Write a Review
            </Link>
          </div>
        </div>
      </div>
      
      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Responsiveness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(vcData.ratings.responsiveness) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <span className="text-xl font-medium ml-2">{vcData.ratings.responsiveness}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How quickly they respond to communications and requests</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Fairness</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(vcData.ratings.fairness) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <span className="text-xl font-medium ml-2">{vcData.ratings.fairness}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">How fair their term sheets and negotiations are</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Support</h3>
          <div className="flex items-center">
            <div className="flex flex-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(vcData.ratings.support) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <span className="text-xl font-medium ml-2">{vcData.ratings.support}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">The level of support and guidance provided post-investment</p>
        </div>
      </div>
      
      {/* Reviews */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Reviews ({vcData.totalReviews})</h2>
        
        <div className="space-y-8">
          {vcData.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{review.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Report
                </button>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>
              
              <div className="flex items-center">
                <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}