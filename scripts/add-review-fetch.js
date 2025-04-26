// Script to submit a review using the fetch API
const fetch = require('node-fetch');

// Review data to submit
const reviewData = {
  vcName: "Sequoia Capital",
  vcWebsite: "https://www.sequoiacap.com",
  industry: "AI/ML",
  role: "Founder/CEO",
  companyLocation: "San Francisco",
  ratings: {
    responsiveness: 4.5,
    fairness: 4.2,
    support: 4.7
  },
  reviewHeading: "Excellent partner for growth",
  reviewText: "We had a fantastic experience with Sequoia Capital. Their team was incredibly responsive to our questions and concerns. The terms were fair and they provided excellent support post-investment. They introduced us to key industry contacts that accelerated our growth. Highly recommend working with them if you get the chance.",
  pros: "Great network, helpful team, strategic guidance",
  cons: "Due diligence process was lengthy",
  fundingStage: "Series A",
  investmentAmount: "$3M - $5M",
  yearOfInteraction: "2025"
};

// Submit review function
async function submitReview() {
  try {
    console.log('Submitting review to test API endpoint...');
    console.log('Review data:', JSON.stringify(reviewData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/test-add-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Review submitted successfully!');
    console.log('Response:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error submitting review:', error.message);
    throw error;
  }
}

// Run the submission
submitReview()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });