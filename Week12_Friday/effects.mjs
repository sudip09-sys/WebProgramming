import {r as loadReact,n as loadDOM} from "../Week11%20monday/assets/jsx-runtime-D0USXF-_.js";
const {createElement:h,useState,useEffect}=loadReact();
const {createRoot}=loadDOM();
const button=(label,onClick)=>h('button',{type:'button',onClick},label);
const field=(label,value,set)=>h('label',null,label,h('input',{value,onChange:e=>set(e.target.value)}));
const card=(title,description,...children)=>h('article',{className:'task'},h('h3',null,title),h('p',null,description),...children);

function TabTitle(){
  const [count,set]=useState(0);
  useEffect(()=>{
    const previous=document.title;
    document.title=count ? '('+count+') Lab reminders' : 'Week 12 Friday | Sudip Lab';
    return ()=>{document.title=previous;};
  },[count]);
  return card('E1 · Lab reminders','Add a reminder and watch the browser tab title.',
    h('p',{role:'status'},count+' unread'),button('Add reminder',()=>set(n=>n+1)),button('Clear reminders',()=>set(0)));
}

function ProfileSearch(){
  const [draft,setDraft]=useState('sudip09-sys');
  const [query,setQuery]=useState({name:'sudip09-sys'});
  const [result,setResult]=useState(null);
  const [sort,setSort]=useState('recent');
  useEffect(()=>{
    if(!query)return;
    const controller=new AbortController();
    const {signal}=controller;
    const url='https://api.github.com/users/'+encodeURIComponent(query.name);
    async function getJSON(path){
      const response=await fetch(url+path,{signal});
      if(!response.ok){
        const limited=response.status===429||response.headers.get('x-ratelimit-remaining')==='0';
        throw new Error(limited?'GitHub’s search limit was reached. Try again later.':response.status===404?'GitHub user not found.':'GitHub could not complete the request.');
      }
      return response.json();
    }
    async function lookup(){
      try{
        const user=await getJSON('');
        if(signal.aborted)return;
        setResult({user});
        try{
          const repos=await getJSON('/repos?sort=updated&direction=desc&per_page=8');
          if(!signal.aborted)setResult({user,repos});
        }catch(error){
          if(!signal.aborted)setResult({user,repoError:error.message});
        }
      }catch(error){
        if(!signal.aborted)setResult({error:error.message});
      }
    }
    lookup();
    return ()=>controller.abort();
  },[query]);

  const user=result?.user;
  const repos=result?.repos;
  const visible=repos&&[...repos].sort((a,b)=>sort==='stars'?b.stargazers_count-a.stargazers_count:Date.parse(b.updated_at)-Date.parse(a.updated_at));
  const stats=user&&[['Public repos',user.public_repos],['Followers',user.followers],['Following',user.following]];
  const profile=user&&h('section',{className:'profile-result','aria-label':'GitHub profile'},
    h('div',{className:'profile-heading'},
      h('img',{src:'https://avatars.githubusercontent.com/u/'+Number(user.id),alt:'',width:72,height:72}),
      h('div',null,h('h4',null,user.name||user.login),
        h('a',{href:'https://github.com/'+encodeURIComponent(user.login)},'@'+user.login),
        user.location&&h('p',null,user.location))),
    user.bio&&h('p',null,user.bio),
    h('dl',{className:'profile-stats'},stats.map(([label,value])=>h('div',{key:label},h('dt',null,label),h('dd',null,value)))),
    h('h4',null,'Recent public repositories'),
    h('p',{role:'status'},result.repoError||(!repos?'Loading repositories…':repos.length===0?'No public repositories found.':repos.length+' repositories loaded.')),
    repos?.length>0&&h('div',null,
      h('div',{role:'group','aria-label':'Sort recent repositories'},
        ['recent','stars'].map(mode=>h('button',{key:mode,type:'button','aria-pressed':sort===mode,onClick:()=>setSort(mode)},mode==='recent'?'Recently updated':'Most stars'))),
      h('ul',{className:'profile-repos'},visible.map(repo=>h('li',{key:repo.id},
        h('a',{href:'https://github.com/'+encodeURIComponent(user.login)+'/'+encodeURIComponent(repo.name)},repo.name),
        repo.description&&h('p',null,repo.description),
        h('small',null,[repo.language,repo.stargazers_count+' stars',repo.forks_count+' forks'].filter(Boolean).join(' · ')))))));

  return card('E2 · GitHub profile dashboard','Search a public profile and explore its latest repositories.',
    h('form',{onSubmit:event=>{
      event.preventDefault();
      const name=draft.trim();
      if(!name)return;
      setResult(null);
      setSort('recent');
      setQuery({name});
    }},field('GitHub username',draft,setDraft),h('button',{disabled:!draft.trim()},'Look up')),
    h('p',{role:'status'},query&&!result?'Looking up @'+query.name+'…':result?.error||''),
    profile);
}

function NamePreview(){
  const [first,setFirst]=useState('Sudip');
  const [last,setLast]=useState('Sah');
  const fullName=[first.trim(),last.trim()].filter(Boolean).join(' ');
  return card('E3 · Name badge preview','The preview is calculated from the two fields during rendering.',
    field('First name',first,setFirst),field('Last name',last,setLast),h('output',null,fullName||'Your name'));
}

function Samples(){
  const [count,setCount]=useState(0);
  const [time,setTime]=useState(()=>new Date());
  const [mode,setMode]=useState(()=>{try{return localStorage.getItem('sudip-effects-accent')||'red';}catch{return 'red';}});
  const [mounted,setMounted]=useState(false);
  const [observed,setObserved]=useState(0);
  useEffect(()=>{setMounted(true);},[]);
  useEffect(()=>{setObserved(count);},[count]);
  useEffect(()=>{
    const timer=setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(timer);
  },[]);
  useEffect(()=>{try{localStorage.setItem('sudip-effects-accent',mode);}catch{}},[mode]);
  return h('section',{'aria-labelledby':'samples'},h('h2',{id:'samples'},'Effect demos'),
    h('div',{className:'grid'},
      card('On mount','An effect with an empty dependency list runs when this demo mounts.',h('p',null,mounted?'Mounted':'Mounting…')),
      card('When a dependency changes','The effect tracks changes to the counter.',h('p',null,'Effect observed: '+observed),button('Advance counter',()=>setCount(n=>n+1))),
      card('Live clock','A timer updates once a second and is cleared on unmount.',h('time',{dateTime:time.toISOString()},time.toLocaleTimeString())),
      card('Saved accent','Change the badge color and refresh to see it restored.',
        h('p',{style:{color:mode==='gold'?'#ffd68e':'#ff8996'}},'Sudip Lab badge'),
        button('Switch accent',()=>setMode(value=>value==='gold'?'red':'gold')))));
}

function formatTime(ms){
  const seconds=Math.floor(ms/1000);
  return [Math.floor(seconds/60),seconds%60].map(n=>String(n).padStart(2,'0')).join(':')+'.'+Math.floor(ms%1000/100);
}

function Stopwatch({visible}){
  const [elapsed,setElapsed]=useState(0);
  const [started,setStarted]=useState(null);
  const [now,setNow]=useState(0);
  const [laps,setLaps]=useState([]);
  const total=elapsed+(started===null?0:now-started);
  useEffect(()=>{
    if(started===null||!visible)return;
    const id=setInterval(()=>setNow(performance.now()),50);
    return ()=>clearInterval(id);
  },[started,visible]);
  const fastest=laps.length?Math.min(...laps.map((lap,index)=>lap-(laps[index-1]||0))):null;
  const control=(label,onClick,disabled=false)=>h('button',{type:'button',onClick,disabled},label);
  return card('E3 · Stopwatch and laps','Start, stop, and reset the timer. Lap splits show the time since the previous lap.',
    h('p',{className:'friday-reading',role:'timer'},formatTime(total)),
    control('Start',()=>{const mark=performance.now();setNow(mark);setStarted(mark);},started!==null),
    control('Stop',()=>{setElapsed(elapsed+performance.now()-started);setStarted(null);},started===null),
    control('Lap',()=>setLaps([...laps,elapsed+performance.now()-started]),started===null),
    control('Reset',()=>{setStarted(null);setElapsed(0);setLaps([]);}),
    fastest!==null&&h('p',{className:'best-lap'},'Fastest split · '+formatTime(fastest)),
    laps.length>0&&h('ol',null,laps.map((lap,index)=>h('li',{key:index},'Lap '+(index+1)+' · '+formatTime(lap)+' total · '+formatTime(lap-(laps[index-1]||0))+' split'))));
}

function weatherLabel(code){
  if(code===0)return 'Clear';
  if(code<=2)return 'Partly cloudy';
  if(code===3)return 'Overcast';
  if(code<=48)return 'Fog';
  if(code<=57)return 'Drizzle';
  if(code<=67)return 'Rain';
  if(code<=77)return 'Snow';
  if(code<=82)return 'Rain showers';
  if(code<=86)return 'Snow showers';
  return 'Thunderstorm';
}

async function weatherJSON(url,signal){
  const response=await fetch(url,{signal});
  if(response.status===429)throw Error('Weather service rate limit reached. Try again later.');
  if(!response.ok)throw Error('Weather service is unavailable. Try again.');
  return response.json();
}

function Weather(){
  const [city,setCity]=useState('Seoul');
  const [search,setSearch]=useState(null);
  const [matches,setMatches]=useState(null);
  const [place,setPlace]=useState(null);
  const [reading,setReading]=useState(null);
  useEffect(()=>{
    if(!search)return;
    const controller=new AbortController();
    const {signal}=controller;
    weatherJSON('https://geocoding-api.open-meteo.com/v1/search?count=5&language=en&name='+encodeURIComponent(search.name),signal)
      .then(data=>{if(!signal.aborted)setMatches({places:data.results||[]});})
      .catch(error=>{if(!signal.aborted)setMatches({error:error.message});});
    return ()=>controller.abort();
  },[search]);
  useEffect(()=>{
    if(!place)return;
    const controller=new AbortController();
    const {signal}=controller;
    const params=new URLSearchParams({latitude:place.latitude,longitude:place.longitude,timezone:'auto',
      forecast_days:4,daily:'temperature_2m_max,temperature_2m_min,weather_code',
      current:'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code'});
    weatherJSON('https://api.open-meteo.com/v1/forecast?'+params,signal)
      .then(data=>{if(!data.current)throw Error('No current conditions are available.');if(!signal.aborted)setReading({data});})
      .catch(error=>{if(!signal.aborted)setReading({error:error.message});});
    return ()=>controller.abort();
  },[place]);
  const placeName=p=>[p.name,p.admin1,p.country].filter(Boolean).join(', ');
  const data=reading?.data;
  return card('Homework · Weather dashboard','Find a city and select a match to load its current conditions.',
    h('form',{onSubmit:event=>{
      event.preventDefault();
      if(city.trim().length<2)return;
      setMatches(null);setPlace(null);setReading(null);setSearch({name:city.trim()});
    }},field('City name',city,setCity),h('button',{disabled:city.trim().length<2},'Find city')),
    h('p',{role:'status'},matches?.error||(search&&!matches?'Finding cities…':matches?.places?.length===0?'No cities found. Try another name.':'')),
    matches?.places?.length>0&&h('div',{role:'group','aria-label':'Matching cities'},matches.places.map(p=>
      h('button',{type:'button',key:p.id,'aria-pressed':place?.id===p.id,onClick:()=>{setReading(null);setPlace({...p});}},placeName(p)))),
    h('p',{role:'status'},reading?.error||(place&&!reading?'Loading weather for '+place.name+'…':'')),
    data&&h('section',{className:'profile-result','aria-label':'Current weather'},
      h('h4',null,placeName(place)),h('p',{className:'friday-reading'},data.current.temperature_2m+' °C'),
      h('p',null,weatherLabel(data.current.weather_code)),
      h('dl',{className:'profile-stats'},[['Feels like',data.current.apparent_temperature+' °C'],['Wind',data.current.wind_speed_10m+' km/h'],['Humidity',data.current.relative_humidity_2m+'%']].map(([label,value])=>h('div',{key:label},h('dt',null,label),h('dd',null,value)))),
      h('small',null,'Local reading: '+data.current.time.replace('T',' ')+' · '+data.timezone),
      data.daily&&h('section',{'aria-label':'Four-day forecast'},h('h4',null,'Four-day forecast'),
        h('ul',{className:'forecast'},data.daily.time.map((date,index)=>h('li',{key:date},
          h('time',{dateTime:date},new Intl.DateTimeFormat('en',{weekday:'short',timeZone:'UTC'}).format(new Date(date))),
          h('span',null,weatherLabel(data.daily.weather_code[index])),
          h('strong',null,data.daily.temperature_2m_max[index]+'° / '+data.daily.temperature_2m_min[index]+'°')))))),
    h('p',null,h('a',{href:'https://open-meteo.com/'},'Weather data by Open-Meteo')));
}

const labs=[
  {name:'Tab-title reminders',component:TabTitle,code:'useEffect(() => {\\n  const previous = document.title;\\n  document.title = formatTitle(count);\\n  return () => { document.title = previous; };\\n}, [count]);'},
  {name:'GitHub profile finder',component:ProfileSearch,code:'useEffect(() => {\\n  const controller = new AbortController();\\n  loadProfile(query, controller.signal);\\n  return () => controller.abort();\\n}, [query]);'},
  {name:'Stopwatch and laps',component:Stopwatch,code:'The timer effect returns clearInterval when stopped or hidden.'},
  {name:'Weather dashboard',component:Weather,code:'The weather effect fetches on location change and aborts during cleanup.'},
  {name:'Name badge preview',component:NamePreview,code:"const fullName = [first.trim(), last.trim()]\\n  .filter(Boolean).join(' ');"}
];
function ReactLab(){
  const [active,setActive]=useState(1);
  const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'dark');
  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    try{localStorage.setItem('sudip-friday-theme',theme);}catch{}
  },[theme]);
  const [done,setDone]=useState([]);
  function togglePractice(){
    setDone(items=>items.includes(active)?items.filter(index=>index!==active):[...items,active]);
  }
  return h('main',{className:'friday'},
    h('section',{className:'hero'},h('p',{className:'eyebrow'},'WEEK 12 FRIDAY / WEB PROGRAMMING'),
      h('h1',null,'React ',h('em',null,'Effects.')),h('p',null,'Try timed laps, check local weather, and see how React effects handle timers and requests.'),
      h('a',{href:'#exercises'},'Open exercise workspace'),
      h('button',{type:'button',className:'theme-switch','aria-pressed':theme==='light','aria-label':'Light mode',onClick:()=>setTheme(value=>value==='dark'?'light':'dark')},theme==='dark'?'Switch to light mode':'Switch to dark mode')),
    h('section',{id:'exercises',className:'workbench','aria-label':'Exercise workspace'},
      h('aside',null,h('h2',null,'Exercises'),
        h('p',{role:'status'},done.length+' of '+labs.length+' practiced'),
        h('progress',{value:done.length,max:labs.length,'aria-label':'Practice progress'}),
        labs.map((lab,index)=>h('button',{key:lab.name,type:'button','aria-pressed':index===active,onClick:()=>setActive(index)},lab.name+(done.includes(index)?' ✓':'')))),
      h('div',{className:'stage'},
        labs.map((lab,index)=>h('div',{key:lab.name,hidden:index!==active},
          h(lab.component,{visible:index===active}),h('details',null,h('summary',null,'See the React pattern'),h('pre',null,h('code',null,lab.code))))),
        h('button',{type:'button','aria-pressed':done.includes(active),onClick:togglePractice},done.includes(active)?'Practiced ✓':'Mark as practiced'))),
    h('section',{className:'stage',id:'what-i-learned','aria-labelledby':'recap-title'},
      h('h2',{id:'recap-title'},'What I learned'),
      h('ul',null,
        h('li',null,h('strong',null,'Tab title. '),'I used ',h('code',null,'useEffect'),' to update the browser tab title when the reminder count changes.'),
        h('li',null,h('strong',null,'GitHub lookup. '),'I cancel the previous request in the effect cleanup when a new search starts.'),
        h('li',null,h('strong',null,'Name badge. '),'I build the full name from the two inputs during rendering because both values are already in state.'))),
    h(Samples));
}

createRoot(document.getElementById('lab')).render(h(ReactLab));
