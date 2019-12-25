import m from 'mithril';

const Snackbar = (init) => {
    return {
        oncreate: vnode => {
            setTimeout(() => { vnode.dom.classList.remove("snackbar__show") }, 3000);
        },
        view: vnode => {
            return (
                m('.snackbar', [
                    m('span.snackbar__text', vnode.attrs.text)
                ])
            )
        }
    }
}

module.exports = Snackbar;