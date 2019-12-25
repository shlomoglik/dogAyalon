//FORM sumbiting handler
function getFormValues(form) {
    let data = {};
    let elements = form.elements;
    for (let i in elements) {
        let el = elements[i]
        if (el.name && el.value) {
            data[el.name] = el.value || ""
        }
    }
    if (data == {}) return null;
    return data;
}


//DOM travarse
function closestByClass(el, cls) {
    while (!el.classList.contains(cls)) {
        el = el.parentNode;
        if (!el) {
            return null;
        }
    }
    return el;
}

//Layout helpers
function toggleGroup(e, vnode) {
    if (vnode.state.shrink) {
        vnode.state.shrink = false;
    } else {
        vnode.state.shrink = true;
    }
}

function mapToObj(mapObj){
    let obj ={};
    mapObj.forEach(el=> obj[el.id] = el);
    return obj;
}


//Dates 
function dateDiffDays(d1 , d2){
    if(!d2) d2 = new Date();
    let dist = parseInt((d2-d1)/(24*3600*1000));
    if(dist === 0){
        return 'היום'
    }else if(dist > 0){
        return `עברו ${dist} ימים`
    }else {
        return `נותר עוד ${dist} ימים`
    }
}

function formatTime(date) {
    let h = date.getHours();
    if (h < 10) h = "0" + h;
    let m = date.getMinutes();
    if (m < 10) m = "0" + m;
    return h + ":" + m;
}


module.exports =
    {
        getFormValues,
        closestByClass,
        toggleGroup,
        mapToObj,
        dateDiffDays,
        formatTime,
    }