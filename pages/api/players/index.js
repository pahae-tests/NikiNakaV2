export const config = { api: { bodyParser: { sizeLimit: "20mb" } } }
import { query } from "../../../lib/db"
export default async function handler(req,res){
 try{
  if(req.method==="GET"){
   const rows=await query(`SELECT p.*,COUNT(DISTINCT mp.match_id) matches,COALESCE(SUM(g.scorer_id=p.id),0) goals,COALESCE(SUM(g.assist_id=p.id),0) assists,ROUND(AVG(mp.rating),1) avgRating FROM players p LEFT JOIN match_players mp ON mp.player_id=p.id LEFT JOIN goals g ON g.scorer_id=p.id OR g.assist_id=p.id WHERE p.is_active=1 GROUP BY p.id ORDER BY p.shirt_number`)
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