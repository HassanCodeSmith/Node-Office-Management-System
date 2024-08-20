const sendOtpEmail = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
</head>
<body>
    <p>Hello ${name} !</p>
    <p>We received a request to reset your password for your  account. To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
    <p><strong>OTP : ${otp} </p>
    <p>Please enter this OTP on the password reset page within the next  5 minutes to complete the password reset process. If you didn't request this password reset, you can simply ignore this email.</p>
    <p>If you have any questions or need further assistance, please don't hesitate to contact our team.</p>
    <p>Thank you<br>
</body>
</html>`;
};
module.exports = sendOtpEmail;
