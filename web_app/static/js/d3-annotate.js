(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-drag'), require('d3-selection')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-drag', 'd3-selection'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, (function (exports,d3Drag,d3Selection) { 'use strict';

// https://github.com/d3/d3-selection-multi/blob/master/src/selection/attrs.js
function attrsFunction(selection$$1, map) {
  return selection$$1.each(function() {
    var x = map.apply(this, arguments), s = d3Selection.select(this);
    for (var name in x) s.attr(name, x[name]);
  });
}

function attrsObject(selection$$1, map) {
  for (var name in map) selection$$1.attr(name, map[name]);
  return selection$$1;
}

var selection_attrs = function(map) {
  return (typeof map === "function" ? attrsFunction : attrsObject)(this, map);
}

// hacky :( could not get rollup to play nice with d3-selection-multi. << TODO
// import "d3-selection-multi";
d3Selection.selection.prototype.attrs = selection_attrs;

var annotate = function() {
  var keyFn = (_, ndx) => ndx,
      textFn = (d) => d,
      getKey = (d) => d.key,
      container,
      saved,
      mapAnnotationData = (node) => {
        return { data: node.__data__,
                 key: node.__key__,
                 box: node.getBBox() }; },
      displayAttrs = {
        x: (d) => d.box.x + (d.box.width / 2),
        y: (d) => d.box.y + (d.box.height / 2),
        'text-anchor': 'middle'
      },
      show = true,
      dragControl = d3Drag.drag()
        .on("start", function() { this.classList.add('dragging'); })
        .on("end", function() { this.classList.remove('dragging'); })
        .on("drag", function () {
          var el = d3Selection.select(this);
          el.attr('x', +el.attr('x') + d3Selection.event.dx);
          el.attr('y', +el.attr('y') + d3Selection.event.dy);
        });

  //
  // svg.selectAll('.city').call(annotation) ->
  function annotate(_selection) {

    // serialize keys for saving/joining
    _selection.nodes().forEach((el, ndx) => {
      el.__key__ = keyFn(el.__data__, ndx).toString() });

    // click selection el to create annotation
    _selection.on('click', function() { appendText(d3Selection.select(this)); });

    // prepopulate and/or add saved annotations
    if(show) { appendText(_selection, true); }
    if(saved) { appendTextFromData(_selection, saved); }
  }

  //
  //
  function buildAnnotation(sel) {
    sel.attr('class', 'annotation with-data')
      .attrs(displayAttrs)
      .call(dragControl)
      .on('click', function() {
        if(d3Selection.event.metaKey) { this.remove(); }
        else if(d3Selection.event.shiftKey) { _editText(d3Selection.select(this)); }
      });
  }

  //
  // add new data bound <text> annotation
  function appendText(sel, filter) {
    var _sel = (show instanceof Function && filter) ? sel.filter(show) : sel,
        _textFn = (d) => textFn(d.data),
        annotationData = _sel.nodes().map(mapAnnotationData);

    var textSel = container.selectAll('text.with-data').data(annotationData, getKey);
    textSel.enter().append('text')
      .text(_textFn)
      .call(buildAnnotation);
  }
  function appendTextFromData(sel) {
    var savedKeys = Object.keys(saved),
        savedNodes = sel.filter(function() {
          return savedKeys.indexOf(this.__key__) !== -1; }),
        savedData = savedNodes.nodes().map(mapAnnotationData);

    var savedSel= container.selectAll('text.with-data').data(savedData, getKey);
    savedSel.enter().append('text').call(buildAnnotation)
      .merge(savedSel)
        .text((d) => saved[d.key].text)
        .attr('x', (d) => saved[d.key].x)
        .attr('y', (d) => saved[d.key].y);
  }

  //
  // text editor
  function _editText(el) {
    d3Selection.select('body').append('input')
      .attr('type', 'text')
      .attr('class', 'd3-an-text-edit')
      .attr('value', el.text())
      .on('keyup', function() { d3Selection.event.keyCode === 13 && this.blur(); }) // ESC
      .on('focusout', function() { el.text(this.value) && this.remove(); })
      .node().focus();
  }

  //
  // return serialize pojo of annotations
  annotate.serialize = function() {
    var annotations = {};
    container.selectAll('text.with-data').each(function() {
      var sel = d3.select(this);
      annotations[this.__data__.key] = {
        x: sel.attr('x'),
        y: sel.attr('y'),
        text: sel.text()
      };
    });
    return annotations;
  };

  //
  // properties
  annotate.container = function(_) {
    if(!arguments.length) return container;
    container = _;
    container.classed('d3-an-container', true);
    return annotate;
  };

  // TODO:
  //  - handle Array for dataless annotation
  //  - joining multiple .saved() calls
  annotate.saved = function(_) {
    saved = _;
    return annotate;
  };
  annotate.text = function(_) {
    if(!arguments.length) return text;
    textFn = _; return annotate;
  };
  annotate.key = function(_) {
    if(!arguments.length) return keyFn;
    keyFn = _; return annotate;
  };
  annotate.show = function(_) {
    if(!arguments.length) return show;
    show = _; return annotate;
  };
  annotate.attr = function(attrName) {
    if(!attrName) {
      return displayAttrs;
    } else if(arguments.length === 1) {
      return displayAttrs[attrName];
    } else {
      arguments[1] === null ? (delete displayAttrs[attrName]) :
                              (displayAttrs[attrName] = arguments[1]);
      return annotate;
    }
  };

  return annotate;
}

exports.annotate = annotate;

Object.defineProperty(exports, '__esModule', { value: true });

})));