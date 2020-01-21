import Vue from 'vue'
class JSONPath {

    get (data, path) {
        if (data) {
            if (data[path]) {
                return data[path]
            }
            if (path.indexOf('.') >=0  || path.indexOf('[') >=0 ){
                let elements = this.getJsonPath(path)
                let current = elements.shift()
                let value = data[current]
                while (current != null && current != undefined && value !==null && value != undefined && elements.length > 0) {
                    current = elements.shift()
                    value = value[current]
                }
                return value
            }
        }
    }

    set (data, path, value) {
        let elements = this.getJsonPath(path)
        let current = elements.shift()
        let node = data
        let i = 0
        while (current && i < 100) {
            i++
            if (elements.length > 0) {
                if (!node[current]) {
                    if (elements[0].toLowerCase) {
                        this._set(node, current, {});
                    } else {
                        this._set(node, current, []);
                    }
                }
                node = node[current]
                current = elements.shift()
            } else {
                this._set(node, current, value);
            }
        }
        return data
    }

    _set (node, key, value) {
        /**
         * Not sure how this works for new props. Maybe we have to use VUE here
         */
        //node[key] =value
        Vue.set(node, key, value)
    }


    getJsonPath (path) {
        return path.split('.').flatMap(p => {
            if (p.indexOf('[') >=0) {
                let parts = p.split('[')
                if (parts.length == 2) {
                    let key = parts[0]
                    let index = parts[1].substring(0, parts[1].length-1) * 1
                    return [key, index]
                }
                return p.substring(1, p.length -1) * 1
            }
            return p
        })
    }

}

export default new JSONPath()