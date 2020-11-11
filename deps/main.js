var s;
function genCFG(text){
    lines = String(text).split("\n");
    leaders = [];
    for (let i = 0; i < lines.length; i++){
        leaders.push(false);
    }
    leaders[0] = true;
    for (let i = 0; i < lines.length; i++){
        if (lines[i].startsWith("if") || lines[i].startsWith("goto")){
            let tokens = lines[i].split(" ");
            let target = Number(tokens[tokens.length - 1]);
            if (target < lines.length){
                leaders[target] = true;
            }
            if (i < lines.length - 1){
                leaders[i + 1] = true;
            }
        }
    }

    blocks = [];
    blocknums = [];
    let k = -1;
    for (let i = 0; i < lines.length; i++){
        if (leaders[i] == true){
            blocks.push("");
            k++;
        }
        blocks[k] = blocks[k] + lines[i] + "\n";
        blocknums.push(k);
    }

    console.log(blocks, blocknums);

    let nodes = [];
    let ypos = 10;
    for (let i = 0; i < blocks.length; i++){
        nodes.push({
            id: 'n' + i,
            label: String(i) + ":\n\n" + blocks[i],
            x: Math.random(),
            y: ypos,
            size: 100,
            color: '#666'
        });
        ypos += 10;
    }

    let edges = [];
    for (let i = 0; i < blocks.length; i++){
        let blines = blocks[i].trim().split("\n");
        if (blines[blines.length - 1].startsWith("goto")){
            let q = blines[blines.length - 1].split(" ");
            let target = Number(q[q.length - 1]);
            edges.push([i, blocknums[target]]);
        }else if (blines[blines.length - 1].startsWith("if")){
            let q = blines[blines.length - 1].split(" ");
            let target = Number(q[q.length - 1]);
            edges.push([i, blocknums[target]]);
            console.log(i, target);

            if (i < blocks.length - 1){
                edges.push([i, i + 1]);
            }
        }else{
            if (i < blocks.length - 1){
                edges.push([i, i + 1]);
            }
        }

    }

    console.log(edges);

    let edgeNum = 0;
    s = new sigma({
        graph: {
            nodes: nodes,
            edges: edges.map((elt) => {
                edgeNum++;
                return {
                    id: 'e' + String(edgeNum),
                    source: 'n' + String(elt[0]),
                    target: 'n' + String(elt[1]),
                    size: 1000000000,
                    color: '#ccc',
                    type: 'arrow'
                }
            })
        },
        renderer: {
            container: document.getElementById('container'),
            type: 'canvas'
        },
        settings: {
            edgeLabelSize: 'proportional'
        }
    });

    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

    dragListener.bind('startdrag', function(event) {
    console.log(event);
    });
    dragListener.bind('drag', function(event) {
    console.log(event);
    });
    dragListener.bind('drop', function(event) {
    console.log(event);
    });
    dragListener.bind('dragend', function(event) {
    console.log(event);
    });
}

document.getElementById("btn").onclick = () => {
    let text = document.getElementById("prog").value;
    console.log(text);
    genCFG(text);
}