// Responsible for graph animation.
var renderer;
// The graph itself.
var graph;
// It's a status, and when true, means that is waiting for node selection.
var selecting_nodes = false;
// The selected nodes, filled when selecting_nodes is true.
var selected_nodes = [];

// First method to be called.
function main(answers) {
  var graphics = Viva.Graph.View.svgGraphics();
  graphics.node(nodeLayout)
    .placeNode(placeNodeWithTransform);
  graphics.link(linkLayout)
    .placeLink(placeLinkd);

  graph = Viva.Graph.graph();
  generateRandomLinks(answers);

  renderer = Viva.Graph.View.renderer(graph, {
    graphics: graphics,
    container: document.getElementById('graph-container')
  });

  renderer.run();
}

// Get data to place in graph.
function getData() {
  $.ajax({
     type: "GET",
     contentType: "application/json; charset=utf-8",
     url: 'data',
     dataType: 'json',
     success: function (data) {
         main(data);
     }
   });
}

// Drop the graph.
function dispose() {
  renderer.dispose();
}

// Pause the graph animation.
function pause() {
  renderer.pause();
}

// Resume the graph animation.
function resume() {
  renderer.resume();
}

// Reset the graph animation.
function reset() {
  renderer.reset();
}

// Link layout design.
function linkLayout(link) {
  var ui = Viva.Graph.svg('path')
    .attr('stroke', 'black')
    .attr('stroke-width', 5)
    .attr('id', buildIdFromLinkObject(link));

  $(ui).dblclick(function() {
    $(this).attr('stroke', 'yellow');
    $.ajax({
       type: "GET",
       url: 'link',
       dataType: 'script',
       data: { link_html_id: $(this).attr('id'),
               answer_1: link.data.answer_1,
               answer_2: link.data.answer_2
             }
     });
  });

  return ui;
}

// Node layout design.
function nodeLayout(node) {
  var radius = 20;
  var ui = Viva.Graph.svg('g');

  var text_ui = Viva.Graph.svg('text')
    .attr('y', '-25px')
    .attr('width','20');

  var span_ui = Viva.Graph.svg('tspan')
    .attr("x","-25px")
    .attr("dy","1.2em")
    .text(node.data.user.name + " #" + node.data.exercise.name);

  var circle = Viva.Graph.svg('circle')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('fill', setNodeCollor(node.data.correct))
    .attr('r', radius)
    .attr('id', 'node_' + node.data.id)

  $(circle).dblclick(function(){
    $(this).attr('fill', setNodeCollor(node.data.correct, true));
    $.ajax({
       type: "GET",
       url: 'node',
       dataType: 'script',
       data: { answer: node.data, node_html_id: $(this).attr('id') }
     });
  });

  $(circle).click(function() {
    if (selecting_nodes) {
      $(this).attr('fill', setNodeCollor(node.data.correct, true));
      if (selected_nodes[0] == undefined)
        selected_nodes[0] = node;
      else if (selected_nodes[1] == undefined && node != selected_nodes[0]) {
        selected_nodes[1] = node;
        // The link is displayed only if the graph animation is activated once again.
        informGraphPage();
        addLink();
        resetNodeSelection();
      }
    }
  });

  text_ui.append(span_ui);
  ui.append(text_ui);
  ui.append(circle);

  return ui;
}

// Node position.
function placeNodeWithTransform(nodeUI, pos) {
  nodeUI.attr('transform', 'translate(' + (pos.x - 12) + ',' + (pos.y - 12) + ')');
}

// Link position.
function placeLinkd(linkUI, fromPos, toPos) {
  var data = 'M' + (fromPos.x + 10) + ',' + (fromPos.y + 10) +
             'L' + (toPos.x + 10) + ',' + (toPos.y + 10);
  linkUI.attr("d", data);
}

// When selection is ended, the nodes are filled again with their original collor.
function changeSelectedNodesColor() {
  for (var i in selected_nodes)
    $("#node_" + selected_nodes[i].id).attr('fill', setNodeCollor(selected_nodes[i].data.correct));
}

// Logic to set node color, according answer status.
function setNodeCollor(correct, selected = false) {
  if (selected)
    return "yellow";
  else if (correct)
    return "green"
  return "red"
}

// Create random links.
function generateRandomLinks(answers, qt_connections = 50) {
  for (i = 0; i < qt_connections; i ++) {
    answer_1 = randomAnswer(answers);
    answer_2 = randomAnswer(answers);
    graph.addNode(answer_1.id, answer_1);
    graph.addNode(answer_2.id, answer_2);
    graph.addLink(answer_1.id, answer_2.id, { answer_1: answer_1, answer_2: answer_2 });
  }
}

// Select a random answer (used in generateRandomLinks).
function randomAnswer(answers) {
  var idx = Math.floor((Math.random() * answers.length))
  return answers[idx]
}

// Delete a link based in its html id (the only way to delete a link its with
// the link object).
function deleteLink(link_id) {
  graph.forEachLink(function(link) {
    if (("#" + buildIdFromLinkObject(link)) == link_id)
      graph.removeLink(link);
  });
}

// Build the link in the format used in graph.
function buildIdFromLinkObject(link) {
  if (link != undefined) // It seems that 'forEachLink' return always, at the end, an undefined object.
    return "link-" + link.data.answer_1.id + "-" + link.data.answer_2.id
}

// Add the link or set the current status selecting_nodes to true.
function addLink() {
  if (selecting_nodes == false)
    selecting_nodes = true
  if (selected_nodes.length == 2)
    graph.addLink(selected_nodes[0].data.id, selected_nodes[1].data.id, { answer_1: selected_nodes[0], answer_2: selected_nodes[1] });
}

// Drawback the node selection options (when adding a link).
function resetNodeSelection() {
  changeSelectedNodesColor();
  selected_nodes = [];
  selecting_nodes = false;
}

// When an ajax request is sended to graph page, that means that the node
// selection state (to add a link) is ended, and the necessary layot adjustments can
// be made.
function informGraphPage() {
  $.ajax({
     type: "GET",
     url: 'graph',
     dataType: 'script'
   });
}

// If selecting_nodes is true, ESC cancel the selection.
$(document).keyup(function(e) {
  if (selecting_nodes)
    if (e.keyCode === 27) {
      informGraphPage();
      resetNodeSelection();
      $('body').css('cursor', 'default');
    }
});
