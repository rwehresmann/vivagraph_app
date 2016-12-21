var renderer;
var graph;

function main (answers) {
  console.log("oi")
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
