import React, { useState, useCallback, type ChangeEvent, type ChangeEventHandler, useEffect } from 'react'
import debounce from "lodash.debounce"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Form() {
    const BASE_URL: string = "http://localhost:8080"
    type FormData = {
        email: string;
        title: string;
        content: string;
    };
    const [form, setForm] = useState<FormData>({
        email: "",
        title: "",
        content: ""
    })

    useEffect(() => {
        axios.post(`${BASE_URL}/check`, { email: form.email })
            .then(res => {
                if (res.data) {
                    // console.log(res.data[0])
                    setForm((prev) => ({
                        ...prev, content: res.data[0].content,
                        title: res.data[0].title
                    }))
                }
            })
    }, [form.email])

    const showToast = () => {
        toast.success("Draft saved", { autoClose: 1500, style: { width: "150px", height: "10px" } });
    };
    const autosave = useCallback(

        debounce(async (data: FormData) => {
            if (data.email.trim() !== "" ) {
                axios.post(`${BASE_URL}/`, { datas: data })
                showToast()
            }
        }, 2000), []

    )
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const updated: FormData = { ...form, [name]: value }
        setForm(updated)
        autosave(updated)

    }
    // console.log(form)

    return (
        <div style={{
            display: "flex", flexDirection: "column", maxWidth: "2000px", alignItems: "center", justifyContent: "center", gap: "10px"
        }}>
            <p style={{ font: "icon", fontSize: "30px" }}>Draft saving Form</p>
            {/* <input type="text" style={{ height: "30px" }} name='title' value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}))} />
          <input type="text" style={{ height: "30px" }} name='content' value={form.content} onChange={(e) => setForm((prev) => ({
              ...prev , [e.target.name]: e.target.value
          }))} /> */}
            <ToastContainer />
            <input type="text" style={{ height: "30px", width: "400px", borderRadius: "5px", fontSize:"15px" }} name='email' value={form.email} onChange={handleChange} />
            <input type="text" style={{ height: "30px", width: "400px", borderRadius: "5px", fontSize: "15px" }} name='title' value={form.title} onChange={handleChange} />
            <input type="text" style={{ height: "30px", width: "400px", borderRadius: "5px", fontSize: "15px" }} name='content' value={form.content} onChange={handleChange} />
            {/* <button style={{
                maxWidth: "100px", padding: "10px 50px", textAlign: "center", display: "flex", alignContent: "center", justifyContent: "center"
            }}>Submit</button> */}
        </div>
    )
}

export default Form
