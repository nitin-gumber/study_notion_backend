exports.courseEnrolledEmail = (courseName, name) => {
  return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Course Registration Confirmation</title>
      <style>
          body {
              background: linear-gradient(135deg, #f3f4f6, #ffffff);
              font-family: 'Roboto', Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              text-align: center;
          }
  
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
          }
  
          .logo {
              max-width: 150px;
              margin-bottom: 30px;
          }
  
          .message {
              font-size: 24px;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 20px;
          }
  
          .body {
              font-size: 16px;
              color: #4B5563;
              margin-bottom: 30px;
          }
  
          .body p {
              margin: 10px 0;
          }
  
          .cta {
              display: inline-block;
              padding: 12px 30px;
              background-color: #FFD60A;
              color: #000000;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s ease;
          }
  
          .cta:hover {
              background-color: #ffd500;
          }
  
          .support {
              font-size: 14px;
              color: #9CA3AF;
              margin-top: 20px;
          }
  
          .support a {
              color: #3B82F6;
              text-decoration: none;
          }
  
          .support a:hover {
              text-decoration: underline;
          }
  
          .footer {
              font-size: 12px;
              color: #6B7280;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
          }
  
          .footer a {
              color: #3B82F6;
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
          <a href="https://studynotion-online.vercel.app">
              <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
          </a>
          <div class="message">
              Course Registration Confirmation
          </div>
          <div class="body">
              <p>Dear <strong>${name}</strong>,</p>
              <p>You have successfully registered for the course <span class="highlight" style="color:#1F2937; font-weight:bold;">${courseName}</span>. We are excited to have you as a participant!</p>
              <p>Please log in to your learning dashboard to access the course materials and start your learning journey.</p>
              <a class="cta" href="https://studynotion-online.vercel.app/dashboard/enrolled-courses">Go To Dashboard</a>
          </div>
          <div class="support">
              If you have any questions or need assistance, please feel free to reach out to us at 
              <a href="mailto:studynotionceo@gmail.com">info@studynotion.com</a>. We are here to help!
          </div>
          <div class="footer">
              You received this email because you registered for a course on <a href="https://studynotion-online.vercel.app">StudyNotion</a>.
              <br>
              <a href="https://studynotion-online.vercel.app">Twitter</a> | 
              <a href="https://studynotion-online.vercel.app">LinkedIn</a>
          </div>
      </div>
  </body>
  </html>`;
};
