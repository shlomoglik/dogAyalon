export function hideAnimation(vnode, animationName){
    vnode.dom.classList.remove("fade-in")
    vnode.dom.classList.add("fade-out")
    return new Promise(resolve => vnode.dom.addEventListener("animationend", resolve))
}