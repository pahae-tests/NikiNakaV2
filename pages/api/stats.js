import { query } from "../../lib/db"
export default async function handler(req,res){
 try{
  const players=await query(`SELECT p.id,p.name,p.image,
  COALESCE((SELECT COUNT(*) FROM match_players mp WHERE mp.player_id=p.id),0) matches,
  COALESCE((SELECT COUNT(*) FROM goals g WHERE g.scorer_id=p.id),0) goals,
  COALESCE((SELECT COUNT(*) FROM goals g WHERE g.assist_id=p.id),0) assists,
  ROUND((SELECT AVG(mp.rating) FROM match_players mp WHERE mp.player_id=p.id),1) avgRating
  FROM players p WHERE p.is_active=1 ORDER BY (goals+assists) DESC,goals DESC,assists DESC,p.name ASC`)
  const rows=await query(`SELECT mp.match_id,mp.player_id,mp.rating,p.name,
    (SELECT COUNT(*) FROM goals g WHERE g.match_id=mp.match_id AND g.scorer_id=mp.player_id) goals,
    (SELECT COUNT(*) FROM goals g WHERE g.match_id=mp.match_id AND g.assist_id=mp.player_id) assists
    FROM match_players mp JOIN players p ON p.id=mp.player_id ORDER BY mp.match_id`)
  const byMatch={}
  for(const r of rows){if(!byMatch[r.match_id])byMatch[r.match_id]=[];byMatch[r.match_id].push(r)}
  const mvp={}
  for(const list of Object.values(byMatch)){
    list.sort((a,b)=>Number(b.rating)-Number(a.rating)||Number(b.goals)-Number(a.goals)||Number(b.assists)-Number(a.assists)||String(a.name).localeCompare(String(b.name)))
    if(list[0])mvp[list[0].player_id]=(mvp[list[0].player_id]||0)+1
  }
  return res.json({players:players.map(p=>({...p,mvpCount:mvp[p.id]||0}))})
 }catch(e){return res.status(500).json({error:"خطأ في الإحصائيات"})}
}