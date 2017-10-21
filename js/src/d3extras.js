var drop = function (n, args, callback) {
  for (var i = 0; i < args.length - n; ++i) args[i] = args[i + n];
  args.length = args.length - n;
  callback.apply(this, args);
}

d3.transition.prototype.end = function(callback, delayIfEmpty) {
  var f = callback, 
    delay = delayIfEmpty,
    transition = this;

  if (transition.size() === 0) { callback(); }
  
  var args = arguments;

  for (var i = 0; i < args.length - n; ++i) args[i] = args[i + n];
  args.length = args.length - n;

  if (!transition.size() && (delay || delay === 0)) { // if empty
    d3.timer(function() {
      f.apply(transition, args);
      return true;
    }, typeof(delay) === "number" ? delay : 0);
  } else {                      // else Mike Bostock's routine
    var n = 0; 
    transition.each(function() { ++n; }) 
      .on("end", function() { 
        if (!--n) f.apply(transition, args); 
      });
  }

  return transition;
}

d3.selection.prototype.moveToFront = function() {  
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

let getBrowserName = function () {
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browserName  = navigator.appName;
  var fullVersion  = ''+parseFloat(navigator.appVersion); 
  var majorVersion = parseInt(navigator.appVersion,10);
  var nameOffset,verOffset,ix;

  // In Opera, the true version is after "Opera" or after "Version"
  if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
     browserName = "Opera";
     fullVersion = nAgt.substring(verOffset+6);
     if ((verOffset=nAgt.indexOf("Version"))!=-1) 
       fullVersion = nAgt.substring(verOffset+8);
  }
  // In MSIE, the true version is after "MSIE" in userAgent
  else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
     browserName = "Microsoft Internet Explorer";
     fullVersion = nAgt.substring(verOffset+5);
  }
  // In Chrome, the true version is after "Chrome" 
  else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
     browserName = "Chrome";
     fullVersion = nAgt.substring(verOffset+7);
  }
  // In Safari, the true version is after "Safari" or after "Version" 
  else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
     browserName = "Safari";
     fullVersion = nAgt.substring(verOffset+7);
     if ((verOffset=nAgt.indexOf("Version"))!=-1) 
       fullVersion = nAgt.substring(verOffset+8);
  }
  // In Firefox, the true version is after "Firefox" 
  else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset+8);
  }
  // In most other browsers, "name/version" is at the end of userAgent 
  else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
      browserName = nAgt.substring(nameOffset,verOffset);
      fullVersion = nAgt.substring(verOffset+1);
      if (browserName.toLowerCase()==browserName.toUpperCase()) {
         browserName = navigator.appName;
      }
  }
  // trim the fullVersion string at semicolon/space if present
  if ((ix=fullVersion.indexOf(";"))!=-1)
      fullVersion=fullVersion.substring(0,ix);
  if ((ix=fullVersion.indexOf(" "))!=-1)
      fullVersion=fullVersion.substring(0,ix);

  majorVersion = parseInt(''+fullVersion,10);
  if (isNaN(majorVersion)) {
      fullVersion  = ''+parseFloat(navigator.appVersion); 
      majorVersion = parseInt(navigator.appVersion,10);
  }

  return browserName;
}