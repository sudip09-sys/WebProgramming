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
  const [draft,setDraft]=useState('octocat');
  const [query,setQuery]=useState(null);
  const [result,setResult]=useState(null);
  useEffect(()=>{
    if(!query)return;
    const controller=new AbortController();
    async function lookup(){
      try{
        const response=await fetch('https://api.github.com/users/'+encodeURIComponent(query.name),{signal:controller.signal});
        if(!response.ok)throw new Error(response.status===404?'User not found.':'GitHub could not complete the lookup. Try again later.');
        const user=await response.json();
        if(!controller.signal.aborted)setResult({user});
      }catch(error){
        if(!controller.signal.aborted)setResult({error:error.message});
      }
    }
    lookup();
    return ()=>controller.abort();
  },[query]);
  return card('E2 · GitHub profile finder','Search for a public profile. A new search cancels the previous request.',
    h('form',{onSubmit:e=>{
      e.preventDefault();
      if(!draft.trim())return;
      setResult(null);
      setQuery({name:draft.trim()});
    }},field('GitHub username',draft,setDraft),h('button',{disabled:!draft.trim()},'Look up')),
    h('div',{role:'status'},query&&!result?'Looking up '+query.name+'…':result?.error||
      (result?.user&&h('a',{href:'https://github.com/'+encodeURIComponent(result.user.login)},result.user.name||result.user.login))));
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

const labs=[
  {name:'Tab-title reminders',component:TabTitle,code:'useEffect(() => {\\n  const previous = document.title;\\n  document.title = formatTitle(count);\\n  return () => { document.title = previous; };\\n}, [count]);'},
  {name:'GitHub profile finder',component:ProfileSearch,code:'useEffect(() => {\\n  const controller = new AbortController();\\n  loadProfile(query, controller.signal);\\n  return () => controller.abort();\\n}, [query]);'},
  {name:'Name badge preview',component:NamePreview,code:"const fullName = [first.trim(), last.trim()]\\n  .filter(Boolean).join(' ');"}
];
function ReactLab(){
  const [active,setActive]=useState(0);
  const [done,setDone]=useState([]);
  function togglePractice(){
    setDone(items=>items.includes(active)?items.filter(index=>index!==active):[...items,active]);
  }
  return h('main',{className:'friday'},
    h('section',{className:'hero'},h('p',{className:'eyebrow'},'WEEK 12 FRIDAY / WEB PROGRAMMING'),
      h('h1',null,'React Effects'),h('p',null,'Track reminders, look up a GitHub profile and build a name badge.'),
      h('a',{href:'#exercises'},'Open exercise workspace')),
    h('section',{id:'exercises',className:'workbench','aria-label':'Exercise workspace'},
      h('aside',null,h('h2',null,'Exercises'),
        h('p',{role:'status'},done.length+' of '+labs.length+' practiced'),
        h('progress',{value:done.length,max:labs.length,'aria-label':'Practice progress'}),
        labs.map((lab,index)=>h('button',{key:lab.name,type:'button','aria-pressed':index===active,onClick:()=>setActive(index)},lab.name+(done.includes(index)?' ✓':'')))),
      h('div',{className:'stage'},
        labs.map((lab,index)=>h('div',{key:lab.name,hidden:index!==active},
          h(lab.component),h('details',null,h('summary',null,'See the React pattern'),h('pre',null,h('code',null,lab.code))))),
        h('button',{type:'button','aria-pressed':done.includes(active),onClick:togglePractice},done.includes(active)?'Practiced ✓':'Mark as practiced'))),
    h(Samples));
}

createRoot(document.getElementById('lab')).render(h(ReactLab));
