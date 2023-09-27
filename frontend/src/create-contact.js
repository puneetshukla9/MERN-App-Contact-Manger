import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useRef, useState } from "react"

import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios';
import { apiEndPoint } from "./common/config"
import { Messages } from "primereact/messages"
const CreateContact = () => {
    const rowdata = useLocation();
    const [contact, setContact] = useState(rowdata.state ? rowdata.state : {});
    const msgs = useRef(null);
    const dispatch = useDispatch();
    const state = useSelector((state) => state.manageContacts);
    const navigate = useNavigate();
    if (!state.accessToken) {
        navigate('/');
    }

    const createContact = () => {
        let type = rowdata.state ? "UPDATE" : "CREATE";
        const config = {
            headers: { Authorization: `Bearer ${state.accessToken}` }
        };
        axios.post(apiEndPoint + 'contacts/create', contact, config).then(function (response) {
            dispatch({
                type: "UPDATE",
                payload: response.data.contactList

            });
            navigate("/home")
        }).catch(function ({response}) {
            const message = (response && response.data && response.data.message) || "Something went wrong. Please try again"
            msgs.current.clear()
            msgs.current.show([
                { sticky: true, severity: 'error', summary: 'Error', detail: message, closable: true }
            ]);
        });



    }
    const updateContact = () => {
        axios.put(apiEndPoint + 'contacts/update/' + contact._id, contact).then(function (response) {
            console.log(response);
            dispatch({
                type: "UPDATE",
                payload: response.data.contactList

            });
            navigate("/")
        }).catch(function (error) {
            console.log(error);
        });

    }

    return <>
        <div className="p-5">
            <h2 className="doc-section-label">{rowdata.state ? "Edit Contact" : "Create Contact"}</h2>
            <Messages className='mb-5' ref={msgs} />
            <div className="flex flex-column gap-2 mb-4">
                <label htmlFor="username">Name</label>
                <InputText id="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            </div>
            <div className="flex flex-column gap-2 mb-4">
                <label htmlFor="email">Email</label>
                <InputText id="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div className="flex flex-column gap-2 mb-4">
                <label htmlFor="phone_number">Phone Number</label>
                <InputText id="phone_number" value={contact.phone_number} onChange={(e) => setContact({ ...contact, phone_number: e.target.value })} />
            </div>
            {!rowdata.state ? <Button onClick={createContact} label="Create">
            </Button> : <Button onClick={updateContact} label="Update">
            </Button>}
            <Button type="submit"  severity='secondary' label="Cancel" onClick={() => navigate('/home')} className="mt-2 ml-2" />
        </div>
    </>

}

export default CreateContact