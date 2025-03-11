// Netlify serverless function to handle contact form submissions
export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Parse the body
    const { name, email, message } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid email address' }),
      };
    }

    // Here you would typically integrate with your database or email service
    // For demo purposes, we'll just log the submission
    console.info('📨 Contact form submission:', { name, email });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submitted successfully',
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.error('❌ Contact form error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}