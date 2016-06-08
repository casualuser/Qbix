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

Q.Tool.define("Assets/amazon", function(options) {

/*  
  if (!options.publisherId || !options.streamName) {
    throw "Assets/amazon tool missing something";
  }
*/

  if (!Q.Users.loggedInUser) {
      tool.element.style.display = 'none';
      console.warn("Assets/amazon: Don't render tool when user is not logged in");
      return;
  }

  // proceed to construct the tool
  var tool = this;
  var state = tool.state;
  var $te = $(tool.element);
  
  // draw the tool, see method below
  this.refresh();
  this.draw();

},

{ // DEFAULT OPTIONS

  publisherId: null,
  streamName: null,

  editable: false,
  imagepicker: {
    showSize: "x200",
    fullSize: "x"
  },
  showFile: null,
  throbber: "plugins/Q/img/throbbers/bars32.gif",
  templates: {
    view: {
      name: 'Assets/amazon/response/results',
      fields: { 
        alt: 'image', 
        titleClass: '', 
        titleTag: 'h2'
      }
    }
  },
  onChoose: new Q.Event(),  
  onSelect: new Q.Event(),
  onFilter: new Q.Event(),  
  onCreate: new Q.Event(),
  onUpdate: new Q.Event(),
  onRefresh: new Q.Event()
},

{ // YOUR TOOL'S METHODS

  
  draw: function (callback) {
    var tool = this;
    var state = tool.state;
    var $te = $(tool.element);

    $items = tool.$('[data-assets-amazon], .Assets_amazon_tool');

    Q.Template.render(
        'Assets/amazon/response/wishlist',
        $items,
        function (err, html) {

            if (err) {
                return;
            }

            var options = {};

            var filterAmazon = Q.Tool.setUpElement(
                'div',
                'Q/filter',
                options,
                tool.prefix + 'filter'
            );

            tool.$(filterAmazon)
                .appendTo($te)
                .activate(
                    function () {

                        var tool = this;
                        var state = tool.state;

                        state.onFilter.set(
                          function (query, element) {

                              var latest = Q.latest(this);

                              Q.req("Assets/amazon", 'results', 
                                function (err, response) {

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
                                },
                                {
                                  fields: {
                                      input: query
                                  }
                              });

                          }, tool);
                });

            $te.append(html);
            });
  },

  refresh: function (callback) {
    var tool = this;
    var state = tool.state;
    // code to refresh the whole tool
    // then e.g. trigger an event

    Q.Template.render(
      state.templates.view.name,
      function (err, html) {
        tool.element.innerHTML = html;
        Q.activate(tool.element,
        function () {
          // save some references for later
          tool.$abc = tool.$('.First_abc');
          // trigger event for others to hook
//          tool.onRefresh.handle.call(tool);    
          // also see tool.rendering()
        });
      }
    );
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
}

);

Q.Template.set('Assets/amazon/response/wishlist', 
    '<div class="Assets_amazon_image">'
    + '</div>'    
    + '<div class="Assets_amazon_price">'
    + '</div>'
);

Q.Template.set('Assets/amazon/response/results',
    '{{#if results}}'
    + '<ul>'
    + '{{#each results}}'
    + '<li class="Wishes_amazon_results_item" data-index={{@index}} data-asin={{ASIN}}>'
    + '<img class="Wishes_amazon_results_image" src="{{pic}}" alt="{{alt}}">'
    + '<div>'
    + '<span class="Wishes_amazon_results_title"><h3>{{title}}</h3></span>'
    + '<span class="Wishes_amazon_results_price">{{price}}</span>'
    + '</div>'
    + '<br>'
    + '</li>'
    + '{{/each}}'
    + '</ul>'
    + '{{/if}}'
);


})(window.jQuery, window);