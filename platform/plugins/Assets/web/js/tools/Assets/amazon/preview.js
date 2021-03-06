(function ($, window, undefined) {

/**
 * @module Assets-tools
 */

/**
 * Implements an input field that send search string to Amazon Product store and retrieve top ten relevant products
 * @class Assets Amazon tool
 * @constructor
 * @param {Object} [options] options to pass to this tool, so far nothing
 * @return {Q.Tool}
 */

Q.Tool.define("Assets/amazon/preview", "Streams/preview", function(options, preview) {

  if (!Q.Users.loggedInUser) {
    tool.element.style.display = 'none';
      console.warn("Assets/amazon: Don't render tool when user is not logged in");
    return;
  }

  var ps = preview.state;
  this.preview = preview;

  // proceed to construct the tool
  var tool = this;
  var state = tool.state;
  var $te = $(tool.element);

  // draw the tool
  ps.onRefresh.add(tool.refresh.bind(tool), tool);

  $te.on(Q.Pointer.fastclick, '.Assets_amazon_results_item', tool, function () {

      options.streamName = tool.preview.state.streamName;
      options.publisherId = tool.preview.state.publisherId;

      var asin = $(this).attr('data-asin');
      var title = $(this).attr('data-title');
      var image = $(this).attr('data-image');

      Q.Streams.get(options.publisherId, options.streamName, function(err) {

        if (err) return;

        var stream = this;

        stream.pendingFields = 
          { title: title,
            icon: image };

        stream.set({
          'asin': asin, 
          'title': title,
          'icon': image
          // 'price': price, 
          // 'productId': productId,
          // 'storeId': storeId,
          // 'currency': currency
        });
        stream.save();
        stream.refresh();
      });

      tool.filter = Q.Tool.from(tool.$('.Q_filter_tool'), 'Q/filter');
      tool.filter.input = tool.filter.$('.Q_filter_input');
      tool.filter.input.attr('value', '');
      tool.filter.input.next().show();
      tool.filter.end();
  });

},

{ // DEFAULT OPTIONS
  onChoose: new Q.Event(),  
  onSelect: new Q.Event(),
  onFilter: new Q.Event(),  
  onCreate: new Q.Event(),
  onUpdate: new Q.Event(),
  onRefresh: new Q.Event()
},

{ // YOUR TOOL'S METHODS

  refresh: function (stream) {
    var tool = this;
    var state = tool.state;
    var $te = $(tool.element);
    var options = {};

    options.streamName = tool.preview.state.streamName;
    options.publisherId = tool.preview.state.publisherId;

    var fields = {icon: tool.preview.stream.fields.icon};

    Q.Template.render(
        'Assets/amazon/response/wishlist',
        fields,
        function (err, html) {

            if (err) return;

            options.streamName = tool.preview.state.streamName;
            options.publisherId = tool.preview.state.publisherId;

            var filterAmazon = Q.Tool.setUpElement(
                'div',
                'Q/filter',
                options,
                tool.prefix + 'filter'
            );

            Q.replace(tool.element, null);

            $(filterAmazon)
                .appendTo($te)
                .activate(
                    function () {

                        var tool = this;
                        var state = tool.state;

                        state.onFilter.set(
                          function (query, element) {

                              var latest = Q.latest(tool);

                              Q.req("Assets/amazon", 'results',
                                function (err, response) {

                                  if (Q.latest(tool, latest)) {

                                    var msg = Q.firstErrorMessage(err, response && response.errors);
                                    if (msg) {
                                        return console.warn(msg);
                                    }

                                    var results = response.slots.results;
                                    var fields = {results: ''};
                                    if (results) {
                                        fields = {results: results};
                                    }

                                    Q.Template.render(
                                        'Assets/amazon/response/results',
                                        fields,
                                        function (err, html) {
                                            $(element).html(html);
                                        }
                                    );
                                  }
                                },
                                {
                                  fields: {
                                      input: query
                                  }
                              });

                          }, tool);
                }, options);

            var e = Q.Tool.setUpElement('div', "Streams/preview", options, tool.prefix + 'stream');
            Q.Tool.setUpElement(e, "Streams/inplace", Q.extend(options, {field: 'title'}), tool.prefix + 'title');

            Q.Streams.Stream.onFieldChanged(options.publisherId, options.streamName, 'icon').set(

            //handler
            function (fields) {
              var src = fields.icon;
              tool.$(".Streams_image_preview_icon").attr('src', src);
            }, tool);

            tool.element.appendChild(e);
            Q.activate(e);

            $te.append(html);
            }, options);
  },

  // optional methods for your tool
  // that would be called by Qbix
  Q: {
    onInit: function () {
      // occurs after onInit
      // of all child tools
    },
    beforeRemove: function () {
      // clean up anything you've attached
      // to the elements, such as
      // jQuery event handlers, data, etc.
    },
    onRetain: function (newOptions) {
      // compare newOptions to this.state
      // and update the tool's appearance.
      // after this event, the tool's
      // state will be extended with
      // the new options.
    },
    onLayout: function (elem, container) {
      // Occurs if the layout is being
      // updated for this tool's element.
      // If you want more fine-grained control
      // then use Q.onLayout(element) instead.
    }
  }
});

Q.Template.set('Assets/amazon/response/wishlist', '<img alt="{{alt}}" class="Streams_image_preview_icon" src={{icon}}>');

Q.Template.set('Assets/amazon/response/results',
    '{{#if results}}'
    + '<ul>'
    + '{{#each results}}'
    + '<li class="Assets_amazon_results_item" data-index={{@index}} data-asin={{ASIN}} data-title="{{title}}" data-image={{pic}}>'
    + '<img class="Assets_amazon_results_image" src="{{pic}}" alt="{{alt}}">'
    + '<div>'
    + '<span class="Assets_amazon_results_title"><h3>{{title}}</h3></span>'
    + '<span class="Assets_amazon_results_price">{{price}}</span>'
    + '</div>'
    + '<br>'
    + '</li>'
    + '{{/each}}'
    + '</ul>'
    + '{{/if}}'
);

})(window.jQuery, window);