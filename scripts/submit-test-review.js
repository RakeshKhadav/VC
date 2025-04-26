// Simple script to submit a review via the test API endpoint
const http = require('http');

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

// Function to submit the review
function submitReview() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(reviewData);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-add-review',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    console.log('Submitting review to test API endpoint...');
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Review submitted successfully!');
          console.log('Response status:', res.statusCode);
          try {
            const parsedData = JSON.parse(responseData);
            console.log('Response data:', JSON.stringify(parsedData, null, 2));
            resolve(parsedData);
          } catch (e) {
            console.log('Response data (not JSON):', responseData);
            resolve(responseData);
          }
        } else {
          console.error('Error submitting review:', res.statusCode);
          console.error('Response data:', responseData);
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    console.log('Sending review data:', JSON.stringify(reviewData, null, 2));
    req.write(data);
    req.end();
  });
}

// Execute the submission
submitReview()
  .then(() => {
    console.log('Script execution completed successfully.');
  })
  .catch((error) => {
    console.error('Script execution failed:', error);
  });