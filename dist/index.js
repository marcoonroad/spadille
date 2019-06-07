var spadille=function(n,t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;var e=function(){const n=t;return{hmac:async function(t,e){const r=n.createHmac("sha512",t);return r.update(e),r.digest("hex")}}},r=function(){const n=window.crypto.subtle,t=new TextEncoder("utf-8"),e=function(n){return("00"+n.toString(16)).slice(-2)},r=function(n){return t.encode(n)};return{hmac:async function(t,c){const o=r(c),u=await async function(t,e){const c=r(t),o={name:"HMAC",hash:{name:"SHA-512"}};return await n.importKey("raw",c,o,!1,[e])}(t,"sign");return function(n){return[...new Uint8Array(n)].map(e).join("")}(await n.sign("HMAC",u,o))}}};let c=null;!function(){try{c=void 0===window&&void 0===document?e().hmac:r().hmac}catch(n){c=e().hmac}}();var o={sign:c,verify:async function(n,t,e){return t===await c(n,e)}};const u=function(n,t,e){return t+n%(e+1-t)},a=function(n,t){const e=Number.parseInt(n.length/t),r=[];for(let c=0;c<t;c+=1){const t=n.substr(c*e,e);r.push(t)}return{pieces:r,rest:n.substr(r*t)||"11"}},i=function(n){return Number.parseInt(n,16)};var s=a,f=u,m=i,p=function(n){return u(n,1,60)},h=async function(n,t,e){if(e>=t)throw Error("The number of balls must be lower than the limit of RNG!");const r=await o.sign(n,n),c=a(r,e),s=function(n){return function(t){return u(t,1,n)}}(t),f=s(i(c.rest));c.pieces=c.pieces.map(i).map(s).map(function(n){return f+n}).map(s);const m={},p=[];return c.pieces.forEach(function(n){let t=n;for(;m[t.toString()];)t=s(t*f);m[t.toString()]=!0,p.push(t)}),p},l={pieces:s,cycle:f,fromHex:m,random60:p,generate:h};return n.cycle=f,n.default=l,n.fromHex=m,n.generate=h,n.pieces=s,n.random60=p,n}({},crypto);