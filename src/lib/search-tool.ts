export async function webSearch(query: string) {
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 3 }),
    });
    const data = await res.json();
    
    if (!data.organic) return [];
    
    return data.organic.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
  } catch (e) {
    console.error("Search Tool Error:", e);
    return [];
  }
}
