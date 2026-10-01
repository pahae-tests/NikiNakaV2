const assert = require("assert")

function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function rating(teamScore,opponentScore,goals,playerId){
 const result=teamScore>opponentScore?1:teamScore===opponentScore?0:-1
 let impact=0
 goals.forEach((g,i)=>{
   if(String(g.scorerId)!==String(playerId))return
   const before=i
   const after=before+1
   let importance=before<0?1:before===0&&after>0?.92:before>0?.55:.55
   impact+=importance
 })
 const raw=6.15+(teamScore?impact/teamScore:0)*3+(result===1?.75:result===0?.25:-.35)+clamp((teamScore-opponentScore)/10,-.35,.35)
 return Number(clamp(raw,5,10).toFixed(1))
}
assert(rating(1,0,[{scorerId:1}],1)>=5)
assert(rating(10,0,[{scorerId:1}],1)<=10)
assert(rating(0,1,[],1)>=5)
console.log("Rating tests passed")