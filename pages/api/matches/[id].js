export const config = { api: { bodyParser: { sizeLimit: "12mb" } } }
import { query, withTransaction } from "../../../lib/db"
import { validateMatch } from "../../../lib/validation"
import { calculateRatings } from "../../../lib/rating"

export default async function handler(req,res){
 try{
  const id=Number(req.query.id)
  if(req.method==="GET"){
   const m=(await query("SELECT * FROM matches WHERE id=?",[id]))[0]
   if(!m)return res.status(404).json({error:"المباراة غير موجودة"})
   const players=await query(`
     SELECT mp.player_id as playerId, p.name as name, p.shirt_number as shirtNumber, p.image as image, mp.position as position, mp.rating as rating
     FROM match_players mp, players p
     WHERE mp.player_id = p.id
     AND match_id=?
   `,[id])
   const goals=await query("SELECT g.id,g.scorer_id scorerId,g.assist_id assistId,g.goal_order goalOrder,p.name scorerName,a.name assistName FROM goals g JOIN players p ON p.id=g.scorer_id LEFT JOIN players a ON a.id=g.assist_id WHERE g.match_id=? ORDER BY g.goal_order",[id])
   return res.json({id:m.id,opponentName:m.opponent_name,date:m.date,teamScore:m.team_score,opponentScore:m.opponent_score,players,goals})
  }
  if(req.method==="PUT"){
   const body=req.body||{}, errors=validateMatch(body)
   if(errors.length)return res.status(400).json({error:errors.join("، ")})
   const existing=(await query("SELECT id FROM matches WHERE id=?",[id]))[0]
   if(!existing)return res.status(404).json({error:"المباراة غير موجودة"})
   const ids=body.players.map(p=>Number(p.playerId))
   const dbPlayers=await query(`SELECT * FROM players WHERE id IN (${ids.map(()=>"?").join(",")})`,ids)
   const previous=await query("SELECT * FROM match_players WHERE match_id=?",[id])
   const previousById=new Map(previous.map(r=>[Number(r.player_id),r]))
   const validPlayers=dbPlayers.filter(p=>p.is_active||previousById.has(Number(p.id)))
   if(validPlayers.length!==6)return res.status(400).json({error:"بعض اللاعبين غير صالحين"})
   const snapshots=body.players.map(p=>{
    const playerId=Number(p.playerId)
    const old=previousById.get(playerId)
    if(old)return {...p,playerId,name:old.name_snapshot,shirtNumber:old.shirt_number_snapshot,image:old.image_snapshot}
    const d=validPlayers.find(x=>Number(x.id)===playerId)
    return {...p,playerId,name:d.name,shirtNumber:d.shirt_number,image:d.image}
   })
   const ratings=calculateRatings({teamScore:body.teamScore,opponentScore:body.opponentScore,players:snapshots,goals:body.goals})
   await withTransaction(async conn=>{
    await conn.execute("UPDATE matches SET opponent_name=?,date=?,team_score=?,opponent_score=?,updated_at=NOW() WHERE id=?",[body.opponentName,body.date,Number(body.teamScore),Number(body.opponentScore),id])
    await conn.execute("DELETE FROM goals WHERE match_id=?",[id])
    await conn.execute("DELETE FROM match_players WHERE match_id=?",[id])
    for(const p of ratings)await conn.execute("INSERT INTO match_players(match_id,player_id,name_snapshot,shirt_number_snapshot,image_snapshot,position,rating) VALUES(?,?,?,?,?,?,?)",[id,p.playerId,p.name,p.shirtNumber,p.image||null,p.position,p.rating])
    for(const g of body.goals)await conn.execute("INSERT INTO goals(match_id,scorer_id,assist_id,goal_order) VALUES(?,?,?,?)",[id,Number(g.scorerId),g.assistId?Number(g.assistId):null,Number(g.order)])
   })
   return res.json({id})
  }
  if(req.method==="DELETE"){await query("DELETE FROM matches WHERE id=?",[id]);return res.json({ok:true})}
  return res.status(405).end()
 }catch(e){return res.status(500).json({error:"خطأ في العملية"})}
}
