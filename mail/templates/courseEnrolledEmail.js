exports.courseEnrolledEmail = (courseName, name) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Course Registration Confirm</title>

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
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        .logo {
            max-width: 180px;
            margin-bottom: 30px;
        }

        .message {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
        }

        .body {
            font-size: 16px;
            color: #4B5563;
            margin-bottom: 30px;
        }

        .cta {
            display: inline-block;
            padding: 12px 30px;
            background-color: #FFD60A;
            color: #000000;
            text-decoration: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            transition: background-color 0.3s ease;
        }

        .cta:hover {
            background-color: #ffd500;
        }

        .support {
            font-size: 14px;
            color: #9CA3AF;
            margin-top: 30px;
        }

        .highlight {
            font-weight: bold;
            color: #1F2937;
        }
    </style>

</head>
<body>
  <div class="container">
        <a href=""><img class="logo"
                src="" alt="StudyNotion Logo"></a>
        <div class="message">
            Course Registration Confirmation
        </div>

        <div class="body">
            <p>Dear ${name},</p>
            <p>You have successfully registered for the course <span class="highlight">${courseName}</span>. We are excited to have you as a participant!</p>
            <p>Please log in to your learning dashboard to access the course materials and start your learning journey.</p>
            <a class="cta" href="">Go To Dashboard</a>
        </div>
        <div class="support">
            If you have any questions or need assistance, please feel free to reach out to us at <a
                href="mailto: " style="color:#3B82F6; text-decoration: none;">yaha pr plateform ka email ayega</a>. We are here to help!
        </div>
    </div> 
</body>
</html>`;
};
