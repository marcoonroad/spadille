var spadille=function(n,t){"use strict";t=t&&t.hasOwnProperty("default")?t.default:t;var r=function(){const n=t;return{hmac:async function(t,r){const e=n.createHmac("sha512",t);return e.update(r),e.digest("hex")}}},e=function(){const n=window.crypto.subtle,t=new TextEncoder("utf-8"),r=function(n){return("00"+n.toString(16)).slice(-2)},e=function(n){return t.encode(n)};return{hmac:async function(t,a){const i=e(a),o=await async function(t,r){const a=e(t),i={name:"HMAC",hash:{name:"SHA-512"}};return await n.importKey("raw",a,i,!1,[r])}(t,"sign");return function(n){return[...new Uint8Array(n)].map(r).join("")}(await n.sign("HMAC",o,i))}}};let a=null;!function(){try{a=void 0===window&&void 0===document?r().hmac:e().hmac}catch(n){a=r().hmac}}();var i={sign:a,verify:async function(n,t,r){return t===await a(n,r)}};const o=function(n,t,r){return t+n%(r+1-t)},u=function(n,t){return n^t},c=function(n){return Number.parseInt(n,16)},s=async function(n,t){const r=await i.sign(n,t.toString()),e=[];for(let n=0;n<32;n+=1)e.push(c(r.substr(16*n,16)));return e.reduce(u).toString(16)},m=function(n){return null==n},f=function(n,t){return n>t?1:n<t?-1:0};var l={cycle:o,splitInPieces:async function(n,t){const r=[];for(let e=0;e<t;e+=1)r.push(s(n,e));return{pieces:await Promise.all(r),rest:"11"}},fromHex:c,makeRandomGen:function(n,t){return function(r){return o(r,n,t)}},missing:m,option:function(n,t){return m(n)?t:n},sortArrayNumber:function(n){return n.sort(f)}};const{fromHex:p,makeRandomGen:y,option:d,splitInPieces:h}=l;var w={generate:async function(n){let{secret:t,payload:r,minimum:e,maximum:a,amount:o,distinct:u}=n;if(e=d(e,1),a=d(a,60),o=d(o,6),(u=d(u,!0))&&o>=a-e)throw Error("The number of balls [amount] must be lower than the [maximum - minimum] number of RNG when [distinct] flag is on!");const c=await i.sign(t,r),s=await h(c,o),m=y(e,a),f=m(p(s.rest));if(s.pieces=s.pieces.map(p).map(Math.abs).map(m).map(function(n){return n+f}).map(m),u){const n=[],t={};return s.pieces.forEach(function(r){let e=r;for(;t[e.toString()];)e=m(e*f);t[e.toString()]=!0,n.push(e)}),n}return s.pieces}};var g={brazillian:{megaSena:async function(n,t){const r=await w.generate({secret:n,payload:t});return l.sortArrayNumber(r)},federal:async function(n,t){return(await w.generate({secret:n,payload:t,minimum:0,maximum:9,amount:5,distinct:!1})).map(function(n){return n.toString()}).join("")}}},b=w,v={lottery:g,prng:b};return n.default=v,n.lottery=g,n.prng=b,n}({},crypto);