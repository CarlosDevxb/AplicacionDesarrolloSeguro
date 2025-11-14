const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  // 1. Establecer la API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // 2. Construir el mensaje
  const msg = {
    to: options.email,
    from: {
      name: 'CHAFATEC',
      email: process.env.SENDGRID_FROM_EMAIL
    },
    subject: options.subject,
    text: options.message,
    html: options.html, // Añadimos la opción para enviar contenido HTML
  };

  // 3. Enviar el correo usando la API de SendGrid
  await sgMail.send(msg);
};

module.exports = sendEmail;