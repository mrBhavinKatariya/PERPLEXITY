const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || "465",
      secure: true, // 465 पोर्ट के लिए true
      auth: {
        user: process.env.EMAIL_USERNAME || "heyfashion2548@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "vqnmuzugertvxihk", // स्पेस हटाएं
      },
    });

    // From फ़ील्ड को सही करें
    const fromAddress = process.env.EMAIL_FROM 
      ? `Mantri Malls <${process.env.EMAIL_FROM}>` 
      : "Mantri Malls <heyfashion2548@gmail.com>";

    const mailOptions = {
      from: fromAddress,
      to: options.email,
      subject: options.subject,
      html: options.html, // केवल HTML का प्रयोग करें
    };

    // ईमेल भेजें और रिस्पॉन्स लॉग करें
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email भेजने में विफल");
  }
};

export { sendEmail };