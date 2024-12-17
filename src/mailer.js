/*
    This file contains the configurations and function to send emails using nodemailer
*/

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASS
    }
});

export async function sendMail(to, subject, text) {
    const mailOptions = {
        from: process.env.SENDER_MAIL,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch (err) {
        console.log(`error: ${err}`);
    }
}
