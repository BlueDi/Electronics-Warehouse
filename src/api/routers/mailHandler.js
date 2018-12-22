var nodeMailer = require('nodemailer');
var markdown = require('nodemailer-markdown').markdown;

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'plataforma.armazem@gmail.com',
    pass: 'armazemplataforma1'
  },
  tls: { rejectUnauthorized: false }
});

transporter.use('compile', markdown(undefined));

const address = 'http://armazemdeec.fe.up.pt:49160';

var mailOptions = {
  from: 'plataforma.armazem@gmail.com',
  to: undefined,
  subject: undefined,
  markdown: undefined
};

/**
 * Module used to write an email using markdown elements
 */
module.exports = {
  /**
   * Adds simple text field to the current email text
   * @param  {String} current Current text
   * @param  {String} text    The text to be added to the current text
   * @return {String}         Modified current text
   */
  addText: function(current, text) {
    return current + text;
  },

  /**
   * Adds a link to the current text
   * @param  {String} current     Current text
   * @param  {String} display_txt Text to be displayed instead of link
   * @param  {String} link        Link to be embedded
   * @param  {String} post_txt    Text to be added after the link
   * @return {String}             Modified current text
   */
  addLink: function(current, display_txt, link, post_txt) {
    return current + '[' + display_txt + '](' + address + link + ')' + post_txt;
  },

  /**
   * Adds a bold text to the current text
   * @param  {String} current  Current text
   * @param  {String} text     Text to be bolded up
   * @param  {String} post_txt Text to be added after the bold text
   * @return {String}          Modified current text
   */
  addBold: function(current, text, post_txt) {
    return current + '**' + text + '**' + post_txt;
  },

  /**
   * Adds a bold text to the current text
   * @param  {String} current  Current text
   * @param  {String} text     Text to be bolded up
   * @param  {String} post_txt Text to be added after the bold text
   * @return {String}          Modified current text
   */
  addItalic: function(current, text, post_txt) {
    return current + '*' + text + '*' + post_txt;
  },

  /**
   * Adds a list to the current text
   * @param  {String} current  Current text
   * @param  {Object} list     Array of texts
   * @param  {String} post_txt Text to be added after the bold text
   * @return {String}          Modified current text
   */
  addUnorderedList: function(current, list, post_txt) {
    for (var i = 0; i < list.length; i++) {
      const elem = list[i];
      current = current + '* ' + elem + '\n';
    }

    return current + post_txt;
  },

  /**
   * Adds a horizontal rule to the text
   * @param  {String} current  Current message
   * @param  {String} post_txt Text to be added after the rule
   * @return {String}          @current added with the rule and @post_txt
   */
  addRule: function(current, post_txt) {
    return current + '\n---\n' + post_txt;
  },

  /**
   * Builds the email header
   * @param  {String} msg  Current message
   * @param  {String} name Name of the student that has made the request
   * @return {String}      @msg but with added header
   */
  emailHeader: function(msg, name) {
    msg = this.addText(msg, 'Student ');
    msg = this.addBold(msg, name, ' ');
    msg = this.addText(msg, 'has requested the items:\n\n');
    return msg;
  },

  /**
   * Inserts the body of the email
   * @param  {String} msg        Current message
   * @param  {Object} items      Array of items
   * @param  {String} details    Details inserted by the user
   * @param  {Number} request_id Number of the request, to be used for linking purposes
   * @return {String}            @msg with added body
   */
  emailBody: function(msg, items, details, request_id) {
    msg = this.addUnorderedList(msg, items, '\n\n');
    msg = this.addBold(msg, 'Details:', '\n');
    msg = this.addRule(msg, '');
    msg = this.addText(msg, details + '\n');
    msg = this.addRule(msg, '\n');
    msg = this.addText(msg, 'Here is the direct link to the ');
    msg = this.addLink(msg, 'request', '/request/' + request_id, '');
    return msg;
  },

  /**
   * Adds a footer to the message
   * @param  {String}  msg            Current message
   * @param  {Boolean} is_professor   Whether the message is to be sent to a professor or not
   * @param  {String}  professor_name Name of the professor
   * @return {String}                 @msg added with the footer
   */
  emailFooter: function(msg, is_professor, professor_name) {
    if (!is_professor) {
      let new_msg =
        msg + '\n\n' + 'Professor ' + this.addBold('', professor_name, '');
      return (
        new_msg +
        ' has received the request.\nYou will be notified once it is accepted!'
      );
    } else {
      return msg + '\n\n' + 'Please review the request as soon as possible';
    }
  },

  /**
   * Sends a single email to the given recepients
   * @param  {String} msg     Message to be sent
   * @param  {String} to      Email to send the message to
   * @param  {String} subject Subject of the email
   */
  sendEmail: function(msg, to, subject) {
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.markdown = msg;
    transporter.sendMail(mailOptions, this.mailCallBack);
  },

  /**
   * Generic callback when sening an email
   * @param  {Object} err  Error object
   * @param  {Object} info Info  object
   */
  mailCallBack: function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent!\n - ' + info);
    }
  }
};
