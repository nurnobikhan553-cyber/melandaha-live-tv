"use client";
import {useEffect,useRef,useState} from "react";
import Hls from "hls.js";

function youtubeEmbedUrl(value:string):string|null{
  try{
    const url=new URL(value);
    const host=url.hostname.replace(/^www\\./,"");
    if(host==="youtu.be"){
      const id=url.pathname.split("/").filter(Boolean)[0];
      return id? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`:null;
    }
    if(host!=="youtube.com"&&host!=="m.youtube.com"&&host!=="youtube-nocookie.com")return null;
    const parts=url.pathname.split("/").filter(Boolean);
    const id=url.searchParams.get("v")||(parts[0]==="embed"||parts[0]==="live"?parts[1]:null);
    return id? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`:null;
  }catch{return null;}
}

export default function VideoPlayer({src}:{src:string}){
  const ref=useRef<HTMLVideoElement>(null);
  const [started,setStarted]=useState(false);
  const [error,setError]=useState("");
  const embedUrl=youtubeEmbedUrl(src);
  useEffect(()=>{setStarted(false);setError("");},[src]);
  useEffect(()=>{
    const v=ref.current;
    if(!v||!src||embedUrl||!started)return;
    setError("");
    if(v.canPlayType("application/vnd.apple.mpegurl")){
      v.src=src;
      v.play().catch(()=>setError("Play চাপ দিয়ে আবার চেষ্টা করুন।"));
      return;
    }
    if(Hls.isSupported()){
      const h=new Hls();
      h.loadSource(src);
      h.attachMedia(v);
      h.on(Hls.Events.MANIFEST_PARSED,()=>v.play().catch(()=>setError("Play চাপ দিয়ে আবার চেষ্টা করুন।")));
      h.on(Hls.Events.ERROR,(_,d)=>{if(d.fatal)setError("স্ট্রিম চালানো যাচ্ছে না। URL/CORS পরীক্ষা করুন।");});
      return()=>h.destroy();
    }
    setError("এই ব্রাউজারে HLS স্ট্রিম সমর্থিত নয়।");
  },[src,started,embedUrl]);
  if(!started)return <div className="poster"><div className="poster-copy"><small>WELCOME TO</small><h1>MELANDAHA<br/><b>LIVE TV</b></h1><p>Watch Live TV Anytime, Anywhere</p><span>TV CHANNELS　 •　 SPORTS　 •　 NEWS</span></div><button onClick={()=>src?setStarted(true):setError("এই চ্যানেলের অনুমোদিত স্ট্রিম URL এখনো যোগ করা হয়নি।")}>▶　CLICK TO PLAY</button>{error&&<small className="error">{error}</small>}</div>;
  if(embedUrl)return <div className="playing"><iframe src={embedUrl} title="Live TV stream" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/><button onClick={()=>setStarted(false)}>← Banner</button></div>;
  return <div className="playing"><video ref={ref} controls playsInline autoPlay/><button onClick={()=>setStarted(false)}>← Banner</button>{error&&<p>{error}</p>}</div>;
}
