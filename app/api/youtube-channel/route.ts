import {NextRequest,NextResponse} from "next/server";

export async function GET(request:NextRequest){
  const key=process.env.YOUTUBE_API_KEY;
  const handle=request.nextUrl.searchParams.get("handle")?.replace(/^@/,"").trim();
  if(!key) return NextResponse.json({error:"YouTube API key is not configured."},{status:503});
  if(!handle) return NextResponse.json({error:"A channel handle is required."},{status:400});
  const params=new URLSearchParams({part:"id",forHandle:handle,key});
  const response=await fetch("https://www.googleapis.com/youtube/v3/channels?"+params.toString(),{next:{revalidate:3600}});
  const data=await response.json();
  if(!response.ok) return NextResponse.json({error:data.error?.message||"Channel lookup failed."},{status:502});
  const channelId=data.items?.[0]?.id;
  if(!channelId) return NextResponse.json({error:"YouTube channel not found."},{status:404});
  return NextResponse.json({channelId});
}
