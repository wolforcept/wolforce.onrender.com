/** requires JQuery */
class MyAnim {

    /** 
      * default options:
      * speed: 1000 / 60
     */
    static moveStraight(id, tarX, tarY, length, options = {}) {
        return new Promise(resolve => {
            const _options = {
                speed: 1000 / 60,
                ...options
            }

            const obj = $(id)
            if (!obj.length)
                return

            const pos = { x: 0, y: 0 }
            let initialCss = obj.css('transform')
            if (initialCss == 'none')
                initialCss = ''
            let interv;
            let time = 0

            let func = () => {

                pos.x += tarX / length
                pos.y += tarY / length

                obj.css({ 'transform': `${initialCss} translate(${pos.x}px, ${pos.y}px)` });
                time++
                if (time >= length) {
                    clearInterval(interv)
                    resolve()
                }
            }
            interv = setInterval(func, _options.speed)
        })
    }

    /** 
     * function must return {x, y}
     * default options:
     * speed: 1000 / 60
     */
    static moveFunction(id, moveFunc, length, options = {}) {
        return new Promise(resolve => {
            const _options = {
                speed: 1000 / 60,
                ...options
            }

            const obj = $(id)
            if (!obj.length)
                return

            let initialCss = obj.css('transform')
            if (initialCss == 'none')
                initialCss = ''
            let interv;
            let time = 0

            let func = () => {

                const pos = moveFunc(time / length)
                obj.css({ 'transform': `${initialCss} translate(${pos.x}px, ${pos.y}px)` });
                time++
                if (time >= length) {
                    clearInterval(interv)
                    resolve()
                }
            }
            interv = setInterval(func, _options.speed)
        })
    }

    /** 
      * default options:
      * speed: 1000 / 60
     */
    static alpha(id, from, to, length, options = {}) {
        return new Promise(resolve => {
            const _options = {
                speed: 1000 / 60,
                ...options
            }

            const obj = $(id)
            if (!obj.length)
                return

            let interv;
            let time = 0
            let op = from

            let func = () => {

                op += to / length
                obj.css({ 'opacity': op });

                time++
                if (time >= length) {
                    clearInterval(interv)
                    resolve()
                }
            }
            interv = setInterval(func, _options.speed)
        })
    }
}
