const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let symbols = "∀∁∂∃∄∅∆∇∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣∤∥∦∧∨∩∪∫∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋪⋫⋬⋭⋮⋯⋰⋱⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿"

function svgElem(name: string) {
    const document = dom.window.document;
    const elem = document.createElementNS('http://www.w3.org/2000/svg', name);
    return elem;
}
function getTextElem(text: string, x: number, y: number) {
    const elem = svgElem('text');
    elem.innerHTML = text;
    elem.setAttribute('x', `${x.toFixed(2)}`);
    elem.setAttribute('y', `${y.toFixed(2)}`);
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
    blur.setAttribute('stdDeviation', '3');
    filter.appendChild(blur);
    return filter;
}
function getSVGContents(id: string, fontSize: number, radius: number, width: number, height: number) {
    const dx = radius;
    const dy = radius * Math.sqrt(3) / 2.0;
    const count = symbols.length;

    const content = svgElem('symbol');
    content.setAttribute('id', id);
    content.setAttribute('width', `${width.toFixed(2)}`)
    content.setAttribute('height', `${height.toFixed(2)}`)
    content.setAttribute('viewBox', `0 0 ${width.toFixed(2)} ${height.toFixed(2)}`)

    var shift = false;
    const y0 = (radius + fontSize) / 2;
    const x0 = fontSize / 2;
    const x1 = x0 + radius / 2;
    for (var y = y0; y < height; y += dy) {
        for (var x = shift ? x0 : x1; x < width; x += dx) {
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
    const radius = 30;
    const fontSize = 14;
    const background = svgElem('svg');
    const dx = radius;
    const dy = radius * Math.sqrt(3) / 2.0;
    const width = dx * 30;
    const height = dy * Math.ceil(30 * 2 / Math.sqrt(3));


    background.setAttribute('width', `${width.toFixed(2)}`)
    background.setAttribute('height', `${height.toFixed(2)}`)
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

// function utf8_to_b64( str ) {
//     return window.btoa(unescape(encodeURIComponent( str )));
// }

console.log(getSVGBackground().outerHTML);
