// utils/email.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2. Define email options
    const mailOptions = {
        from: `Mantri Malls <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // HTML version of the email
    };

    // 3. Send email
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Email could not be sent');
    }
};

export { sendEmail };