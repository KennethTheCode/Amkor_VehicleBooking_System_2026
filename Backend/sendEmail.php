<?php
/**
 * sendEmail.php
 *
 * Reusable helper for sending email via PHPMailer + Gmail SMTP.
 * Include this file, then call sendEmailNotification($to, $subject, $body).
 *
 * SETUP (one-time):
 * 1. Install PHPMailer via Composer, from your project root:
 *      composer require phpmailer/phpmailer
 *    This creates a /vendor folder with the autoloader used below.
 *
 * 2. Generate a Gmail "App Password" (NOT your normal Gmail password):
 *      https://myaccount.google.com/apppasswords
 *    (Requires 2-Step Verification to be enabled on the Gmail account.)
 *
 * 3. Fill in GMAIL_ADDRESS and GMAIL_APP_PASSWORD below.
 */

require "PHPMailer/Exception.php";
require "PHPMailer/PHPMailer.php";
require "PHPMailer/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---- CONFIG -----------------------------------------------------------
define("GMAIL_ADDRESS", "paulekennethd@gmail.com");
define("GMAIL_APP_PASSWORD", "cqfmjuodzofockcx");
define("MAIL_FROM_NAME", "Amkor Vehicle Booking System");
// ------------------------------------------------------------------------

/**
 * Sends an email using PHPMailer + Gmail SMTP.
 *
 * @param string $to      Recipient email address
 * @param string $subject Email subject line
 * @param string $body    Email body (HTML allowed)
 * @return array ["success" => bool, "error" => string|null]
 */
function sendEmailNotification($to, $subject, $body) {

    // Basic guard: don't attempt to send to an empty/null address
    if (empty($to)) {
        return [
            "success" => false,
            "error" => "No email address provided."
        ];
    }

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = "smtp.gmail.com";
        $mail->SMTPAuth   = true;
        $mail->Username   = GMAIL_ADDRESS;
        $mail->Password   = GMAIL_APP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom(GMAIL_ADDRESS, MAIL_FROM_NAME);
        $mail->addAddress($to);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody  = strip_tags($body);

        $mail->send();

        return [
            "success" => true,
            "error" => null
        ];

    } catch (Exception $e) {
        return [
            "success" => false,
            "error" => "Mailer error: " . $mail->ErrorInfo
        ];
    }
}