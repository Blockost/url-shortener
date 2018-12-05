function shorten() {
  var link_to_shorten = $('#input_link2shorten')
    .val()
    .trim();

  // TODO: 2018-12-04 Blockost
  // Validate incoming URL with regexp
  // see: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url

  if (link_to_shorten.length > 0) {
    $.ajax('/shorten', {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ original_url: link_to_shorten }),
      success: (data) => {
        console.log(data.short_url);
      }
    });
  }
}
