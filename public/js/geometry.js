var width = window.innerWidth;
var height = window.innerHeight;
var shadowOffset = 20;
var tween = null;
var blockSnapSize = 30;

var gridLayer = new Konva.Layer();
var padding = blockSnapSize;
console.log(width, padding, width / padding);
for (var i = 0; i < width / padding; i++) {
  gridLayer.add(new Konva.Line({
    points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
    stroke: '#ddd',
    strokeWidth: 1,
  }));
}

gridLayer.add(new Konva.Line({points: [0,0,10,10]}));
for (var j = 0; j < height / padding; j++) {
  gridLayer.add(new Konva.Line({
    points: [0, Math.round(j * padding), width, Math.round(j * padding)],
    stroke: '#ddd',
    strokeWidth: 0.5,
  }));
}
  
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var layer = new Konva.Layer();

stage.add(gridLayer);
stage.add(layer);

function newRoom(x, y) {
    
    var group = new Konva.Group({
        x: x,
        y: y,
        draggable: true
    });

    var rectangle = new Konva.Rect({
        x: x,
        y: y,
        width: blockSnapSize * 6,
        height: blockSnapSize * 3,
        fill: 'gray',
        stroke: '#ddd',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowBlur: 2,
        shadowOffset: {x : 1, y : 1},
        shadowOpacity: 0.4,
        name: 'fillShape'
    });
    group.add(rectangle);

    group.on('dragstart', (e) => {
        group.moveToTop();
    })

    group.on('dragend', (e) => {
        group.position({
            x: Math.round(group.x() / blockSnapSize) * blockSnapSize,
            y: Math.round(group.y() / blockSnapSize) * blockSnapSize
        });
        stage.batchDraw();
    });

  return group;
}

function addRoom() {
    layer.add(newRoom(blockSnapSize * 3, blockSnapSize * 3));
    layer.draw();
  }

  

document.getElementById('button').addEventListener('click', addRoom);
//addRoom();

layer.on('dragmove', function(e) {

    var target = e.target;
    var targetRect = e.target.getClientRect();
    layer.children.each(function(group) {
        // do not check intersection with itself
        if (group === target) {
        return;
        }
        if (haveIntersection(group.getClientRect(), targetRect)) {
        group.findOne('.fillShape').fill('red');
        } else {
        group.findOne('.fillShape').fill('gray');
        }
        // do not need to call layer.draw() here
        // because it will be called by dragmove action
    });
});

function haveIntersection(r1, r2) {
    return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
    );
}
  