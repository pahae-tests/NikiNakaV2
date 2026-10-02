export const config = { api: { bodyParser: { sizeLimit: "20mb" } } }
import { query } from "../../../lib/db"
export default async function handler(req,res){
 try{
  if(req.method==="GET"){
   const rows=await query(`SELECT p.*,
    (SELECT COUNT(*) FROM match_players mp WHERE mp.player_id=p.id) matches,
    (SELECT COUNT(*) FROM goals g WHERE g.scorer_id=p.id) goals,
    (SELECT COUNT(*) FROM goals g WHERE g.assist_id=p.id) assists,
    ROUND((SELECT AVG(mp.rating) FROM match_players mp WHERE mp.player_id=p.id),1) avgRating
    FROM players p WHERE p.is_active=1 ORDER BY p.shirt_number`)
   return res.json(rows)
  }
  if(req.method==="POST"){
   const {name,shirtNumber,image}=req.body||{}
   if(image && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image))return res.status(400).json({error:"صورة غير صالحة"})
   if(!name||!Number.isInteger(Number(shirtNumber)))return res.status(400).json({error:"بيانات اللاعب غير صحيحة"})
   if(image && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image))return res.status(400).json({error:"صورة غير صالحة"})
   const exists=await query("SELECT id FROM players WHERE shirt_number=? AND is_active=1",[Number(shirtNumber)])
   if(exists.length)return res.status(409).json({error:"رقم القميص مستخدم بالفعل"})
   const result=await query("INSERT INTO players(name,shirt_number,image,is_active) VALUES(?,?,?,1)",[name,Number(shirtNumber),image||null])
   return res.status(201).json({id:result.insertId,name,shirtNumber:Number(shirtNumber),image:image||null})
  }
  return res.status(405).end()
 }catch(e){return res.status(500).json({error:"خطأ في قاعدة البيانات"})}
}
