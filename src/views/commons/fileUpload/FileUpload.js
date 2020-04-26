import m from "mithril"
import "./style.scss";
import { Icon } from "../Icon/Icon";

export const FileUpload = node => {
    const deleteFile = (docID) => {
        const child = firebase.storage().ref().child(`${node.attrs.path}/${docID}`)
        child.delete().then(() => {
            // console.log("delete succesfully!!!")
            let currInd = 0
            node.state.newFiles.forEach((el, ind) => {
                if (el.docID === docID) {
                    currInd = ind
                    return
                }
            })
            node.state.newFiles.splice(currInd, 1)
        })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                m.redraw()
            })
    }

    const attachFile = (e) => {
        e.redraw = false
        const files = e.target.files
        if (!files[0]) return

        const docID = uuid()
        node.state.newFiles.push({ uploadValue: 0, docID, finish: false })
        const currInd = node.state.newFiles.length - 1;
        const child = firebase.storage().ref().child(`${node.attrs.path}/${docID}`)
        const task = child.put(files[0])

        const next = _snap => {
            const progress = (_snap.bytesTransferred / _snap.totalBytes) * 100;
            node.state.newFiles[currInd].uploadValue = progress
            console.log('Upload is ' + progress + '% done');
        }
        const error = _error => {
            console.error(_error)
        }
        const complete = () => {
            task.snapshot.ref.getDownloadURL()
                .then(url => {
                    node.state.newFiles[currInd].finish = true
                    node.state.newFiles[currInd].src = url
                    m.redraw()
                    return
                })
        }
        task.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            next,
            error,
            complete
        )
    }

    const uploadBlob = e => {
        const reader = new FileReader();
        reader.onload = () => {
            node.state.file = reader.result
            node.state.type = e.target.files[0].type
            node.state.showPopUp = true;
            m.redraw()
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    return {
        file: "",
        type: "",
        showPopUp: false,
        view: vnode => {
            return m("label.file[for=file]",
                vnode.state.showPopUp && [
                    vnode.state.type === "application/pdf" ?
                        m(".showImg", { onclick: e => vnode.state.showPopUp = false }, m("iframe.showImg__box", { onclick: e => {e.preventDefault();e.stopPropagation()}, src: vnode.state.file, alt: "ללא", width: "300", height: "400", allowfullscreen: true }))
                        :
                        m(".showImg", { onclick: e => vnode.state.showPopUp = false }, m("img.showImg__box", { onclick: e => {e.preventDefault();e.stopPropagation()}, src: vnode.state.file, alt: "ללא", width: "300" }))
                ],
                vnode.state.file === "" ? m(Icon, { icon: "icon-pictures" }) : m("img.icon",{src: vnode.state.file}),
                m("input.[type=file][hidden]#file", { onchange: e => uploadBlob(e) })
            )
        }
    }
}