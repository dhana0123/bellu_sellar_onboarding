import * as SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.htmlContent;
    sendSmtpEmail.textContent = params.textContent || params.htmlContent.replace(/<[^>]*>/g, '');
    sendSmtpEmail.sender = { name: 'bellu.ai', email: 'noreply@bellu.ai' };
    sendSmtpEmail.to = [{ email: params.to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (error: any) {
    console.error('Brevo email error:', error);
    return { success: false, error: error.message };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateVerificationEmail(otp: string, brandName: string): { subject: string; htmlContent: string } {
  const subject = 'Verify your email for bellu.ai integration';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Email Verification - bellu.ai</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #000000; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #000000; font-size: 28px; font-weight: bold; }
            .content { background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #cccccc; }
            .otp-code { font-size: 36px; font-weight: bold; color: #000000; text-align: center; 
                       background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; 
                       letter-spacing: 8px; border: 2px solid #000000; }
            .text { line-height: 1.6; color: #333333; }
            .footer { text-align: center; margin-top: 30px; color: #666666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">bellu.ai</div>
                <p style="color: #000000;">10-Minute Delivery Infrastructure</p>
            </div>
            
            <div class="content">
                <h2 style="color: #000000; margin-top: 0;">Email Verification Required</h2>
                
                <p class="text">Hello ${brandName},</p>
                
                <p class="text">Welcome to bellu.ai! To complete your seller onboarding and activate our 10-minute delivery infrastructure for your brand, please verify your email address.</p>
                
                <p class="text">Your verification code is:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p class="text">Enter this code in the verification form to complete your registration. This code will expire in 10 minutes for security purposes.</p>
                
                <p class="text">Once verified, you'll receive your unique API key to start integrating with our delivery network.</p>
                
                <p class="text">If you didn't request this verification, please ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>© 2024 bellu.ai - India's Fastest Delivery Infrastructure</p>
                <p>This is an automated email. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return { subject, htmlContent };
}