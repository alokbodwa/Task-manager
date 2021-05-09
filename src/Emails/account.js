const sgMail = require('@sendgrid/mail')

// const sendgridApiKey = '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'

// sgMail.setApiKey(sendgridApiKey)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'alokbodwa@gmail.com',
//     from: 'alokbodwa1@gmail.com',
//     subject: 'My first email',
//     text: 'reply to me if it reached you'

// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alokbodwa1@gmail.com',
        subject: 'Thanks for joining!!',
        text: `Welcome to the app ${name}, We are happy to onboard you. Wish you a great learning experience.`
        // html: 
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alokbodwa1@gmail.com',
        subject: `We are feeling sad ${name}`,
        text: `Your feedback matters a lot to us. Please fill up the form to let us know what went wrong. Hope to see you soon.`
    })
}

module.exports = {
    sendWelcomeEmail, 
    sendCancellationEmail
}
