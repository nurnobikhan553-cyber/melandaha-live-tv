"use client";
import {useEffect,useMemo,useState} from "react";
import VideoPlayer from "../components/VideoPlayer";
import {demoChannels,type Channel} from "../lib/demo";
import {supabase} from "../lib/supabase";

type MusicVideo={id:string;title:string;channel:string;thumbnail:string};

export default function Home(){
  const [channels,setChannels]=useState<Channel[]>(demoChannels);
  const [selected,setSelected]=useState<Channel|null>(demoChannels[0]);
  const [category,setCategory]=useState("All Categories");
  const [query,setQuery]=useState("");
  const [server,setServer]=useState<1|2>(1);
  const starterVideos:MusicVideo[]=[
    {id:"-qOpyOQ8sMc",title:"বাংলা গানের জুকবক্স",channel:"Music",thumbnail:""},
    {id:"sqKdI2lKYx8",title:"হিন্দি গানের জুকবক্স",channel:"Music",thumbnail:""},
    {id:"owaaUcVvMT4",title:"ভোজপুরি গানের জুকবক্স",channel:"Music",thumbnail:""}
  ];
  const [musicVideos,setMusicVideos]=useState<MusicVideo[]>(starterVideos);
  const [musicVideo,setMusicVideo]=useState<MusicVideo>(starterVideos[0]);
  const [musicQuery,setMusicQuery]=useState("");
  const [musicError,setMusicError]=useState("");
  const [musicLoading,setMusicLoading]=useState(false);
  const musicIndex=musicVideos.findIndex(v=>v.id===musicVideo.id);

  const musicCategories=[
    {label:"বাংলা গান",query:"Bangla popular songs"},
    {label:"হিন্দি গান",query:"Hindi hit songs"},
    {label:"ভোজপুরি গান",query:"Bhojpuri hit songs"},
    {label:"ইংরেজি গান",query:"English hit songs"},
    {label:"ইসলামিক গান",query:"Bangla Islamic nasheed"},
    {label:"পুরোনো গান",query:"Evergreen old songs"}
  ];
  async function runMusicSearch(term:string){
    if(!term.trim())return;
    setMusicLoading(true);setMusicError("");
    try{
      const res=await fetch("/api/music-search?q="+encodeURIComponent(term.trim()));
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"গান খুঁজে পাওয়া যায়নি");
      if(!data.items?.length)throw new Error("কোনো গান পাওয়া যায়নি");
      setMusicVideos(data.items);setMusicVideo(data.items[0]);
    }catch(err:any){setMusicError(err.message||"সার্চ করা যায়নি");}
    finally{setMusicLoading(false);}
  }
  async function searchMusic(e:any){
    e.preventDefault();
    await runMusicSearch(musicQuery);
  }
  function changeMusic(step:number){
    const next=musicIndex+step;
    if(next>=0&&next<musicVideos.length)setMusicVideo(musicVideos[next]);
  }

  useEffect(()=>{
    if(supabase)supabase.from("channels").select("*").eq("is_active",true).order("name").then(({data})=>{
      if(data?.length){setChannels(data as Channel[]);setSelected(data[0] as Channel);}
    });
  },[]);
  const cats=["All Categories",...Array.from(new Set(channels.map(c=>c.category)))];
  const shown=useMemo(()=>channels.filter(c=>(category==="All Categories"||c.category===category)&&c.name.toLowerCase().includes(query.toLowerCase())),[channels,category,query]);

  return <main className="portal">
    <header className="socialbar"><a href="/">⌂</a><a href="#">◉</a><a href="#">➤</a><a href="#">▶</a><a href="#">f</a></header>
    <section className="layout">
      <div className="watch">
        <div className="player">
          {server===1?<VideoPlayer src={selected?.stream_url||""}/>:<iframe className="server2-frame" key={musicVideo.id} src={`https://www.youtube-nocookie.com/embed/${musicVideo.id}?autoplay=1&rel=0`} title={musicVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>}
        </div>
        <div className="now"><i/><span><small>{server===1?"CURRENTLY SELECTED":"NOW PLAYING"}</small><b>{server===1?(selected?.name||"Select a channel"):musicVideo.title}</b></span><strong>{server===1?"● LIVE":"♫ MUSIC"}</strong></div>
      </div>
      <aside>
        <div className="server-switch"><button type="button" className={server===1?"selected":""} onClick={()=>setServer(1)}>⚡ Server 1 · Live TV</button><button type="button" className={server===2?"selected":""} onClick={()=>setServer(2)}>⚡ Server 2 · Music Zone</button></div>
        {server===1?<><input className="search" placeholder="Search live channel..." value={query} onChange={e=>setQuery(e.target.value)}/><select className="category" value={category} onChange={e=>setCategory(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select><div className="channels">{shown.map(c=><button className={selected?.id===c.id?"channel active":"channel"} key={c.id} onClick={()=>setSelected(c)}><b>{c.name.slice(0,2).toUpperCase()}</b><span><strong>{c.name}</strong><small>{c.category} · {c.country}</small></span><i>●</i></button>)}</div><a className="adminlink" href="/admin">Admin Panel</a></>:<>
          <h3 className="music-list-title">গানের ক্যাটাগরি</h3>
          <div className="music-category-buttons">{musicCategories.map(item=><button type="button" key={item.label} disabled={musicLoading} onClick={()=>{setMusicQuery(item.query);void runMusicSearch(item.query);}}>{item.label}</button>)}</div>
          <form className="music-search" onSubmit={searchMusic}><input value={musicQuery} onChange={e=>setMusicQuery(e.target.value)} placeholder="গানের নাম লিখে সার্চ করুন..."/><button type="submit" disabled={musicLoading}>{musicLoading?"খুঁজছে...":"সার্চ"}</button></form>
          {musicError&&<p className="music-error">{musicError}</p>}
          <div className="music-side-controls"><button type="button" onClick={()=>changeMusic(-1)} disabled={musicIndex<=0}>আগের গান</button><button type="button" onClick={()=>changeMusic(1)} disabled={musicIndex<0||musicIndex>=musicVideos.length-1}>পরের গান</button></div>
          <h3 className="music-list-title">গানের তালিকা</h3>
          <div className="music-grid">{musicVideos.map(item=><button type="button" key={item.id} className={musicVideo.id===item.id?"music-choice active":"music-choice"} onClick={()=>setMusicVideo(item)}><img src={item.thumbnail||`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`} alt=""/><span><strong>{item.title}</strong><small>{item.channel||"YouTube"}</small></span></button>)}</div>
        </>}
      </aside>
    </section>
    <footer>Melandaha Live TV · Authorized streams only</footer>
  </main>;
}
