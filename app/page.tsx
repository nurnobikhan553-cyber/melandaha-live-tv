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
  const [server,setServer]=useState<1|2|3>(1);
  const sportsChannels=[
    {id:"football-live",name:"Football Live",country:"Official rights platform · Bangladesh",stream_url:"https://toffeelive.com/",note:"Toffee official sports streaming"},
    {id:"cricket-live",name:"Cricket Live",country:"Official broadcaster · Bangladesh",stream_url:"https://www.tsports.com/videos",note:"T Sports official videos and live coverage"},
    {id:"bd-cricket-live",name:"BD Cricket Live",country:"Bangladesh cricket",stream_url:"https://toffeelive.com/",note:"Toffee official platform; match rights vary"}
  ];
  const [selectedSport,setSelectedSport]=useState(sportsChannels[0]);

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
  const channelLogos:Record<string,string>={
    "Somoy TV":"https://assets-prod.services.toffeelive.com/w_480%2Cq_75%2Cf_webp/Xi_Ga5oBNnOkwJLWkhKP/posters/ef2899d5-1ae0-4fee-aee5-45f9b0b3ba80.png",
    "Jamuna TV":"https://commons.wikimedia.org/wiki/Special:FilePath/Jamuna_TV_logo.svg",
    "Ekattor TV":"https://cdn.brandfetch.io/idQsBNyhmW/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1766305016347",
    "Channel One":"https://www.rupalibangladesh.com/media/imgAll/2024August/BeFunky-collage---2025-01-23T192421492-20250123132708.jpg",
    "Independent TV":"https://commons.wikimedia.org/wiki/Special:FilePath/Independent_Television_Logo.svg",
    "Channel 24":"https://commons.wikimedia.org/wiki/Special:FilePath/Channel24logo.svg",
    "BTV":"https://www.lyngsat.com/logo/tv/bb/btv-national-bd.png",
    "RTV":"https://www.lyngsat.com/logo/tv/rr/rtv-news-bd.svg"
  };;
  const cats=["All Categories",...Array.from(new Set(channels.map(c=>c.category)))];
  const shown=useMemo(()=>channels.filter(c=>(category==="All Categories"||c.category===category)&&c.name.toLowerCase().includes(query.toLowerCase())),[channels,category,query]);

  return <main className="portal">
    <header className="site-header"><a className="brand" href="/" aria-label="Melandaha Live TV home"><span className="brand-mark"><img src="/melandaha-logo.png" alt="Melandaha Live TV logo"/></span><span className="brand-copy"><strong>Melandaha <em>Live TV</em></strong><small>Stay Connected · Stay Informed</small></span></a><nav className="main-nav"><a className="nav-active" href="/">Home</a><a href="#channels">Channels</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div className="header-actions"><span className="live-pill"><i/> LIVE</span><a className="header-admin" href="/admin">Admin</a></div></header>
    <section className="welcome-strip"><span>বাংলাদেশের খবর ও বিনোদন, এক জায়গায়</span><small>LIVE TV <b>•</b> MUSIC ZONE</small></section>
    <section className="layout">
      <div className="watch">
        <div className="player">
          {server===1?<VideoPlayer src={selected?.stream_url||""}/>:server===2?<iframe className="server2-frame" key={musicVideo.id} src={`https://www.youtube-nocookie.com/embed/${musicVideo.id}?autoplay=1&rel=0`} title={musicVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>:<VideoPlayer key={selectedSport.id} src={selectedSport.stream_url}/>}
        </div>
        <div className="now"><i/><span><small>{server===1?"CURRENTLY SELECTED":server===2?"NOW PLAYING":"SPORTS CHANNEL"}</small><b>{server===1?(selected?.name||"Select a channel"):server===2?musicVideo.title:selectedSport.name}</b></span><strong>{server===1?"● LIVE":server===2?"♫ MUSIC":"🏆 SPORTS"}</strong></div>
      </div>
      <aside id="channels">
        <div className="aside-heading"><span className="aside-icon">▣</span><span><b>{server===1?"Available Channels":server===2?"Music Zone":"Sports Channels"}</b><small>{server===1?"Watch your favourite TV channels":server===2?"Search and play music":"Official sports broadcaster channels"}</small></span></div>
        <div className="server-switch"><button type="button" className={server===1?"selected":""} onClick={()=>setServer(1)}>⚡ Server 1 · Live TV</button><button type="button" className={server===2?"selected":""} onClick={()=>setServer(2)}>⚡ Server 2 · Music Zone</button><button type="button" className={server===3?"selected":""} onClick={()=>setServer(3)}>🏆 Server 3 · Sports</button></div>
        {server===1?<><input className="search" placeholder="Search live channel..." value={query} onChange={e=>setQuery(e.target.value)}/><select className="category" value={category} onChange={e=>setCategory(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select><div className="channels">{shown.map(c=><button className={selected?.id===c.id?"channel active":"channel"} key={c.id} onClick={()=>setSelected(c)}><span className="channel-logo"><img src={channelLogos[c.name]||c.logo_url||""} alt={c.name+" logo"} onError={e=>{e.currentTarget.style.display="none";}}/><b>{c.name.slice(0,2).toUpperCase()}</b></span><span><strong>{c.name}</strong><small>{c.category} · {c.country}</small></span><i>●</i></button>)}</div></>:server===2?<><h3 className="music-list-title">গানের ক্যাটাগরি</h3><div className="music-category-buttons">{musicCategories.map(item=><button type="button" key={item.label} disabled={musicLoading} onClick={()=>{setMusicQuery(item.query);void runMusicSearch(item.query);}}>{item.label}</button>)}</div><form className="music-search" onSubmit={searchMusic}><input value={musicQuery} onChange={e=>setMusicQuery(e.target.value)} placeholder="গানের নাম লিখে সার্চ করুন..."/><button type="submit" disabled={musicLoading}>{musicLoading?"খুঁজছে...":"সার্চ"}</button></form>{musicError&&<p className="music-error">{musicError}</p>}<div className="music-side-controls"><button type="button" onClick={()=>changeMusic(-1)} disabled={musicIndex<=0}>আগের গান</button><button type="button" onClick={()=>changeMusic(1)} disabled={musicIndex<0||musicIndex>=musicVideos.length-1}>পরের গান</button></div><h3 className="music-list-title">গানের তালিকা</h3><div className="music-grid">{musicVideos.map(item=><button type="button" key={item.id} className={musicVideo.id===item.id?"music-choice active":"music-choice"} onClick={()=>setMusicVideo(item)}><img src={item.thumbnail||`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`} alt=""/><span><strong>{item.title}</strong><small>{item.channel||"YouTube"}</small></span></button>)}</div></>:<div className="channels">{sportsChannels.map(item=><button type="button" className={selectedSport.id===item.id?"channel active":"channel"} key={item.id} onClick={()=>setSelectedSport(item)}><span className="channel-logo"><b>{item.name==="T Sports"?"TS":item.name==="Star Sports"?"SS":"SN"}</b></span><span><strong>{item.name}</strong><small>{item.country} · Official YouTube</small></span><i>▶</i></button>)}<p className="sports-note">এই অফিসিয়াল YouTube চ্যানেলগুলোতে সবসময় লাইভ টিভি সম্প্রচার নাও থাকতে পারে। সম্প্রচার না থাকলে প্লেয়ারে লাইভ ভিডিও নাও চলতে পারে।</p></div>}
      </aside>
    </section>
    <section className="about-strip" id="about"><div><span className="about-symbol">◉</span><span><b>Melandaha Live TV সম্পর্কে</b><small>Melandaha Live TV একটি অনলাইন টিভি ও বিনোদন প্ল্যাটফর্ম। এখানে দর্শকরা বাংলাদেশের জনপ্রিয় টিভি চ্যানেল দেখতে পারবেন এবং Music Zone থেকে বাংলা, হিন্দি, ভোজপুরি ও অন্যান্য ভাষার গান উপভোগ করতে পারবেন। আমাদের লক্ষ্য হলো সহজে এবং এক জায়গায় খবর ও বিনোদন পৌঁছে দেওয়া।</small></span></div><span className="about-note">Melandaha Live TV <i>·</i> Stay Connected, Stay Informed</span></section>
    <section className="shop-section" id="shop"><div className="shop-copy"><span className="shop-kicker">OUR SHOP</span><h2>Nur Islam Telecom</h2><p>মোবাইল এক্সেসরিজ, মোবাইল মেরামত এবং অনলাইনভিত্তিক বিভিন্ন সেবা পাওয়া যায় এখানে। আপনার মোবাইলের প্রয়োজনীয় জিনিসপত্র ও মেরামতের জন্য যোগাযোগ করুন Nur Islam Telecom-এর সঙ্গে।</p><strong>আপনার মোবাইলের প্রয়োজন, এক ঠিকানায়।</strong></div><div className="shop-services"><span>মোবাইল এক্সেসরিজ</span><span>মোবাইল মেরামত</span><span>অনলাইনভিত্তিক বিভিন্ন সেবা</span></div></section>
    <section className="contact-section" id="contact"><div className="contact-heading"><span>CONTACT</span><h2>যোগাযোগ করুন</h2><p>চ্যানেল, সম্প্রচার বা যেকোনো বিষয়ে আমাদের সঙ্গে যোগাযোগ করুন।</p></div><div className="contact-methods"><a href="tel:+8801929543354" className="contact-card"><span className="contact-icon">☎</span><span><small>PHONE</small><b>01929543354</b><em>কল করুন</em></span></a><a href="https://wa.me/8801929543354" target="_blank" rel="noreferrer" className="contact-card"><span className="contact-icon">◉</span><span><small>WHATSAPP</small><b>01929543354</b><em>WhatsApp-এ মেসেজ দিন</em></span></a><a href="mailto:nurnobikhan553@gmail.com" className="contact-card"><span className="contact-icon">✉</span><span><small>EMAIL</small><b>nurnobikhan553@gmail.com</b><em>ইমেইল পাঠান</em></span></a></div></section>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Melandaha Live TV. All rights reserved.</span><span>Authorized streams only <b>•</b> Made for viewers in Bangladesh</span></footer>
  </main>;
}
