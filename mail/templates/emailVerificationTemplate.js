const emailVerificationTemplate = (otp, email) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                  color: #333;
              }
              .container {
                  max-width: 600px;
                  margin: 40px auto;
                  padding: 20px;
                  background-color: #fff;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  text-align: center;
              }
              .logo img {
                  max-width: 120px;
                  margin-bottom: 20px;
              }
              .title {
                  font-size: 22px;
                  margin-bottom: 10px;
                  font-weight: bold;
              }
              .content {
                  font-size: 16px;
                  margin-bottom: 20px;
                  line-height: 1.5;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #e74c3c;
                  margin: 20px 0;
              }
              .footer {
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
                  border-top: 1px solid #ddd;
                  padding-top: 10px;
              }
              a {
                  color: #3498db;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
              </div>
              <div class="title">Verify Your Email</div>
              <div class="content">
                  Hi <strong>${email}</strong>,<br>
                  To complete your registration with StudyNotion, please use the OTP below:
                  <div class="otp">${otp}</div>
                  This OTP is valid for the next 10 minutes. Please do not share it with anyone.<br><br>
                  If you didn’t request this, you can safely ignore this email.
              </div>
              <div class="footer">
                  Need help? Contact us at <a href="mailto:studynotionceo@gmail.com">info@studynotion.com</a>
                  <br>
                  © 2024 StudyNotion. All Rights Reserved.
              </div>
          </div>
      </body>
      </html>`;
};

module.exports = emailVerificationTemplate;
