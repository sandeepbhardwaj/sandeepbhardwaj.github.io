// The method is explained here -> https://alexpearce.me/2012/04/escaping-liquid-tags-in-jekyll/
// Replaces <%  %> with {% %}
// Replaces <%=  %> with {{ }}
(function(window, document, undefined) {
  var replaceERBTags = function(elements) {
    elements.each(function() {
      var $this = $(this),
          txt   = $this.html();
      // Replace <%=  %> with {{ }}
      txt = txt.replace(new RegExp('&lt;%=(.+?)%&gt;', 'g'), '{{$1}}');
      // Replace <% %> with {% %}
      txt = txt.replace(new RegExp('&lt;%(.+?)%&gt;', 'g'), '{%$1%}');
      $this.html(txt);
    });
  };

  // Define the app object and expose it in the global scope
  window.fixliquid = {
    replaceERBTags: replaceERBTags
  };
})(window, window.document);

$(function() {
  // Change this according to your need
  // Pygment on jekyll outputs <div class="highlight"><code class="language-text" data-lang="text"> so,
  fixliquid.replaceERBTags($('div.highlight').find('code.language-text'));
  // ... and in inline code
  fixliquid.replaceERBTags($('code'));
});