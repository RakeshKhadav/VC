// Script to submit a review via the API endpoint
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers, 
            data: parsedData 
          });
        } catch (e) {
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers, 
            data: responseData 
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function submitReviewViaApi() {
  try {
    const reviewData = {
      vcName: "Sequoia Capital",
      vcWebsite: "https://www.sequoiacap.com", 
      companyName: "Innovative Tech Solutions",
      companyWebsite: "https://example.com",
      industry: "AI/ML",
      role: "Founder/CEO",
      companyLocation: "San Francisco",
      ratings: {
        responsiveness: 4.5,
        fairness: 4.2,
        support: 4.7
      },
      reviewText: "We had a fantastic experience with Sequoia Capital. Their team was incredibly responsive to our questions and concerns. The terms were fair and they provided excellent support post-investment. They introduced us to key industry contacts that accelerated our growth. Highly recommend working with them if you get the chance.",
      fundingStage: "Series A",
      investmentAmount: "$3M - $5M",
      yearOfInteraction: "2025",
      isAnonymous: false
    };

    console.log('Submitting review via test API endpoint...');
    console.log('Review data:', JSON.stringify(reviewData, null, 2));
    
    // First test the database connection
    console.log('Testing database connection...');
    const dbTestOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/db-test',
      method: 'GET',
    };
    
    const dbTestResult = await makeRequest(dbTestOptions);
    console.log('Database connection test result:', dbTestResult.data);
    
    if (!dbTestResult.data.connected) {
      console.error('Database connection failed!');
      process.exit(1);
    }
    
    // Get the reviews from API first to check if it's working
    console.log('Checking existing reviews...');
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/reviews',
      method: 'GET',
    };
    
    const getResult = await makeRequest(getOptions);
    console.log('Current reviews count:', getResult.data.reviews.length);
    console.log('Pagination info:', getResult.data.pagination);
    
    // Using our special test endpoint instead of the normal API
    console.log('Adding review directly to database using test endpoint...');
    const postOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-add-review', // Using our special test endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(postOptions, reviewData);
    
    if (response.statusCode !== 201 && response.statusCode !== 200) {
      console.error(`Error submitting review: ${response.statusCode}`);
      console.error('Error details:', response.data);
      process.exit(1);
    }
    
    console.log('Review submitted successfully!');
    console.log('Server response:', response.data);
    
    console.log('Checking if review was added...');
    const getResponseAfter = await makeRequest(getOptions);
    console.log('Reviews count after submission:', getResponseAfter.data.reviews.length);
    
    if (getResponseAfter.data.reviews.length > getResult.data.reviews.length) {
      console.log('Success! New review was added to the database.');
    } else {
      console.log('No change in review count. Check server logs for details.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
submitReviewViaApi();