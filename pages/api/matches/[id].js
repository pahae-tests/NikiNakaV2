import { query } from "../../../lib/db"
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
  if(req.method==="DELETE"){await query("DELETE FROM matches WHERE id=?",[id]);return res.json({ok:true})}
  return res.status(405).end()
 }catch(e){return res.status(500).json({error:"خطأ في العملية"})}
}