/*globals energy2d, document interactivesIndex window location $ */
/*jslint indent: 2 */
// ------------------------------------------------------------
//
// Energy2D Demo
//
// ------------------------------------------------------------

var ROOT = "/examples",
    ROOT_REGEX = new RegExp(ROOT + "/.*$"),
    ACTUAL_ROOT = document.location.pathname.replace(ROOT_REGEX, '');

(function () {
  'use strict';
  var
    DEFAULT_INTERACTIVE = "fixed-flux-boundary512",
    window_loaded = $.Deferred(),
    options_loaded = $.Deferred(),
    hash,
    interactive_url,
    interactive_options,
    controller,
    select = $("#select-interactive"),
    enable_WebGL_checkbox = $('#enable-WebGL'),
    force_WebGL_sync_checkbox = $('#force-WebGL-sync'),

    loadInteractive = function () {

    };

  $.each(interactivesIndex, function (key, value) {
    select.append($("<option>")
      .attr('value', key)
      .text(value.name)
      .attr('data-path', value.path));
  });

  hash = document.location.hash || "#" + interactivesIndex[DEFAULT_INTERACTIVE].path;
  document.location.hash = hash;
  interactive_url = hash.substr(1, hash.length);

  select.find("option[data-path='" + interactive_url + "']").attr('selected', true);

  $.get(interactive_url).done(function (results) {
    if (typeof results === "string") { results = JSON.parse(results); }
    interactive_options = results;
    options_loaded.resolve();
  });

  $(window).load(function () {
    window_loaded.resolve();
  });

  $.when(window_loaded, options_loaded).done(function () {
    controller = energy2d.controllers.makeInteractiveController(
      interactive_options, 
      '#interactive-container', 
      '#interactive-description'
    );
  });

  select.change(function (option) {
    document.location.hash = "#" + $(select.find("option:selected")[0]).data('path');
  });

  enable_WebGL_checkbox.change(function(){
    controller.setWebGLEnabled($(this).attr("checked"));
  });

  force_WebGL_sync_checkbox.change(function(){
    energy2d.utils.gpu.gpgpu.setSynchronizationAllowed($(this).attr("checked"));
    controller.simulationReset();
  });

  $(window).bind('hashchange', function () {
    if (document.location.hash !== hash) {
      location.reload();
    }
  });

}());