export const config = { api: { bodyParser: { sizeLimit: "12mb" } } }
import { query } from "../../../lib/db"
import { validateMatch } from "../../../lib/validation"
import { calculateRatings } from "../../../lib/rating"

export default async function handler(req,res){
 try{
  if(req.method==="GET"){
   const matches=await query("SELECT * FROM matches ORDER BY date DESC")
   for(const m of matches){
    const ps=await query("SELECT mp.*,p.name,p.image,p.shirt_number FROM match_players mp JOIN players p ON p.id=mp.player_id WHERE mp.match_id=?",[m.id])
    const goals=await query("SELECT g.*,p.name scorerName,a.name assistName FROM goals g JOIN players p ON p.id=g.scorer_id LEFT JOIN players a ON a.id=g.assist_id WHERE g.match_id=? ORDER BY g.goal_order",[m.id])
    m.players=ps;m.goals=goals;m.result=m.team_score>m.opponent_score?"win":m.team_score<m.opponent_score?"loss":"draw"
   }
   const summary=matches.reduce((s,m)=>{s.matches++;s.goals+=m.team_score;s.wins+=m.team_score>m.opponent_score?1:0;s.losses+=m.team_score<m.opponent_score?1:0;s.draws+=m.team_score===m.opponent_score?1:0;return s},{matches:0,wins:0,losses:0,draws:0,goals:0,assists:0})
   summary.assists=(await query("SELECT COUNT(*) c FROM goals WHERE assist_id IS NOT NULL"))[0].c
   return res.json({matches:matches.map(m=>({id:m.id,opponentName:m.opponent_name,date:m.date,teamScore:m.team_score,opponentScore:m.opponent_score,result:m.result})),summary})
  }
  if(req.method==="POST"){
   const body=req.body||{}, errors=validateMatch(body)
   if(errors.length)return res.status(400).json({error:errors.join("، ")})
   const ids=body.players.map(p=>Number(p.playerId))
   const dbPlayers=await query(`SELECT * FROM players WHERE id IN (${ids.map(()=>"?").join(",")}) AND is_active=1`,ids)
   if(dbPlayers.length!==6)return res.status(400).json({error:"بعض اللاعبين غير صالحين"})
   const result=await query("INSERT INTO matches(opponent_name,date,team_score,opponent_score) VALUES(?,?,?,?)",[body.opponentName,body.date,body.teamScore,body.opponentScore])
   const matchId=result.insertId
   const snapshots=body.players.map(p=>{const d=dbPlayers.find(x=>x.id===Number(p.playerId));return {...p,name:d.name,shirtNumber:d.shirt_number,image:d.image}})
   const ratings=calculateRatings({teamScore:body.teamScore,opponentScore:body.opponentScore,players:snapshots,goals:body.goals})
   for(const p of ratings)await query("INSERT INTO match_players(match_id,player_id,name_snapshot,shirt_number_snapshot,image_snapshot,position,rating) VALUES(?,?,?,?,?,?,?)",[matchId,p.playerId,p.name,p.shirtNumber,p.image,p.position,p.rating])
   for(const g of body.goals)await query("INSERT INTO goals(match_id,scorer_id,assist_id,goal_order) VALUES(?,?,?,?)",[matchId,g.scorerId,g.assistId||null,g.order])
   return res.status(201).json({id:matchId})
  }
  return res.status(405).end()
 }catch(e){return res.status(500).json({error:"تعذر حفظ المباراة"})}
}