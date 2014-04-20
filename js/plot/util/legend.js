var d3 = require('../../lib/').d3;
var _ = require('../../lib/')._;

var log = require('../../lib/').bows('Shapes');

var legend = {
  SHAPE_MARGIN: 3,
  SHAPE_WIDTH: 16,
  basal: [
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('rect')
          .attr({
            'class': 'd3-basal d3-rect-basal d3-legend'
          });
      },
      type: 'rect'
    },
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('Delivered')
          .each(function() {
            opts.widths.push(this.getBBox().width);
            opts.textHeight = this.getBBox().height;
          });
      },
      type: 'text'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('rect')
          .attr({
            'class': 'd3-basal d3-rect-basal-undelivered'
          });
      },
      type: 'rect'
    },
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('Scheduled')
          .each(function() {
            opts.widths.push(this.getBBox().width);
          });
      },
      type: 'text'
    }
  ],
  bg: [
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('High')
          .each(function() {
            opts.widths.push(this.getBBox().width);
            opts.textHeight = this.getBBox().height;
          });
      },
      type: 'text'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('circle')
          .attr({
            'class': 'd3-smbg d3-circle-smbg d3-bg-high'
          });
      },
      type: 'circle'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('circle')
          .attr({
            'class': 'd3-smbg d3-circle-smbg d3-bg-high d3-circle-open'
          });
      },
      type: 'circle'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('circle')
          .attr({
            'class': 'd3-smbg d3-circle-smbg d3-bg-target'
          });
      },
      type: 'circle'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('circle')
          .attr({
            'class': 'd3-smbg d3-circle-smbg d3-bg-low d3-circle-open'
          });
      },
      type: 'circle'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('circle')
          .attr({
            'class': 'd3-smbg d3-circle-smbg d3-bg-low'
          });
      },
      type: 'circle'
    },
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('Low')
          .each(function() {
            opts.widths.push(this.getBBox().width);
          });
      },
      type: 'text'
    },
  ],
  bolus: [
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('rect')
          .attr({
            'class': 'd3-bolus d3-rect-bolus'
          });
      },
      type: 'rect'
    },
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('Delivered')
          .each(function() {
            opts.widths.push(this.getBBox().width);
            opts.textHeight = this.getBBox().height;
          });
      },
      type: 'text'
    },
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('rect')
          .attr({
            'class': 'd3-bolus d3-rect-recommended'
          });
      },
      type: 'rect'
    },
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('Recommended')
          .each(function() {
            opts.widths.push(this.getBBox().width);
            opts.textHeight = this.getBBox().height;
          });
      },
      type: 'text'
    }
  ],
  carbs: [
    {
      create: function(opts) {
        opts.widths.push(opts.SHAPE_WIDTH);
        return opts.selection.append('rect')
          .attr({
            'class': 'd3-rect-carbs'
          });
      },
      type: 'rect'
    },
    {
      create: function(opts) {
        return opts.selection.append('text')
          .attr({
            'class': 'd3-pool-legend'
          })
          .text('Carbs')
          .each(function() {
            opts.widths.push(this.getBBox().width);
            opts.textHeight = this.getBBox().height;
          });
      },
      type: 'text'
    }
  ],
  cumWidth: function(a, i) {
    var b = a.slice();
    b.splice(i);
    return _.reduce(b, function(sum, num) { return sum + num; });
  },
  draw: function(selection, type) {
    var opts = {
      selection: selection,
      widths: [],
      SHAPE_WIDTH: this.SHAPE_WIDTH
    };
    var typeFns = this[type];
    _.each(typeFns, function(fn, i) {
      var created = fn.create(opts), w;
      if (fn.type === 'text') {
        if (opts.widths[i - 1]) {
          w = this.cumWidth(opts.widths, i);
          if ((i === typeFns.length - 1) && (i !== 1)) {
            var s = this.SHAPE_WIDTH - this.SHAPE_MARGIN*2;
            created.attr('transform', 'translate(' + (-(w + s/2)) + ',0)');
          }
          else {
            created.attr('transform', 'translate(' + (-w) + ',0)');
          }
        }
      }
      else if (fn.type === 'circle') {
        if (opts.widths[i - 1]) {
          w = this.cumWidth(opts.widths, i);
          var r = (this.SHAPE_WIDTH - this.SHAPE_MARGIN*2)/2;
          created.attr({
            'cx': -(w + 2*r),
            'cy': -opts.textHeight/2,
            'r': r
          });
        }
      }
      else if (fn.type === 'rect') {
        var side = this.SHAPE_WIDTH - this.SHAPE_MARGIN*2;
        created.attr({
          'width': side,
          'height': side
        });
        if (opts.widths[i - 1]) {
          w = this.cumWidth(opts.widths, i);
          created.attr({
            'x': -w - this.SHAPE_WIDTH
          });
        }
        else {
          created.attr({
            'x': -side - 1.5
          });
        }
      }
    }, this);
    if (type !== 'bg') {
      selection.selectAll('rect')
        .attr('y', -(opts.textHeight - this.SHAPE_MARGIN*2));
    }
    var w;
    selection.each(function() { w = this.getBBox(); });
    return w;
  }
};

module.exports = legend;