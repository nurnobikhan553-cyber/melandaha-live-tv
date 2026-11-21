"use client";
import {useEffect,useState} from "react";
import {supabase} from "../../lib/supabase";
import {type Channel} from "../../lib/demo";

export default function Admin(){
  const [rows,setRows]=useState<Channel[]>([]);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [form,setForm]=useState({name:"",category:"News",country:"Bangladesh",stream_url:""});
  const [msg,setMsg]=useState("");
  const [session,setSession]=useState<any>(null);
  const [checking,setChecking]=useState(true);

  async function load(){
    if(!supabase||!session)return;
    const {data,error}=await supabase.from("channels").select("*").order("name");
    if(error)setMsg(error.message);else setRows((data||[]) as Channel[]);
  }

  useEffect(()=>{
    if(!supabase){setMsg("Supabase credentials configure করুন।");setChecking(false);return;}
    supabase.auth.getSession().then(({data})=>{setSession(data.session);setChecking(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>setSession(nextSession));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{if(session)load();else setRows([]);},[session]);

  async function login(){
    if(!supabase)return;
    const {error}=await supabase.auth.signInWithPassword({email,password});
    setMsg(error?error.message:"Login successful");
    if(!error)setPassword("");
  }
  async function logout(){
    if(!supabase)return;
    await supabase.auth.signOut();
    setRows([]);
    setMsg("আপনি লগআউট করেছেন।");
  }
  async function add(e:React.FormEvent){
    e.preventDefault();
    if(!supabase||!session)return;
    const {error}=await supabase.from("channels").insert({...form,is_active:true});
    setMsg(error?error.message:"Channel added");
    if(!error)setForm({name:"",category:"News",country:"Bangladesh",stream_url:""});
    load();
  }
  async function saveStream(id:string,stream_url:string){
    if(!supabase||!session)return;
    const {error}=await supabase.from("channels").update({stream_url}).eq("id",id);
    setMsg(error?error.message:"Stream URL saved");
    if(!error)load();
  }
  async function del(id:string){
    if(!supabase||!session)return;
    const {error}=await supabase.from("channels").delete().eq("id",id);
    setMsg(error?error.message:"Deleted");
    load();
  }

  if(checking)return <main className="admin"><p>Checking admin access...</p></main>;
  if(!session)return <main className="admin">
    <a href="/">← Home</a>
    <h1>Melandaha Live TV</h1>
    <h3>Admin Login</h3>
    <p>এই প্যানেল শুধু অনুমোদিত অ্যাকাউন্ট দিয়ে লগইন করলে দেখা যাবে।</p>
    <form onSubmit={e=>{e.preventDefault();login();}}>
      <input type="email" placeholder="Admin email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>
      <button type="submit">Sign in</button>
    </form>
    {msg&&<p>{msg}</p>}
  </main>;

  return <main className="admin">
    <a href="/">← Home</a>
    <button onClick={logout}>Log out</button>
    <h1>Melandaha Live TV Admin</h1>
    <p>Logged in: {session.user?.email}</p>
    <h3>Add channel</h3>
    <form onSubmit={add}>
      {Object.keys(form).map(k=><input key={k} placeholder={k==="stream_url"?"Official YouTube video URL or HLS (.m3u8) URL":k} required={k!=="stream_url"} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}
      <button type="submit">Add channel</button>
    </form>
    <h3>Channels and stream URLs</h3>
    {rows.map(c=><div key={c.id} style={{marginBottom:16}}>
      <strong>{c.name}</strong>
      <input aria-label={c.name+" stream URL"} placeholder="Official YouTube watch/live URL or HLS .m3u8 URL" value={c.stream_url||""} onChange={e=>setRows(old=>old.map(r=>r.id===c.id?{...r,stream_url:e.target.value}:r))}/>
      <button onClick={()=>saveStream(c.id,c.stream_url||"")}>Save stream URL</button>
      <button onClick={()=>del(c.id)}>Delete</button>
    </div>)}
    {msg&&<p>{msg}</p>}
    <p>শুধু চ্যানেলের নিজস্ব বা লিখিত অনুমতিপ্রাপ্ত স্ট্রিম URL ব্যবহার করুন। YouTube watch/live URL এবং HLS .m3u8 URL সমর্থিত।</p>
  </main>;
}
