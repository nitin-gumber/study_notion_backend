exports.contactUsEmail = (
  email,
  firstName,
  lastName,
  message,
  phoneNumber,
  countryCode
) => {
  return `<!DOCTYPE html>
      <html lang="en">
    
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Us Submission - StudyNotion</title>
          <style>
              body {
                  background-color: #ffffff;
                  font-family: 'Helvetica Neue', Arial, sans-serif;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
    
              .container {
                  max-width: 600px;
                  margin: 40px auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border: 1px solid #e0e0e0;
                  border-radius: 10px;
                  text-align: center;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              }
    
              .logo {
                  margin-bottom: 30px;
              }
    
              .logo img {
                  max-width: 150px;
              }
    
              .title {
                  font-size: 26px;
                  color: #2c3e50;
                  margin-bottom: 10px;
                  font-weight: bold;
              }
    
              .content {
                  font-size: 16px;
                  color: #555;
                  line-height: 1.8;
                  margin-bottom: 30px;
                  text-align: left;
              }
    
              .message-box {
                  font-size: 14px;
                  background-color: #f9f9f9;
                  padding: 15px;
                  border-radius: 8px;
                  margin-top: 20px;
                  border-left: 4px solid #3498db;
              }
    
              .cta-button {
                  display: inline-block;
                  padding: 15px 30px;
                  background-color: #FFD60A;
                  color: #000000;
                  font-size: 18px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
    
              .support {
                  font-size: 14px;
                  color: #7f8c8d;
                  margin-top: 30px;
              }
    
              .support a {
                  color: #3498db;
                  text-decoration: none;
              }
    
              .footer {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-top: 1px solid #e0e0e0;
                  margin-top: 40px;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #7f8c8d;
                  text-align: center;
              }
    
              .footer a {
                  color: #3498db;
                  text-decoration: none;
                  margin: 0 10px;
              }
    
              .footer a:hover {
                  text-decoration: underline;
              }
          </style>
      </head>
    
      <body>
          <div class="container">
              <div class="logo">
                  <a href="https://studynotion-online.vercel.app">
                      <img src="https://res.cloudinary.com/dm0hgrqoa/image/upload/v1743013778/rzp_logo_wvh8il.png" alt="StudyNotion Logo">
                  </a>
              </div>
              <div class="title">Thank You for Contacting Us!</div>
              <div class="content">
                  <p>Hi <strong>${firstName} ${lastName}</strong>,</p>
                  <p>Thank you for reaching out to us. We have received your message and our team will get back to you as soon as possible. Below are the details of your submission:</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone Number:</strong> ${countryCode} ${phoneNumber}</p>
                  <p><strong>Message:</strong></p>
                  <div class="message-box">
                      ${message}
                  </div>
                  <p>If you have any additional questions or concerns, feel free to reply to this email or contact us directly.</p>
              </div>
              <a href="https://studynotion-online.vercel.app" class="cta-button">Visit StudyNotion</a>
              <div class="support">
                  Need further assistance? Contact us at 
                  <a href="mailto:studynotionceo@gmail.com">studynotionceo@gmail.com</a>.
              </div>
              <div class="footer">
                  You are receiving this email because you submitted a query via the StudyNotion Contact Form.<br>
                  <a href="https://studynotion-online.vercel.app/">Visit our website</a> | <a href="https://x.com/Nitin601?t=tt1K5tdELxi2F8aeSbxZqg&s=09">Twitter</a> | <a href="https://www.linkedin.com/in/nitin-gumber-web-dev">LinkedIn</a> | <a href="https://www.instagram.com/nitin.gumber_/profilecard/?igsh=ZnpibmRycjMwZjJq">Instagram</a> | <a href="https://github.com/Nitin-Gumber">GitHub</a>
                  <br>
                  &copy; ${new Date().getFullYear()} StudyNotion. All rights reserved.
              </div>
          </div>
      </body>
      </html>`;
};
