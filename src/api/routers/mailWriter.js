const address = 'http://armazemdeec.fe.up.pt:49160';

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
