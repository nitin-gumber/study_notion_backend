exports.paymentSuccessfully = (name, courseName, orderId, amount) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Payment Success</title>

    <style>
        body {
            background: linear-gradient(135deg, #F0F4F8, #FFFFFF);
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
            max-width: 150px;
            margin-bottom: 30px;
        }

        .message {
            font-size: 24px;
            font-weight: 700;
            color: #10B981;
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

        .order-details {
            background-color: #F9FAFB;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            text-align: left;
        }

        .order-details p {
            margin: 0 0 10px;
        }

        .order-details .detail-item {
            font-size: 16px;
            color: #111827;
        }
    </style>
</head>

<body>
    <div class="container">
        <a href="https://studynotion-edtech-project.vercel.app"><img class="logo"
                src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
        <div class="message">
            Payment Successful!
        </div>

        <div class="body">
            <p>Dear ${name},</p>
            <p>We are thrilled to inform you that your payment for the course <span class="highlight">${courseName}</span> has been successfully processed.</p>
            <p>Your learning journey starts now! Log in to your dashboard to access the course materials.</p>
        </div>

        <div class="order-details">
            <p class="detail-item"><strong>Order ID:</strong> ${orderId}</p>
            <p class="detail-item"><strong>Payment Amount:</strong> Rs${amount}</p>
        </div>

        <a class="cta" href="https://studynotion-edtech-project.vercel.app/dashboard">Go To Dashboard</a>

        <div class="support">
            If you have any questions or need assistance, please feel free to reach out to us at <a
                href="mailto:info@studynotion.com"
                style="color:#3B82F6; text-decoration: none;">info@studynotion.com</a>. We are here to help!
        </div>
    </div>
</body>

</html>`;
};
