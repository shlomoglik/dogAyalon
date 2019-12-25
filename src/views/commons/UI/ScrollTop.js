import m from 'mithril'

let ScrollTop = (init) => {
    return {
        oninit: (vnode) => {
            window.addEventListener('scroll',e=>{
                if(window.scrollY>=100){
                    vnode.dom.style.display = 'block';
                }else if(window.scrollY==0){
                    vnode.dom.style.display = 'none';
                }
            })
        },
        view: (vnode) => {
            return (
                m('.scrollTop',
                    {onclick:(e)=>{
                        window.scrollTo(0, 0);
                    }},
                    m('svg.scrollTop__icon',
                        m('use', { href: '/img/sprite.svg#icon-chevron-thin-up' })
                    )
                )
            )
        }
    }
}

module.exports = ScrollTop;