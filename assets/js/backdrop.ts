let body = document.body;

body.onload = fill_backdrop;

function fixCanvasDPI(canvas: HTMLCanvasElement, w: number, h: number) {
    var context = canvas.getContext("2d"),
        dpr: number = window.devicePixelRatio || 1,
        bsr: number = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

    var ratio = dpr / bsr;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let symbols = "∀∁∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿"

function fill_backdrop() {
    let canvas = <HTMLCanvasElement>document.getElementById('backdrop');
    fixCanvasDPI(canvas, body.clientWidth, body.clientHeight + 16 * 7);
    let context = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    context.font = '16px serif'
    context.fillStyle = '#00000030';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    let radius = 32;
    let dx = radius;
    let dy = radius * Math.sqrt(3) / 2.0;
    let shift = false;
    let count = symbols.length;
    for (var y = radius / 2; y < height + dy; y += dy) {
        for (var x = shift ? radius / 2 : 0; x < width; x += dx) {
            if(Math.random() < 0.5)
                continue;
            context.fillText(symbols[getRandomInt(0, count)], x, y);
        }
        shift = !shift;
    }
}
