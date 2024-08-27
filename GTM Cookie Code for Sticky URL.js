<script>
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  // Store gclid in cookie
  var gclid = getParameterByName('gclid');
  if (gclid) {
    setCookie('gclid', gclid, 30); // Store for 30 days
    console.log('GCLID set:', gclid);
  }

  // Function to ensure gclid is in URL
  function ensureGclidInUrl() {
    var storedGclid = getCookie('gclid');
    if (storedGclid) {
      var currentUrl = new URL(window.location.href);
      if (!currentUrl.searchParams.has('gclid')) {
        currentUrl.searchParams.set('gclid', storedGclid);
        history.replaceState(null, '', currentUrl.toString());
        console.log('GCLID appended to URL:', currentUrl.toString());
      }
    }
  }

  // Listen for URL changes
  function listenForUrlChanges() {
    var lastUrl = location.href;
    new MutationObserver(function() {
      var url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        ensureGclidInUrl();
      }
    }).observe(document, {subtree: true, childList: true});
  }

  // Initialize
  function initialize() {
    ensureGclidInUrl();
    listenForUrlChanges();
  }

  // Call initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Also call initialize after a short delay
  setTimeout(initialize, 2000);
</script>