exports.passwordUpdated = (name) => {
  return `
      <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Update Notification</title>
      <style>
          body {
              background-color: #f9f9f9;
              font-family: 'Helvetica Neue', Arial, sans-serif;
              font-size: 16px;
              color: #333;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              text-align: center;
          }
  
          .logo {
              max-width: 150px;
              margin: 20px auto;
          }
  
          .message {
              font-size: 26px;
              font-weight: bold;
              color: #2c3e50;
              margin: 20px 0;
          }
  
          .body {
              font-size: 16px;
              color: #555;
              margin-bottom: 20px;
              text-align: left;
          }
  
          .body p {
              margin: 10px 0;
          }
  
          .cta {
              display: inline-block;
              padding: 15px 30px;
              background-color: #FFD60A;
              color: #000000;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              margin: 20px 0;
              transition: background-color 0.3s ease;
          }
  
          .cta:hover {
              background-color: #ffd500;
          }
  
          .support {
              font-size: 14px;
              color: #7f8c8d;
              margin: 20px 0;
              text-align: left;
          }
  
          .support a {
              color: #3498db;
              text-decoration: none;
          }
  
          .support a:hover {
              text-decoration: underline;
          }
  
          .footer {
              font-size: 12px;
              color: #b2bec3;
              margin-top: 40px;
              border-top: 1px solid #eee;
              padding: 20px 0;
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
          <a href="https://studynotion-online.vercel.app/">
              <img class="logo" src="https://res.cloudinary.com/dm0hgrqoa/image/upload/v1743013778/rzp_logo_wvh8il.png" alt="StudyNotion Logo">
          </a>
          <div class="message">Password Updated Successfully</div>
          <div class="body">
              <p>Hello <strong>${name}</strong>,</p>
              <p>We wanted to let you know that your password was successfully updated. If this action wasn’t performed by you, please contact our support team immediately to secure your account.</p>
              <p>You can log in to your account using the button below:</p>
              <a class="cta" href="https://studynotion-online.vercel.app/login">Login to Your Account</a>
              <p>If you need assistance, feel free to reach out to us at <a href="mailto:studynotionceo@gmail.com">studynotionceo@gmail.com</a>.</p>
          </div>
          <div class="support">
              Best regards,<br>
              The StudyNotion Team
          </div>
          <div class="footer">
              If you have any questions or concerns, visit our <a href="https://studynotion-online.vercel.app/">Help Center</a> or follow us on <a href="https://x.com/Nitin601?t=tt1K5tdELxi2F8aeSbxZqg&s=09">Twitter</a> | <a href="https://www.linkedin.com/in/nitin-gumber-web-dev">LinkedIn</a> | <a href="https://www.instagram.com/nitin.gumber_/profilecard/?igsh=ZnpibmRycjMwZjJq">Instagram</a> | <a href="https://github.com/Nitin-Gumber">GitHub</a> 
              <br>
              &copy; ${new Date().getFullYear()} StudyNotion. All rights reserved.
          </div>
      </div>
  </body>

  </html>`;
};
