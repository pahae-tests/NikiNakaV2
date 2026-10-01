import { POSITIONS } from "./rating"

export function validateMatch(body) {
  const errors = []
  const teamScore = Number(body.teamScore)
  const opponentScore = Number(body.opponentScore)
  const players = Array.isArray(body.players) ? body.players : []
  const goals = Array.isArray(body.goals) ? body.goals : []

  if (!body.opponentName || !String(body.opponentName).trim()) errors.push("اسم الفريق المنافس مطلوب")
  if (!Number.isInteger(teamScore) || teamScore < 0) errors.push("نتيجة فريقك غير صحيحة")
  if (!Number.isInteger(opponentScore) || opponentScore < 0) errors.push("نتيجة الخصم غير صحيحة")
  if (players.length !== 6) errors.push("يجب اختيار ستة لاعبين بالضبط")
  if (new Set(players.map(p => String(p.playerId))).size !== players.length) errors.push("لا يمكن تكرار اللاعب")
  if (players.some(p => !POSITIONS.includes(p.position))) errors.push("مركز لاعب غير صالح")
  if (goals.length !== teamScore) errors.push("عدد الأهداف لا يطابق النتيجة")
  if (goals.some(g => String(g.scorerId) === String(g.assistId) && g.assistId)) errors.push("لا يمكن للاعب تمرير هدف لنفسه")
  if (goals.some(g => !players.some(p => String(p.playerId) === String(g.scorerId)))) errors.push("مسجل هدف غير مشارك في المباراة")
  if (goals.some(g => g.assistId && !players.some(p => String(p.playerId) === String(g.assistId)))) errors.push("صانع هدف غير مشارك في المباراة")
  return errors
}