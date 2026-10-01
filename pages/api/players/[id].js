export const config = { api: { bodyParser: { sizeLimit: "3mb" } } }
import { query } from "../../../lib/db"
export default async function handler(req,res){
 try{
  const id=Number(req.query.id)
  if(req.method==="PUT"){
   const {name,shirtNumber,image}=req.body||{}
   if(image && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image))return res.status(400).json({error:"صورة غير صالحة"})
   const conflict=await query("SELECT id FROM players WHERE shirt_number=? AND is_active=1 AND id<>?",[Number(shirtNumber),id])
   if(conflict.length)return res.status(409).json({error:"رقم القميص مستخدم"})
   await query("UPDATE players SET name=?,shirt_number=?,image=?,updated_at=NOW() WHERE id=?",[name,Number(shirtNumber),image||null,id])
   return res.json({id,name,shirtNumber:Number(shirtNumber),image:image||null})
  }
  if(req.method==="DELETE"){await query("UPDATE players SET is_active=0,updated_at=NOW() WHERE id=?",[id]);return res.json({ok:true})}
  return res.status(405).end()
 }catch(e){return res.status(500).json({error:"خطأ في قاعدة البيانات"})}
}