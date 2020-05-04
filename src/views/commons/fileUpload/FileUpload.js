import m from "mithril"
import "./style.scss";
import { Icon } from "../Icon/Icon";
import { db } from "../../../index";

export const FileUpload = node => {
    const deleteFile = () => {
        const child = firebase.storage().ref().child(`${node.attrs.path}`)
        child.delete()
            .then(() => {
                // console.log("delete succesfully!!!")
                node.state.fileUrl = "";
                node.state.fileType = "";
                node.state.isStorageFile = false
                return db.doc(`${node.attrs.path}`).set({ [node.attrs.inputKey]: "" }, { merge: true })
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                m.redraw()
            })
    }

    const uploadFile = (e) => {
        if (node.state.fileUrl === "" || node.state.fileType === "") return
        const metadata = { contentType: node.state.fileType };
        const childNode = firebase.storage().ref().child(`${node.attrs.path}`)
        const task = childNode.put(node.state.fileBlob, metadata)
        const next = _snap => {
            const progress = (_snap.bytesTransferred / _snap.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }
        const error = _error => {
            console.error(_error)
        }
        const complete = () => {
            task.snapshot.ref.getDownloadURL()
                .then(url => {
                    console.log('new file url ==> ', url)
                    node.state.fileUrl = url
                    node.state.showPopUp = false;
                    return db.doc(`${node.attrs.path}`).set({ [node.attrs.inputKey]: url }, { merge: true })
                }).then(() => {
                    snapPhoto()
                    m.redraw()
                    return
                })
        }
        task.on(firebase.storage.TaskEvent.STATE_CHANGED, next, error, complete)
    }

    const uploadBlob = files => {
        const reader = new FileReader();
        reader.onload = () => {
            node.state.fileUrl = reader.result
            node.state.fileType = files[0].type
            node.state.showPopUp = true;
            node.state.fileBlob = files[0];
            m.redraw()
        };
        reader.readAsDataURL(files[0]);
    }

    const preventAll = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const snapPhoto = () => {
        try {
            const childNode = firebase.storage().ref().child(`${node.attrs.path}`)
            childNode.getDownloadURL()
                .then(url => {
                    node.state.isStorageFile = true
                    node.state.fileUrl = url
                    return childNode.getMetadata()
                }).then(meta => {
                    node.state.fileType = meta.contentType
                }).then(() => {
                    m.redraw()
                })
        } catch (err) {
            console.error(err)
        }
    }

    return {
        id: +new Date(),
        isStorageFile: false,
        fileBlob: null,
        fileUrl: "",
        fileType: "",
        showPopUp: false,
        drag: false,
        hover: false,
        // oninit: vnode => snapPhoto(),
        oninit: vnode => {
            if (vnode.attrs.value !== "") {
                vnode.state.isStorageFile = true;
                vnode.state.fileUrl = vnode.attrs.value;
                // TODO: get file type maby set as input as object that hold url and metadata
            }
        },
        view: vnode => {
            return m(".file",
                vnode.state.showPopUp && m(".showImg", {
                    onclick: e => vnode.state.showPopUp = false
                },
                    m(".showImg__box", { onclick: e => { } }, [
                        vnode.state.fileUrl === "" ?
                            m(`label.showImg__noImage[for=${vnode.state.id}]`, {
                                class: vnode.state.drag ? "droparea" : vnode.state.hover ? "hover" : "",
                                onmouseenter: e => { vnode.state.drag ? "" : vnode.state.hover = true },
                                onmouseleave: e => { vnode.state.hover = false },
                                onclick: e => { e.stopPropagation() },
                                ondragover: e => { vnode.state.drag = true; preventAll(e) },
                                ondragenter: e => { vnode.state.drag = true; preventAll(e) },
                                ondragleave: e => { vnode.state.drag = false; preventAll(e) },
                                ondrop: e => {
                                    vnode.state.drag = false;
                                    preventAll(e);
                                    uploadBlob(e.dataTransfer.files)
                                }
                            },
                                vnode.state.drag ? "השלך כאן" : "העלה קובץ",
                                m(Icon, { icon: "icon-upload" })
                            ) :
                            m(".showImg__img",
                                m(Icon, {
                                    class: "showImg__remove", icon: "icon-trash", action: e => {
                                        if (vnode.state.isStorageFile) deleteFile()
                                        else vnode.state.fileUrl = ""
                                    }
                                }),
                                vnode.state.fileType === "application/pdf" ?
                                    m("iframe", { onclick: e => { e.preventDefault(); e.stopPropagation() }, title: "תצוגה מקדימה", src: vnode.state.fileUrl, width: "300", height: "400", allowfullscreen: true })
                                    :
                                    m("img", { onclick: e => { e.preventDefault(); e.stopPropagation() }, src: vnode.state.fileUrl, alt: "אין תצוגה מקדימה", width: "300" }),
                            ),
                        (vnode.state.fileUrl !== "" && vnode.state.isStorageFile === false) && m("button.showImg__save", { onclick: e => uploadFile(e) }, "שמור", m(Icon, { icon: "icon-upload" })),
                    ])
                ),
                vnode.state.fileUrl === "" ? m(Icon, { class: "file__thumb", icon: "icon-pictures", action: e => vnode.state.showPopUp = true }) : m("img.file__thumb", { src: vnode.state.fileUrl, onclick: e => vnode.state.showPopUp = true }),
                m(`input.[type=file][hidden]#${vnode.state.id}`, { onchange: e => uploadBlob(e.target.files) })
            )
        }
    }
}