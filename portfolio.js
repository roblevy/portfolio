!function() {
  var portfolio = {
    version: "0.0.1"
  };
  // Parameters
  portfolio._min_width_px = 200;
  portfolio._max_squares_per_row = 3;
  portfolio.isTouchDevice = 'ontouchstart' in document.documentElement;

  // Functions
  portfolio.layout = function(n) {
    var col = function(i, n) {
      return Math.floor(i / n);
    };
    var row = function(i, n) {
      return i % n;
    };
    var width = function(n) {
      return portfolio._min_width_px;
    };
    return function(objs) {
      var _n = n;
      for (i in objs) {
        var o = objs[i];
        o.x = col(i, _n);
        o.y = row(i, _n);
        o.width = width(n); 
      };
      return objs;
    };
  };

  portfolio.render = function(csv_file, selection) {
    // Render the contents of csv_file to the D3 selection
    var xy_sort = function(a, b) {
      if (a.x === b.x)
      { return a.y - b.y; } else
      { return a.x - b.x; }
    };

    var _jitter = function(range, as_int) {
      return function (x) {
        var delta = Math.random() * range - (range / 2);
        return as_int ? Math.floor(x + delta) : x + delta;
      }};
    var jitter = _jitter(50, as_int=true);

    var random_colour = function() {
      var max = 150, min = 100;
      var colour = Math.floor(Math.random() * (max - min) + min);
      return "rgb(" + jitter(colour) + "," + jitter(colour) + "," + jitter(colour) + ")";
    }

    d3.csv(csv_file, function(objs) {
      // This function runs when CSV file is ready
      var n = objs.length;
      var table = selection.append('table');
      var current_row;
      objs = portfolio.layout(portfolio._max_squares_per_row)(objs).sort(xy_sort);
      for (i in objs) {
        var o = objs[i];
        if (i === 0 || o.y === 0) {
          current_row = table.append('tr');
        }
        current_row
          .append('td');
      }
      var cells = d3.selectAll('td').data(objs);
      var cell_divs = cells
        .append('div')
          .style("width", function(d) { return d.width + "px"; })
          .style("height", function(d) { return d.width + "px"; })
          .style("background-color", random_colour)
          .attr('class', 'portfolio-item')
      ;

      cell_divs.append('div')
          .attr('class', 'portfolio-description')
          .text(function(d) { return d.description; });

      cell_divs.append('img')
          .attr('class', 'portfolio-image')
          .attr('src', function(d) { return "images/" + d.image; })
          .attr('href', function(d) { return d.link; })
      ;
      
      cells.append('div')
        .attr('class', 'portfolio-title')
        .text(function(d) { return d.title; });

      portfolio.add_interaction();
    });
  };

  portfolio.add_interaction = function() {
      // TODO: This stuff STILL doesn't work.
      // I can't get an <a> element to only be clicked when
      // there's something on top of it. Might need to append
      // the <a> only when mouseover and remove it when mouseout
    var items = d3.selectAll('.portfolio-item');
    if (portfolio.isTouchDevice) {
        // Mobile interaction
        items
            .on('mouseover', function(d) { this.classList.add('touched'); })
            .on('mouseout', function(d) { this.classList.remove('touched'); });
        items = items.select('.portfolio-description');
    } else {
        // Desktop interaction
        // This adds a "wrapper" anchor element
        // to each .portfolio-item
        items
            .on('mouseover', function(d) { console.log('mouseover!'); this.classList.add('active'); })
            .on('mouseout', function(d) { this.classList.remove('active'); })
    }
    items.each( function() {
        d3.select(this.parentNode).append('a') 
        .attr('href', function(d) { return d.link; })
        .attr('target', '_blank')
        .node().appendChild(this) });
  };

  this.portfolio = portfolio;
}();

portfolio.render('portfolio.csv', d3.select('#content'));
