import {NextRequest,NextResponse} from "next/server";

export async function GET(request:NextRequest){
  const key=process.env.YOUTUBE_API_KEY;
  const q=request.nextUrl.searchParams.get("q")?.trim();
  if(!key) return NextResponse.json({error:"YouTube API key is not configured."},{status:503});
  if(!q) return NextResponse.json({items:[]});
  const params=new URLSearchParams({part:"snippet",type:"video",videoEmbeddable:"true",maxResults:"15",q,key});
  const response=await fetch("https://www.googleapis.com/youtube/v3/search?"+params.toString(),{next:{revalidate:60}});
  const data=await response.json();
  if(!response.ok) return NextResponse.json({error:data.error?.message||"YouTube search failed."},{status:502});
  const items=(data.items||[]).map((item:any)=>({id:item.id?.videoId,title:item.snippet?.title||"Untitled",channel:item.snippet?.channelTitle||"YouTube",thumbnail:item.snippet?.thumbnails?.medium?.url||item.snippet?.thumbnails?.default?.url||""})).filter((item:any)=>item.id);
  return NextResponse.json({items});
}
