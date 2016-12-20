var renderer;

function main (answers) {
  var graphics = Viva.Graph.View.svgGraphics();
  graphics.node(NodeLayout)
    .placeNode(placeNodeWithTransform);

  var graph = Viva.Graph.graph();
  randomConnections(graph, answers);

  renderer = Viva.Graph.View.renderer(graph, {
    graphics: graphics,
    container: document.getElementById('graph-container')
  });

  renderer.run();
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

// Node layout design.
function NodeLayout(node) {
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
    .attr('fill', setNodeCollor(node))
    .attr('r', radius)
    .attr('id', 'node_' + node.data.id)
  $(circle).dblclick(function(){
    $.ajax({
       type: "GET",
       url: '/graph/1',
       dataType: 'script',
       data: { answer: node.data }
     });
  });

  text_ui.append(span_ui);
  ui.append(text_ui);
  ui.append(circle);

  return ui;
}

// Logic to set node color, according answer status.
function setNodeCollor(node) {
  if (node.data.correct)
    return "green"
  return "red"
}

// Needed to join the nodes with the links.
function placeNodeWithTransform(nodeUI, pos) {
  // Shift image to let links go to the center:
  nodeUI.attr('transform', 'translate(' + (pos.x - 12) + ',' + (pos.y - 12) + ')');
}

// Create random connections.
function randomConnections(graph, answers, qt_connections = 50) {
  for (i = 0; i < qt_connections; i ++) {
    answer_1 = randomAnswer(answers);
    answer_2 = randomAnswer(answers);
    graph.addNode(answer_1.id, answer_1);
    graph.addNode(answer_2.id, answer_2);
    graph.addLink(answer_1.id, answer_2.id);
  }
}

// Select a random answer (used in randomConnections).
function randomAnswer(answers) {
  var idx = Math.floor((Math.random() * answers.length))
  return answers[idx]
}
