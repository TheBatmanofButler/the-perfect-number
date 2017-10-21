var drop = function(n, args, callback) {
  for (var i = 0; i < args.length - n; ++i)
    args[i] = args[i + n];
  args.length = args.length - n;
  callback.apply(this, args);
};
d3.transition.prototype.end = function(callback, delayIfEmpty) {
  var f = callback,
      delay = delayIfEmpty,
      transition = this;
  if (transition.size() === 0) {
    callback();
  }
  var args = arguments;
  for (var i = 0; i < args.length - n; ++i)
    args[i] = args[i + n];
  args.length = args.length - n;
  if (!transition.size() && (delay || delay === 0)) {
    d3.timer(function() {
      f.apply(transition, args);
      return true;
    }, typeof(delay) === "number" ? delay : 0);
  } else {
    var n = 0;
    transition.each(function() {
      ++n;
    }).on("end", function() {
      if (!--n)
        f.apply(transition, args);
    });
  }
  return transition;
};
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};
