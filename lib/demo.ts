export type Channel = {
  id: string;
  name: string;
  category: string;
  country: string;
  stream_url: string;
  logo_url?: string | null;
  is_active: boolean;
};

export const demoChannels: Channel[] = [
  { id: "somoy-tv", name: "Somoy TV", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "jamuna-tv", name: "Jamuna TV", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "ekattor-tv", name: "Ekattor TV", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "channel-one", name: "Channel One", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "btv", name: "BTV", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "independent-tv", name: "Independent TV", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "channel-24", name: "Channel 24", category: "News", country: "Bangladesh", stream_url: "", is_active: true },
  { id: "rtv", name: "RTV", category: "News", country: "Bangladesh", stream_url: "", is_active: true }
];
