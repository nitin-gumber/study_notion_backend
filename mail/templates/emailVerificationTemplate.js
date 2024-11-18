exports.emailVerificationTemplate = (otp, email) => {
    return `<!DOCTYPE html>
    <html lang="en">
  
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - StudyNotion</title>
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
  
            .subtitle {
                font-size: 18px;
                color: #7f8c8d;
                margin-bottom: 30px;
            }
  
            .content {
                font-size: 16px;
                color: #555;
                line-height: 1.8;
                margin-bottom: 30px;
                text-align: left;
            }
  
            .otp {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 30px;
                font-weight: bold;
                color: #e74c3c;
                margin: 20px 0;
                padding: 15px 25px;
                background-color: #f9f9f9;
                border-radius: 10px;
                border: 1px solid #ddd;
                letter-spacing: 2px;
                max-width: 250px;
                margin: 20px auto;
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
                font-size: 12px;
                color: #b2bec3;
                margin-top: 40px;
                text-align: center;
                padding: 20px;
                border-top: 1px solid #eee;
            }
  
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
        </style>
    </head>
  
    <body>
        <div class="container">
            <div class="logo">
                <a href="https://studynotion-online.vercel.app">
                    <img src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
                </a>
            </div>
            <div class="title">Email Verification Required</div>
            <div class="subtitle">To complete your StudyNotion registration</div>
            <div class="content">
                <p>Hi <strong>${email}</strong>,</p>
                <p>We're excited to have you onboard! Before you can start using all the amazing features at StudyNotion, we just need to verify your email address.</p>
                <p>Use the OTP (One-Time Password) provided below to verify your account:</p>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for the next 5 minutes. Please do not share this code with anyone.</p>
                <p>If you did not request this verification or think this email was sent in error, feel free to ignore it. Your account won’t be activated unless you enter the OTP.</p>
            </div>
            <a href="https://https://studynotion-online.vercel.app/login" class="cta-button">Go to StudyNotion Login</a>
            <div class="support">
                Need help or have questions? Reach out to us at 
                <a href="mailto:studynotionceo@gmail.com">info@studynotiononline.com</a>.
            </div>
            <div class="footer">
                You are receiving this email because you registered with StudyNotion using the email address <strong>${email}</strong>.
                <br>
                If this was a mistake, simply ignore this email. No further action is required.
                <br>
                <a href="https://studynotion-online.vercel.app">Visit our website</a> | 
                <a href="">Follow us on Twitter</a>
            </div>
        </div>
    </body>
    </html>`;
  };
  