import { useNavigate } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiEndPoint } from "./common/config";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';



const Home = () => {
    const state = useSelector((state) => state.manageContacts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useRef(null);

    const deleteContact = (rowdata) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                const config = {
                    headers: { Authorization: `Bearer ${state.accessToken}` }
                };
                axios.delete(apiEndPoint + 'contacts/delete/' + rowdata._id, config).then((response) => {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Contact deleted Successfully', life: 3000 });
                    dispatch({
                        type: "UPDATE",
                        payload: response.data.contactList
                    })
                }).catch(({ response }) => {
                    const message = (response && response.data && response.data.message) || "Something went wrong. Please try again"
                    toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
                })
            },
            reject: () => {
            }
        });




    }

    useEffect(() => {
        if (!state.accessToken) {
            navigate('/')
        }
        const config = {
            headers: { Authorization: `Bearer ${state.accessToken}` }
        };
        axios.get(apiEndPoint + 'contacts/', config).then((response) => {
            dispatch({
                type: "UPDATE",
                payload: response.data.contactList
            })

        }).catch(({ response }) => {
            navigate('/')
        })
    }, [])

    const actionTemplate = (rowdata) => {
        console.log(rowdata)
        return (<><Button className="mr-2" icon="pi pi-trash" onClick={() => deleteContact(rowdata)} />
            <Button icon="pi pi-pencil" onClick={() => { navigate('/edit', { state: rowdata }); }} />
        </>)
    }



    return (
        <>
            <div className="relative p-2">
                <div className="relative" style={{ color: 'var(--blue-500)' }}>
                    <h1>CONTACTS MANAGER MERN APP</h1>
                </div>
                <div className="relative mt-5">
                    <Button onClick={() => navigate("/create")} label="Create">
                    </Button>
                </div>
                <Toast ref={toast} />
                <ConfirmDialog />
                <div class="relative mt-3">
                    <DataTable value={state.contactsData} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="name" header="Name"></Column>
                        <Column field="email" header="Email Id"></Column>
                        <Column field="phone_number" header="Phone Number"></Column>
                        <Column body={actionTemplate} header="Action"></Column>
                    </DataTable>
                </div>
            </div>
        </>
    )

}

export default Home