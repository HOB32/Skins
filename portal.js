'use strict';
(async()=>{
 const status=document.getElementById('status'),form=document.getElementById('passwordForm');
 const fragment=new URLSearchParams(location.hash.slice(1)),token=fragment.get('access_token');
 history.replaceState(null,'',location.pathname); // Remove tokens before any requests.
 try{
  const c=window.ROTK_ACCESS,u=new URL(c.projectUrl);
  if(u.protocol!=='https:'||u.username||u.password||!u.hostname.endsWith('.supabase.co')||!c.publishableKey.startsWith('sb_publishable_'))throw Error('This invitation page has not been configured. Contact the administrator.');
  if(!token||fragment.get('error'))throw Error('Open the invitation or password recovery link in your email. Ask your administrator for a new link if it expired.');
  async function auth(method,body){const r=await fetch(u.origin+'/auth/v1/user',{method,redirect:'error',headers:{apikey:c.publishableKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});if(!r.ok)throw Error('Your invitation expired or the password was rejected. Ask the administrator for a new link.');return r.json();}
  const user=await auth('GET');if(!user.email_confirmed_at)throw Error('Verify the invited email before continuing.');
  status.textContent='Set a password for '+user.email+'.';form.hidden=false;
  form.onsubmit=async e=>{e.preventDefault();const password=document.getElementById('password'),confirm=document.getElementById('confirm');
   if(password.value!==confirm.value){status.textContent='Passwords must match.';return;}
   form.querySelector('button').disabled=true;
   try{await auth('PUT',{password:password.value});form.reset();form.hidden=true;status.textContent='Password saved. You can close this page and sign in through the launcher after account approval.';}
   catch(e){status.textContent=e.message;form.querySelector('button').disabled=false;}
  };
 }catch(e){status.textContent=e.message;}
})();
