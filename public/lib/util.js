/** pad an int string with left zeroes to match n digits in total */
const pad = (n, s) => ("000000000" + n).substr(("000000000" + n).length - s)

/** capitalize first letter of string */
const cap = (s) => s[0].toUpperCase() + s.substr(1)

/** find first on array that ensures comparison */
const firstThat = (arr, comp, i = 0) => { do { v = arr[i++] } while (!comp(v)) return v }

/** divide an array into subarrays */
let groupBy = (arr, n) => {
    let result = [];
    for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n));
    return result;
};

/** string includes all of the strings */
function includesAll(str, ...needles) {
    return [].concat(...needles).every(needle => {
        return str.includes(needle)
    })
}

/** string includes all of the strings */
function includesAny(str, ...needles) {
    return [].concat(...needles).some(needle => {
        return str.includes(needle)
    })
}

/** instanciate react component */
async function renderComponentAt(componentClass, props, parentElementId) {
    let componentId = props.id;
    if (!componentId) {
        throw Error('Component has no id property. Please include id:"...xyz..." to component properties.');
    }

    let parentElement = document.getElementById(parentElementId);

    return await new Promise((resolve, reject) => {
        props.ref = (component) => {
            if (component) {
                resolve(component);
            }
        };
        let element = React.createElement(componentClass, props, null);
        ReactDOM.render(element, parentElement);
    });
}

/**
 * Load an image from a given URL
 * @param {String} url The URL of the image resource
 * @returns {Promise<Image>} The loaded image
 */
function loadImage(url) {
    /*
     * We are going to return a Promise which, when we .then
     * will give us an Image that should be fully loaded
     */
    return new Promise(resolve => {
        /*
         * Create the image that we are going to use to
         * to hold the resource
         */
        const image = new Image();
        /*
         * The Image API deals in even listeners and callbacks
         * we attach a listener for the "load" event which fires
         * when the Image has finished the network request and
         * populated the Image with data
         */
        image.addEventListener('load', () => {
            /*
             * You have to manually tell the Promise that you are
             * done dealing with asynchronous stuff and you are ready
             * for it to give anything that attached a callback
             * through .then a realized value.  We do that by calling
             * resolve and passing it the realized value
             */
            resolve(image);
        });
        /*
         * Setting the Image.src is what starts the networking process
         * to populate an image.  After you set it, the browser fires
         * a request to get the resource.  We attached a load listener
         * which will be called once the request finishes and we have
         * image data
         */
        image.src = url;
    });
}

/** get [mx, my] relative to an object on a mouse event. REQUIRES JQUERY */
function getMousePos(e) {

    let targ
    if (!e)
        e = window.event
    if (e.target)
        targ = e.target
    else if (e.srcElement)
        targ = e.srcElement
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode

    let mx = e.pageX - $(targ).offset().left
    let my = e.pageY - $(targ).offset().top

    return [mx, my]
}

function randomWeighted(array, probs, maxVal) {
    let sum = 0
    const r = Math.random() * (maxVal || 1)
    for (let i = 0; i < array.length; i++) {
        sum += probs[i] || 0
        if (r <= sum)
            return array[i]
    }
}

/** get total sum of array. getVal is optional */
function arrayTotal(arr, getVal) {
    let total = 0
    arr.forEach(
        e => total += (getVal ? getVal(e) : e)
    )
    return total
}
const arraySum = arrayTotal

/** get array object where val is max. getVal(arrObj) is optional */
function arrayMax(arr, getVal) {
    let finalVal = null
    arr.forEach(e => {
        const val = (getVal ? getVal(e) : e)
        const valMax = finalVal ? ((getVal ? getVal(finalVal) : finalVal)) : 0
        if (val > valMax)
            finalVal = e
    })
    return finalVal
}

/** get array object where val is max. getVal(arrObj) is optional */
function arrayMin(arr, getVal) {
    let finalVal = null
    arr.forEach(e => {
        const val = (getVal ? getVal(e) : e)
        const valMin = finalVal ? ((getVal ? getVal(finalVal) : finalVal)) : 9999999999999
        if (val < valMin)
            finalVal = e
    })
    return finalVal
}

/** React hook to store the previous value of something */
function usePrevious(React, value) {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
