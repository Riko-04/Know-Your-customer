package com.giktek.email_service.Services;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.util.Properties;
// import java.util.Random;

import jakarta.mail.*;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;;


@Service
public class EmailService {

    @RabbitListener(queues = {"${rabbitmq.queue.name}"})
    public void sendMail(String email) throws AddressException, MessagingException{

        Properties prop = new Properties();
        prop.put("mail.smtp.auth", true);
        prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "25");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");

        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("echoge11@gmail.com", "nlzh vitv wrvt wmve");
            }
        });

        MimeMessage message = new MimeMessage(session); 
        
        message.setFrom(new InternetAddress("echoge11@gmail.com"));
        message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(email));
        message.setSubject("GikTek Interns Customer Onboarding Confirmation");

        // Random random = new Random();
        // int code  = random.nextInt(1000, 9000);

        String msg = """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333333;
                    background-color: #ffffff;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                h1 {
                    color: #00796b;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    line-height: 1.6;
                }
                .highlight {
                    font-weight: bold;
                    color: #004d40;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                }
                .no-reply {
                    margin-top: 15px;
                    font-size: 13px;
                    color: #999;
                    font-style: italic;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h1>Welcome to <span class="highlight">erickip</span> Online Store! 🚀</h1>
                <p>Dear Customer,</p>
                <p>Thank you for submitting your details as part of the onboarding process with <strong>GikTek Interns KYC System</strong>.</p>
                <p>We are excited to have you on board. Our team is reviewing your submission, and we’ll notify you once verification is complete.</p>
                <p>If you have any questions, feel free to contact us at <strong>support@erickip.site</strong>.</p>
                <div class="footer">
                    <p>Best regards,</p>
                    <p><strong>GikTek Interns Team</strong></p>
                    <p class="no-reply">Please do not reply to this email. This mailbox is not monitored.</p>
                </div>
                </div>
            </body>
            </html>
        """;

        MimeBodyPart mimeBodyPart = new MimeBodyPart();
        mimeBodyPart.setContent(msg, "text/html; charset=utf-8");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(mimeBodyPart);

        message.setContent(multipart);

        Transport.send(message);
    }
    
}
