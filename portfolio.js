!function() {
  var portfolio = {
    version: "0.0.1"
  };
  // Parameters
  portfolio._min_width_px = 200;
  portfolio._max_squares_per_row = 3;
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
      var cell_divs = cells.append('a')
          .attr('href', function(d) { return d.link; })
          .attr('target', '_blank')
        .append('div')
          .style("width", function(d) { return d.width + "px"; })
          .style("height", function(d) { return d.width + "px"; })
          .style("background-color", random_colour)
          .attr('class', 'portfolio-item')
          .on('mouseover', function(d) { this.classList.add('active'); })
          .on('mouseout', function(d) { this.classList.remove('active'); })
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
    });
  };

  this.portfolio = portfolio;
}();

portfolio.render('portfolio.csv', d3.select('#content'));
// TODO: It'd be nice to make the loading of images asynchronous
// using Queue.js. The idea would be something like:
// queue()
//   .defer(put_image_onto_div, "filename.png")
//   .await(ready)
// but really you'd want to do it in a data-driven way.
