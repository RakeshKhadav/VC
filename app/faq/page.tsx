import Link from "next/link";

export default function FAQPage() {
  // FAQ data with questions and answers
  const faqItems = [
    {
      question: "What is Backchannel?",
      answer: "Backchannel is a platform where founders can anonymously rate and review venture capitalists, providing transparency to the startup funding ecosystem. Our goal is to help founders make more informed decisions when seeking investment partners."
    },
    {
      question: "How does anonymity work?",
      answer: "When you submit a review, your identity is protected. We verify that you&apos;re a legitimate founder, but we don&apos;t share identifiable information with the reviewed VCs or other users. This allows for honest feedback without fear of repercussions."
    },
    {
      question: "How do you verify reviewers?",
      answer: "We use a combination of email verification, LinkedIn profile checks, and company registration data to ensure reviews come from actual founders who have interacted with the VCs they&apos;re reviewing. This maintains the quality and trustworthiness of our reviews."
    },
    {
      question: "Can VCs respond to reviews?",
      answer: "Yes, verified VC representatives can claim their firm&apos;s profile and respond to reviews. This creates a balanced platform where both founders and investors have a voice."
    },
    {
      question: "What kind of information should I include in my review?",
      answer: "Focus on your professional experience with the VC: communication style, responsiveness, fairness of terms, support provided, and whether they delivered on promises. Avoid personal attacks and stick to information that would be helpful for other founders."
    },
    {
      question: "Can I edit or delete my review after submitting it?",
      answer: "Yes, you can edit your review within 30 days of submission. If you need to delete a review, you can contact our support team with your request."
    },
    {
      question: "How are overall ratings calculated?",
      answer: "Overall ratings are an average of all reviews for a specific VC, with equal weight given to responsiveness, fairness, and support scores. We update these ratings in real-time as new reviews are submitted."
    },
    {
      question: "Is there a fee to use Backchannel?",
      answer: "Backchannel is free for founders to use for reading and submitting reviews. We&apos;re committed to keeping the core platform accessible to maintain transparency in the VC ecosystem."
    },
    {
      question: "What&apos;s your content moderation policy?",
      answer: "All reviews are moderated to ensure they comply with our community guidelines. We remove content that contains personal attacks, hate speech, or information that could violate confidentiality agreements."
    },
    {
      question: "How can I suggest a VC firm that&apos;s not listed?",
      answer: "When writing a review, you can select &apos;Other&apos; in the VC selection dropdown and enter the name of the firm. Our team will verify the firm and add it to our database."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {faqItems.map((item, index) => (
            <div key={index} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                {item.question}
              </h3>
              <div className="text-gray-600 dark:text-gray-300 text-base">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-6">Still have questions?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          If you couldn&apos;t find the answer to your question, feel free to reach out to our team.
        </p>
        <Link 
          href="/contact" 
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Contact Us
        </Link>
      </div>

      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-xl font-medium mb-4">Our Community Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
            <h4 className="font-medium mb-2">Transparency</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We believe in creating an open ecosystem where information is shared freely and honestly.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
            <h4 className="font-medium mb-2">Fairness</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We provide balanced perspectives and ensure both founders and VCs have a voice on our platform.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg">
            <h4 className="font-medium mb-2">Privacy</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We protect the identity of our reviewers while maintaining the integrity of the information provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}