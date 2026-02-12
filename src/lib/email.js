// Placeholder for email service
// In a real app, this would send emails via SendGrid or SMTP

export const emailService = {
  sendOrderConfirmation: (order) => {
    console.log('Sending order confirmation email for order:', order.id)
  },
  sendAdminNotification: (order) => {
    console.log('Sending admin notification for order:', order.id)
  },
}
