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

function svgElem(name: string, properties: any = null, innerHTML: string = null) {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', name);
    if (properties != null) {
        for (var prop in Object.keys(properties)) {
            elem.setAttribute(prop, `${properties[prop]}`);
        }
    }
    if (innerHTML != null) {
        elem.innerHTML = innerHTML;
    }
    return elem;
}
function getTextElem(text: string, x: number, y: number) {
    const elem = svgElem('text');
    elem.innerHTML = text;
    elem.setAttribute('x', `${x}`);
    elem.setAttribute('y', `${y}`);
    return elem;
}
function getSVGBackgroundStyle(fontSize : number) {
    const style = svgElem('style');
    style.innerHTML = `
    text {
        font: bold ${fontSize}px serif;
        fill: gold;
        text-align: center;
        text-baseline: middle;
    }
    `;
    return style;
}
function getSVGBlurElement() {
    const filter = svgElem('filter');
    filter.setAttribute('id', 'blur');

    const blur = svgElem('feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', '5');
    filter.appendChild(blur);
    return filter;
}
function getSVGContents(id, fontSize, radius, width, height) {
    const dx = radius;
    const dy = radius * Math.sqrt(3) / 2.0;
    const count = symbols.length;

    const content = svgElem('symbol');
    content.setAttribute('id', id);
    content.setAttribute('width', `${width}`)
    content.setAttribute('height', `${height}`)
    content.setAttribute('viewBox', `0 0 ${width} ${height}`)

    var shift = false;
    for (var y = (radius + fontSize) / 2; y < height + dy; y += dy) {
        for (var x = fontSize / 2 + (shift ? radius / 2 : 0); x < width; x += dx) {
            if(Math.random() < 0.5)
                continue;
            const symbol = symbols[getRandomInt(0, count)];
            content.appendChild(getTextElem(symbol, x, y));
        }``
        shift = !shift;
    }
    return content;
}
function getSVGBackground() {
    const radius = 32;
    const fontSize = 16;
    const background = svgElem('svg');
    const dx = radius;
    const dy = radius * Math.sqrt(3) / 2.0;
    const width = dx * 20;
    const height = dy * 20;


    background.setAttribute('width', `${width}`)
    background.setAttribute('height', `${height}`)
    background.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    background.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

    background.appendChild(getSVGContents('math', fontSize, radius, width, height));

    background.appendChild(getSVGBackgroundStyle(fontSize));
    background.appendChild(getSVGBlurElement());

    const backContent = svgElem('use');
    backContent.setAttribute('xlink:href', '#math');
    backContent.setAttribute('x', '0');
    backContent.setAttribute('y', '0');
    backContent.setAttribute('filter', 'url(#blur)');
    background.appendChild(backContent);

    const mainContent = svgElem('use');
    mainContent.setAttribute('xlink:href', '#math');
    mainContent.setAttribute('x', '0');
    mainContent.setAttribute('y', '0');
    background.appendChild(mainContent);

    return background;
}

function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}

function fill_backdrop() {

    const backdrop = document.getElementById('backdrop');
    const svgBackgrond = getSVGBackground();
    var mySVG64 = utf8_to_b64(svgBackgrond.outerHTML);
    document.getElementById('backdrop').style.backgroundImage = `url('data:image/svg+xml;base64,${mySVG64}')`;
}
