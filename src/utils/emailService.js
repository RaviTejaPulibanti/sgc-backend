// utils/emailService.js
const nodemailer = require('nodemailer');
const User = require('../models/User');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEventEmails(event, club) {
    try {
      // Get all subscribed users
      const users = await User.find({ isSubscribed: true });
      
      if (users.length === 0) {
        console.log('No subscribed users found');
        return false;
      }

      const emailPromises = users.map(user => 
        this.sendSingleEventEmail(user, event, club)
      );

      await Promise.all(emailPromises);
      
      // Update event email tracking
      event.emailSent = true;
      event.emailSentAt = new Date();
      await event.save();
      
      console.log(`Emails sent to ${users.length} users for event: ${event.name}`);
      return true;
    } catch (error) {
      console.error('Error sending event emails:', error);
      return false;
    }
  }

  async sendSingleEventEmail(user, event, club) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `New Event: ${event.name} by ${club.name}`,
      html: this.generateEventEmailTemplate(event, club)
    };

    try {
      await this.transporter.sendMail(mailOptions);
      
      // Update user's last email sent date
      user.lastEmailSent = new Date();
      await user.save();
      
      console.log(`Email sent to ${user.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
    }
  }

  generateEventEmailTemplate(event, club) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a90e2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .event-details { background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4a90e2; color: white; 
                   text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${event.name}</h1>
            <p>Presented by ${club.name}</p>
          </div>
          <div class="content">
            <p>${event.description}</p>
            
            <div class="event-details">
              <h3>Event Details:</h3>
              <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(event.eventDate).toLocaleTimeString()}</p>
              <p><strong>Venue:</strong> ${event.venue}</p>
              <p><strong>Last Registration Date:</strong> ${new Date(event.lastRegistrationDate).toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${event.registrationLink}" class="button">Register Now</a>
            </div>
          </div>
          <div class="footer">
            <p>You're receiving this email because you're subscribed to club events.</p>
            <p>To unsubscribe, update your preferences in your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();