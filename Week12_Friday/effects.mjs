import {r as loadReact,n as loadDOM} from "../Week11%20monday/assets/jsx-runtime-D0USXF-_.js";
const {createElement:h,useState,useEffect}=loadReact();
const {createRoot}=loadDOM();
const button=(label,onClick)=>h('button',{type:'button',onClick},label);
const field=(label,value,set)=>h('label',null,label,h('input',{value,onChange:e=>set(e.target.value)}));
const card=(title,description,...children)=>h('article',{className:'task'},h('h3',null,title),h('p',null,description),...children);

function TabTitle(){
  const [count,set]=useState(0);
  const [project,setProject]=useState('Friday Lab');
  const title=(count?'('+count+') ':'')+(project.trim()||'Friday Lab')+' | Sudip Lab';
  useEffect(()=>{
    const previous=document.title;
    document.title=title;
    return ()=>{document.title=previous;};
  },[title]);
  return card('E1 · Lab reminders','Add a reminder and watch the browser tab title.',
    field('Workspace name',project,setProject),h('div',{className:'profile-result'},h('small',null,'Browser tab preview'),h('output',null,title),h('p',null,count?'Unread reminders: '+count:'Inbox clear')),
    h('p',{role:'status'},count+' unread'),button('Add reminder',()=>set(n=>n+1)),button('Clear reminders',()=>set(0)));
}

function ProfileSearch(){
  const [draft,setDraft]=useState('sudip09-sys');
  const [query,setQuery]=useState({name:'sudip09-sys'});
  const [result,setResult]=useState(null);
  const [sort,setSort]=useState('recent');
  const [language,setLanguage]=useState('');
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
  const languages=[...new Set((repos||[]).map(repo=>repo.language).filter(Boolean))].sort();
  const visible=repos&&repos.filter(repo=>!language||repo.language===language).sort((a,b)=>sort==='stars'?b.stargazers_count-a.stargazers_count:Date.parse(b.updated_at)-Date.parse(a.updated_at));
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
      h('label',null,'Repository language ',h('select',{value:language,onChange:event=>setLanguage(event.target.value)},h('option',{value:''},'All languages'),languages.map(value=>h('option',{key:value,value},value)))),
      visible.length===0&&h('p',null,'No recent repositories match.'),
      h('ul',{className:'profile-repos'},visible.map(repo=>h('li',{key:repo.id},
        h('a',{href:'https://github.com/'+encodeURIComponent(user.login)+'/'+encodeURIComponent(repo.name)},repo.name),
        repo.description&&h('p',null,repo.description),
        h('small',null,[repo.language,repo.stargazers_count+' stars',repo.forks_count+' forks'].filter(Boolean).join(' · ')))))));

  return card('Challenge · GitHub profile dashboard','Search a public profile and explore its latest repositories.',
    h('form',{onSubmit:event=>{
      event.preventDefault();
      const name=draft.trim();
      if(!name)return;
      setResult(null);
      setSort('recent');
      setLanguage('');
      setQuery({name});
    }},field('GitHub username',draft,setDraft),h('button',{disabled:!draft.trim()},'Look up')),
    h('p',{role:'status'},query&&!result?'Looking up @'+query.name+'…':result?.error||''),
    profile);
}

function NamePreview(){
  const [style,setStyle]=useState('Crimson');
  const [first,setFirst]=useState('Sudip');
  const [last,setLast]=useState('Sah');
  const fullName=[first.trim(),last.trim()].filter(Boolean).join(' ');
  return card('Bonus · Name badge preview','The preview is calculated from the two fields during rendering.',
    field('First name',first,setFirst),field('Last name',last,setLast),h('label',null,'Badge color ',h('select',{value:style,onChange:e=>setStyle(e.target.value)},['Crimson','Indigo','Forest'].map(color=>h('option',{key:color},color)))),
    h('output',{style:{background:{Crimson:'#79213d',Indigo:'#29246d',Forest:'#164f40'}[style],color:'#fff',borderRadius:12}},(fullName?fullName.split(/\s+/).map(word=>word[0]).slice(0,2).join('').toUpperCase()+' · ':'')+(fullName||'Your name')));
}

function Samples(){
  const [zone,setZone]=useState('Asia/Seoul');
  const [running,setRunning]=useState(true);
  const [count,setCount]=useState(0);
  const [time,setTime]=useState(()=>new Date());
  const [mode,setMode]=useState(()=>{try{return localStorage.getItem('sudip-effects-accent')||'red';}catch{return 'red';}});
  const [mounted,setMounted]=useState(false);
  const [observed,setObserved]=useState(0);
  useEffect(()=>{setMounted(true);},[]);
  useEffect(()=>{setObserved(count);},[count]);
  useEffect(()=>{
    if(!running)return;
    const timer=setInterval(()=>setTime(new Date()),1000);
    return ()=>clearInterval(timer);
  },[running]);
  useEffect(()=>{try{localStorage.setItem('sudip-effects-accent',mode);}catch{}},[mode]);
  return h('section',{'aria-labelledby':'samples'},h('h2',{id:'samples'},'Effect demos'),
    h('div',{className:'grid'},
      card('On mount','An effect with an empty dependency list runs when this demo mounts.',h('p',null,mounted?'Mounted':'Mounting…')),
      card('When a dependency changes','The effect tracks changes to the counter.',h('p',null,'Effect observed: '+observed),button('Advance counter',()=>setCount(n=>n+1))),
      card('Live clock','Pause the clock to run the effect cleanup, then resume to start a fresh interval.',h('label',null,'Clock time zone ',h('select',{value:zone,onChange:e=>setZone(e.target.value)},['Asia/Seoul','Asia/Kathmandu','UTC'].map(name=>h('option',{key:name},name)))),h('time',{dateTime:time.toISOString()},time.toLocaleTimeString('en',{timeZone:zone})),button(running?'Pause clock':'Resume clock',()=>setRunning(value=>!value)),h('p',{role:'status'},running?'Interval running':'Interval cleared')),
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
    h('div',{className:'stopwatch-dial',style:{'--sweep':(total%60000)/60000*360+'deg'}},h('p',{className:'friday-reading',role:'timer'},formatTime(total))),
    control('Start',()=>{const mark=performance.now();setNow(mark);setStarted(mark);},started!==null),
    control('Stop',()=>{setElapsed(elapsed+performance.now()-started);setStarted(null);},started===null),
    control('Lap',()=>setLaps([...laps,elapsed+performance.now()-started]),started===null),
    control('Reset',()=>{setStarted(null);setElapsed(0);setLaps([]);}),
    started!==null&&h('small',null,'Timing in progress'),
    laps.length>0&&h('p',null,laps.length+' laps · '+formatTime(laps.at(-1))+' recorded'),
    fastest!==null&&h('p',{className:'best-lap'},'Fastest split · '+formatTime(fastest)+' · Average split '+formatTime(laps.at(-1)/laps.length)),
    laps.length>0&&h('ol',null,laps.map((lap,index)=>h('li',{key:index},'Lap '+(index+1)+' · '+formatTime(lap)+' total · '+formatTime(lap-(laps[index-1]||0))+' split',
      h('meter',{min:0,max:Math.max(1,...laps.map((value,i)=>value-(laps[i-1]||0))),value:lap-(laps[index-1]||0),'aria-label':'Lap '+(index+1)+' split duration'})))));
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

const defaultWeatherPlace={name:'Seoul',country:'South Korea',latitude:37.5665,longitude:126.978};

function Weather(){
  const [city,setCity]=useState('Seoul');
  const [search,setSearch]=useState(null);
  const [matches,setMatches]=useState(null);
  const [place,setPlace]=useState(defaultWeatherPlace);
  const [coordinates,setCoordinates]=useState({latitude:'',longitude:''});
  const [inputError,setInputError]=useState('');
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
  const low=data?.daily?Math.min(...data.daily.temperature_2m_min):0;
  const high=data?.daily?Math.max(...data.daily.temperature_2m_max):0;
  const scale=Math.max(1,high-low);
  return card('Homework · Weather dashboard','Search by city or enter coordinates to load current conditions and a four-day forecast.',
    h('div',{className:'weather-inputs'},h('section',{'aria-label':'City search'},
    h('form',{onSubmit:event=>{
      event.preventDefault();
      if(city.trim().length<2)return;
      setInputError('');setMatches(null);setPlace(null);setReading(null);setSearch({name:city.trim()});
    }},field('City name',city,setCity),h('button',{disabled:city.trim().length<2},'Find city')),
    h('p',{role:'status'},matches?.error||(search&&!matches?'Finding cities…':matches?.places?.length===0?'No cities found. Try another name.':'')),
    matches?.places?.length>0&&h('div',{role:'group','aria-label':'Matching cities'},matches.places.map(p=>
      h('button',{type:'button',key:p.id,'aria-pressed':place?.id===p.id,onClick:()=>{setReading(null);setPlace({...p});}},placeName(p))))),
    h('section',{'aria-label':'Coordinate search'},
      h('form',{onSubmit:event=>{
        event.preventDefault();
        const latitude=Number(coordinates.latitude), longitude=Number(coordinates.longitude);
        if(!coordinates.latitude.trim()||!coordinates.longitude.trim()||
          !Number.isFinite(latitude)||!Number.isFinite(longitude)||
          Math.abs(latitude)>90||Math.abs(longitude)>180){
          setInputError('Enter latitude between −90 and 90 and longitude between −180 and 180.');
          return;
        }
        setInputError('');setSearch(null);setMatches(null);setReading(null);
        setPlace({name:latitude.toFixed(4)+', '+longitude.toFixed(4),latitude,longitude});
      }},field('Latitude',coordinates.latitude,value=>setCoordinates(previous=>({...previous,latitude:value}))),
        field('Longitude',coordinates.longitude,value=>setCoordinates(previous=>({...previous,longitude:value}))),
        h('button',{type:'submit'},'Load coordinates')),
      h('p',{role:'status'},inputError))),
    h('div',{role:'group','aria-label':'Quick weather locations'},[defaultWeatherPlace,{name:'Busan',country:'South Korea',latitude:35.18,longitude:129.08},{name:'Kathmandu',country:'Nepal',latitude:27.72,longitude:85.32}].map(p=>
      h('button',{key:p.name,type:'button',onClick:()=>{setSearch(null);setMatches(null);setInputError('');setReading(null);setCity(p.name);setPlace({...p});}},p.name))),
    reading?.error&&place&&button('Retry weather',()=>{setReading(null);setPlace({...place});}),
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
          h('div',{className:'temperature-track','aria-hidden':true},h('span',{style:{
            left:(data.daily.temperature_2m_min[index]-low)/scale*100+'%',
            width:(data.daily.temperature_2m_max[index]-data.daily.temperature_2m_min[index])/scale*100+'%'}})),
          h('strong',null,data.daily.temperature_2m_max[index]+'° / '+data.daily.temperature_2m_min[index]+'°')))))),
    h('p',null,h('a',{href:'https://open-meteo.com/'},'Weather data by Open-Meteo')));
}

function ViewportListener(){
  const [actual,setWidth]=useState(()=>window.innerWidth);
  const [preset,setPreset]=useState(null);
  const width=preset??actual;
  useEffect(()=>{
    const measure=()=>setWidth(window.innerWidth);
    window.addEventListener('resize',measure);
    return ()=>window.removeEventListener('resize',measure);
  },[]);
  return card('Practice · Viewport listener','Resize the browser to see the result. The effect removes its listener on unmount.',
    h('div',{role:'group','aria-label':'Preview width'},[[null,'Live browser'],[390,'Phone'],[820,'Tablet'],[1280,'Desktop']].map(([value,label])=>h('button',{key:label,type:'button','aria-pressed':value===preset,onClick:()=>setPreset(value)},label))),
    h('p',null,'Actual browser width: '+actual+' px'),
    h('output',null,width+' px · '+(width<720?'Compact layout':width<1024?'Tablet layout':'Wide layout')),
    h('meter',{min:0,max:Math.max(width,1440),value:width,'aria-label':'Viewport width scale'}),
    h('div',{className:'profile-stats',style:{gridTemplateColumns:width<720?'1fr':width<1024?'repeat(2,minmax(0,1fr))':'repeat(3,minmax(0,1fr))'}},['Navigation','Workspace','Results'].map(label=>h('div',{key:label},label))),
    h('p',null,width<720?'Panels stack vertically below 720 px.':'Panels can sit side by side at this width.'));
}

function RequestRace(){
  const [canceled,setCanceled]=useState(0);
  const [pending,setPending]=useState(false);
  const [request,setRequest]=useState(null);
  const [message,setMessage]=useState('Choose a reply speed.');
  useEffect(()=>{
    if(!request)return;
    const timer=setTimeout(()=>{setMessage(request.label+' reply arrived in '+request.delay+' ms.');setPending(false);},request.delay);
    return ()=>clearTimeout(timer);
  },[request]);
  function send(label,delay){
    if(pending)setCanceled(n=>n+1);
    setPending(true);
    setMessage('Waiting for the '+label.toLowerCase()+' reply…');
    setRequest({label,delay});
  }
  return card('Practice · Stale replies','Start Slow, then immediately click Fast. The slow reply is canceled so it cannot overwrite the fast result.',
    button('Slow request',()=>send('Slow',1800)),button('Fast request',()=>send('Fast',250)),
    h('p',{role:'status'},message),h('p',null,'Superseded requests: '+canceled));
}

function UserDirectory(){
  const [id,setId]=useState(1);
  const [attempt,setAttempt]=useState(0);
  const [result,setResult]=useState(null);
  useEffect(()=>{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort('timeout'),8000);
    async function loadUser(){
      try{
        const response=await fetch('./data/user-'+id+'.json',{signal:controller.signal});
        if(!response.ok)throw Error(response.status===404?'No profile exists for user '+id+'.':'The directory could not load right now.');
        const user=await response.json();
        if(!controller.signal.aborted)setResult({user});
      }catch(error){
        if(!controller.signal.aborted||controller.signal.reason==='timeout'){
          setResult({error:controller.signal.aborted?'The request timed out. Try again.':error.message});
        }
      }finally{clearTimeout(timeout);}
    }
    loadUser();
    return ()=>{clearTimeout(timeout);controller.abort();};
  },[id,attempt]);
  function search(next){
    setResult(null);
    setId(next);
    setAttempt(previous=>previous+1);
  }
  const user=result?.user;
  return card('E2 · People directory','Switch profiles to fetch a new record. Try a missing ID to see how the page handles a failed request.',
    h('div',{role:'group','aria-label':'Select a sample user'},[1,2,3,4,5].map(value=>h('button',{type:'button',key:value,'aria-pressed':value===id,onClick:()=>search(value)},['Hana','Nima','Minseo','Aarav','Yuna'][value-1]))),
    button('Test missing user',()=>search(999)),
    h('p',{role:'status'},result?.error||(!result?'Loading user '+id+'…':'Loaded user '+id)),
    result?.error&&button('Retry request',()=>search(id)),
    user&&h('section',{className:'profile-result','aria-label':'Sample user profile'},
      h('div',{className:'profile-heading'},h('span',{className:'directory-avatar','aria-hidden':true},user.name.split(' ').slice(0,2).map(word=>word[0]).join('')),
        h('div',null,h('h4',null,user.name),h('p',null,user.role))),
      h('dl',{className:'profile-stats'},[['Company',user.company],['City',user.city],['Primary tool',user.skill]].map(([label,value])=>h('div',{key:label},h('dt',null,label),h('dd',null,value)))),
      h('p',null,user.bio)),
    h('p',null,'Fictional profiles for this lab'));
}

const labs=[
  {name:'Tab-title reminders',component:TabTitle,code:'useEffect(() => {\\n  const previous = document.title;\\n  document.title = formatTitle(count);\\n  return () => { document.title = previous; };\\n}, [count]);'},
  {name:'Fetch a User',component:UserDirectory,code:'Fetch the selected user in an effect, handle loading and errors, and abort on cleanup.'},
  {name:'GitHub profile finder',component:ProfileSearch,code:'useEffect(() => {\\n  const controller = new AbortController();\\n  loadProfile(query, controller.signal);\\n  return () => controller.abort();\\n}, [query]);'},
  {name:'Stopwatch and laps',component:Stopwatch,code:'The timer effect returns clearInterval when stopped or hidden.'},
  {name:'Weather dashboard',component:Weather,code:'The weather effect fetches on location change and aborts during cleanup.'},
  {name:'Viewport listener',component:ViewportListener,code:'Add a resize listener in the effect and remove it in cleanup.'},
  {name:'Stale replies',component:RequestRace,code:'Cancel the previous operation when the request dependency changes.'},
  {name:'Name badge preview',component:NamePreview,code:"const fullName = [first.trim(), last.trim()]\\n  .filter(Boolean).join(' ');"}
];
function ReactLab(){
  const [active,setActive]=useState(()=>location.hash==='#weather-homework'?labs.findIndex(lab=>lab.component===Weather):1);
  const [theme,setTheme]=useState(()=>document.documentElement.dataset.theme||'dark');
  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    try{localStorage.setItem('sudip-friday-theme',theme);}catch{}
  },[theme]);
  useEffect(()=>{
    const toggle=document.getElementById('friday-theme');
    const light=theme==='light';
    toggle.textContent=light?'Dark mode':'Light mode';
    toggle.setAttribute('aria-pressed',String(light));
    toggle.hidden=false;
    const flip=()=>setTheme(light?'dark':'light');
    toggle.addEventListener('click',flip);
    return ()=>toggle.removeEventListener('click',flip);
  },[theme]);
  const [done,setDone]=useState([]);
  function togglePractice(){
    setDone(items=>items.includes(active)?items.filter(index=>index!==active):[...items,active]);
  }
  return h('main',{className:'friday'},
    h('section',{className:'hero'},h('p',{className:'eyebrow'},'WEEK 12 FRIDAY / WEB PROGRAMMING'),
      h('h1',null,'React ',h('em',null,'Effects.')),h('p',null,'Try timed laps, check local weather, and see how React effects handle timers and requests.'),
      h('a',{href:'#exercises'},'Open exercise workspace'),h('a',{href:'#weather-homework',onClick:()=>setActive(labs.findIndex(lab=>lab.component===Weather))},'Weather homework')),
    h('section',{id:'exercises',className:'workbench','aria-label':'Exercise workspace'},
      h('aside',null,h('h2',null,'Exercises'),
        h('p',{role:'status'},done.length+' of '+labs.length+' practiced'),
        h('progress',{value:done.length,max:labs.length,'aria-label':'Practice progress'}),
        labs.map((lab,index)=>h('button',{key:lab.name,type:'button','aria-pressed':index===active,onClick:()=>setActive(index)},lab.name+(done.includes(index)?' ✓':'')))),
      h('div',{className:'stage'},
        labs.map((lab,index)=>h('div',{key:lab.name,id:lab.component===Weather?'weather-homework':undefined,hidden:index!==active},
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
