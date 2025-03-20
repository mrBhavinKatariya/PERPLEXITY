import nodemailer from "nodemailer"; 

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || "465",
      secure: true, // Use true for port 465
      auth: {
        user: process.env.EMAIL_USERNAME || "heyfashion2548@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "vqnmuzugertvxihk", // Remove spaces
      },
    });

    // Correct the "from" field
    const fromAddress = process.env.EMAIL_FROM
      ? `Mantri Malls <${process.env.EMAIL_FROM}>`
      : "Mantri Malls <heyfashion2548@gmail.com>";

    const mailOptions = {
      from: fromAddress,
      to: options.email,
      subject: options.subject,
      html: options.html, // Use only HTML
    };

    // Send email and log the response
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

export { sendEmail };