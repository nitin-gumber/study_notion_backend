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
              margin-bottom: 30px;
          }
  
          .message {
              font-size: 24px;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
          }
  
          .body {
              font-size: 16px;
              color: #555;
              margin-bottom: 20px;
              text-align: left;
          }
  
          .cta {
              display: inline-block;
              padding: 15px 30px;
              background-color: #FFD60A;
              color: #000000;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: 600;
              margin-top: 20px;
              transition: background-color 0.3s ease;
          }
  
          .cta:hover {
              background-color: #ffd500;
          }
  
          .support {
              font-size: 14px;
              color: #7f8c8d;
              margin-top: 20px;
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
              padding-top: 20px;
          }
  
          .footer a {
              color: #3498db;
              text-decoration: none;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <a href="https://studynotion-edtech-project.vercel.app">
              <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
          </a>
          <div class="message">Passwrd Updated Successfully</div>
          <div class="body">
              <p>Hello <strong>${name}</strong>,</p>
              <p>We wanted to let you know that your password was successfully updated. If this action wasn’t performed by you, please contact our support team immediately to secure your account.</p>
              <p>You can log in to your account using the button below:</p>
              <a class="cta" href="yha pr login ka route ayega">Login to Your Account</a>
              <p>If you need assistance, feel free to reach out to us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>.</p>
          </div>
          <div class="support">
              Best regards,<br>
              The StudyNotion Team
          </div>
          <div class="footer">
              If you have any questions or concerns, visit our <a href="https://studynotion-edtech-project.vercel.app">Help Center</a> or follow us on <a href="https://twitter.com/studynotion">Twitter</a>.
          </div>
      </div>
  </body>
  
  </html>`;
  };
  