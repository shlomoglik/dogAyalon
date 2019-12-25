import m from 'mithril';
import { getFormValues } from '../../js/utils';
import { updateDoc } from '../../firebase/getData';
import Snackbar from '../commons/UI/Snackbar';


const UserPage = (init) => {

    const getUserData = () => {
        init.state.user = User.getUser();
    }

    const updateUser = (e, vnode) => {
        console.log('START function updateUser');
        e.preventDefault();
        let form = e.target;
        let uid = form.id;
        let data = getFormValues(form);
        let user = vnode.state.user;
        let newUser = user;
        newUser._data = data;
        sessionStorage.setItem('User', JSON.stringify(newUser));
        const prom = new Promise (resolve=> resolve(updateDoc('users', uid, data)) );
        prom.then(res=>{            
            let msg = m(Snackbar , {oncreate:node=>node.dom.classList.add('snackbar__show')  , text:`פרטי משתמש עודכנו בהצלחה`})
            vnode.state.msgs.push(msg);
        })
        prom.catch(err=>alert(err))
    }

    const getPhoto = () => {
        if (false) { // if has photo
            console.log('bla bla bla')
            return m('img.user__photo', { src: "#", alt: "" })
        } else {
            return m('svg.user__photo.user__photo--add', { onclick: e => console.log('TODO add new photo to user', e, e.target) }, m('use', { href: "/img/sprite.svg#icon-user" }))
        }
    }

    return {
        oninit: vnode=>{
            getUserData();
            vnode.state.msgs = [];
        },
        oncreate: vnode => {
            let dom = vnode.dom;
            // let inputs = dom.querySelectorAll('input');
            // const log =e=>console.log(e,e.target)
            // inputs.forEach(input=>{
            //     input.addEventListener('keyup',log)
            // })
        },
        view: vnode => {
            let user = vnode.state.user;
            return (
                m('.user', [
                    m(Header, { title: "פרופיל משתמש", backTo: false }),
                    m(`form.user__form#${user.id}`,
                        { onsubmit: e => updateUser(e, vnode) },
                        [
                            m('.user__row', [
                                getPhoto()
                            ]),
                            m('.user__row', [
                                m('input[type="text"].user__input user__name', { name: "name", value: user._data.name || '' }),
                                m('label.user__label', 'שם')
                            ]),
                            m('.user__row', [
                                m('input[type="phone"].user__input user__phone', { name: "phone", value: user._data.phone || '' }),
                                m('label.user__label', 'טלפון')
                            ]),
                            m('.user__row', [
                                m('input[type="email"].user__input user__email', { name: "email", value: user._data.email || '' }),
                                m('label.user__label', 'אימייל')
                            ]),
                            m('.user__btns', [
                                m('button[type="submit"].btn.btn--def', 'עדכן'),
                                m('button[type="button"].btn.btn--def.btn--red', { onclick: e => m.redraw() }, 'אפס'),
                            ])
                        ]),
                        vnode.state.msgs.map(msg=>msg)
                ])
            )
        }
    }
}

module.exports = UserPage;
