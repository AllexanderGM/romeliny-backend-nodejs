import nodemailer from "nodemailer";
import twilio from "twilio";
import { Router } from "express";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const router = Router();

router.post("/email", (req, res) => {
    // Endpoint para enviar email
    const transporter = nodemailer.createTransport({
        // Configuraciones del transportador de nodemailer para enviar el email
        host: "smtp.ethereal.email",
        post: 587,
        secure: false,
        auth: {
            // Credenciales de la cuenta de correo
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        // Opciones del email
        from: req.body.from, // Correo del remitente
        to: req.body.to, // Correo del destinatario
        subject: req.body.subject, // Asunto del email
        text: req.body.text, // Contenido del email (texto plano)
    };

    transporter.sendMail(mailOptions, (error, _) => {
        // Envío del email
        if (error) {
            res.status(500).send({
                error: error.message,
            });
        } else {
            res.status(200).send({
                message: "Email sent successfully",
            });
        }
    });
});

router.post("/whatsapp", (req, res) => {
    // Endpoint para enviar SMS (WhatsApp)

    twilioClient.messages
        .create({
            // Envío del SMS
            from: process.env.TWILIO_PHONE_NUMBER, // Número de teléfono de Twilio
            to: req.body.to, // Número de teléfono del destinatario
            body: req.body.body, // Contenido del SMS
        })
        .then((_) => {
            res.status(200).send({
                message: "SMS sent successfully",
            });
        })
        .catch((error) => {
            res.status(500).send({
                error: error.message,
            });
        });
});

export default router;
