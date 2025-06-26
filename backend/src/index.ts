import { createClient, SupabaseClient } from "@supabase/supabase-js";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config({
    path: ".env"
})
const app: Express = express()
app.use(express.json())
const SUPABASE_URL: string = process.env.SUPABASE_URL!
const SUPABASE_API: string = process.env.API_SUPABASE!
const PORT = process.env.PORT! || 8081
let connection: SupabaseClient;
try {
    connection = createClient(SUPABASE_URL, SUPABASE_API)
    console.log("Connected")
} catch (error) {
    console.log(error)
}


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))

type FormData = {
    email: string;
    title: string;
    content: string;
};
app.post("/", async (req: Request, res: Response) => {
    const { datas }: { datas: FormData } = req.body
    // console.log(datas)
    const { data: user, error: usererror } = await connection.from("Draft").select("*").eq("email", datas.email)
    if (!user || user.length === 0 || user.includes("@") ) {
        const { data: insertedUser, error: insertError } = await connection
            .from("Draft")
            .insert([{ email: datas.email }])
        const { data: userdata, error: dataerror } = await connection.from("Draft").update([{ title: datas.title, content: datas.content }]).eq("email", datas.email)
        // console.log(user)
    }
    else {
        const { data: userdata, error: dataerror } = await connection.from("Draft").update([{ title: datas.title, content: datas.content }]).eq("email", datas.email)
        // console.log(user)
    }
    

})

app.post("/check", async (req: Request, res: Response) => {
    const { email } = req.body
    // console.log(email)
    let { data, error } = await connection.from("Draft").select("*").eq("email", email)
    // console.log(data)
    if (data?.length!>0) {
        res.send(data)
    }
    else {
        res.send("Nothing")
    }
})

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})

export default app