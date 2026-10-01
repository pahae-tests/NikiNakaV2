export const POSITIONS = ["RW", "LW", "ST", "CM", "LB", "RB", "CB", "GK"]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function calculateRatings(match) {
  const players = match.players || []
  const goals = match.goals || []
  const teamScore = Number(match.teamScore)
  const opponentScore = Number(match.opponentScore)
  const result = teamScore > opponentScore ? 1 : teamScore === opponentScore ? 0 : -1

  const orderedGoals = [...goals].sort((a, b) => Number(a.order) - Number(b.order))
  const contextual = orderedGoals.map((goal, index) => {
    let beforeFor = 0
    let beforeAgainst = 0
    for (let i = 0; i < index; i++) {
      beforeFor += 1
    }
    const beforeDiff = beforeFor - beforeAgainst
    const afterDiff = beforeDiff + 1
    let importance = 0.55
    if (beforeDiff < 0 && afterDiff === 0) importance = 1
    else if (beforeDiff < 0 && afterDiff > 0) importance = 1.12
    else if (beforeDiff === 0 && afterDiff > 0) importance = 0.92
    else if (beforeDiff > 0) importance = 0.42 + 0.22 / (1 + beforeDiff)
    return { ...goal, importance: clamp(importance, 0.35, 1.15) }
  })

  return players.map((player) => {
    const playerGoals = contextual.filter(g => String(g.scorerId) === String(player.playerId))
    const assists = contextual.filter(g => String(g.assistId) === String(player.playerId))
    const goalImpact = playerGoals.reduce((sum, g) => sum + g.importance, 0)
    const assistImpact = assists.reduce((sum, g) => sum + g.importance * 0.55, 0)
    const goalRate = teamScore > 0 ? goalImpact / Math.max(1, teamScore) : 0
    const assistRate = teamScore > 0 ? assistImpact / Math.max(1, teamScore) : 0
    const collective = result === 1 ? 0.75 : result === 0 ? 0.25 : -0.35
    const role = player.position === "ST" || player.position === "RW" || player.position === "LW"
      ? goalRate * 1.15 + assistRate
      : player.position === "GK" || player.position === "CB" || player.position === "LB" || player.position === "RB"
        ? goalRate * 0.75 + assistRate * 0.95
        : goalRate + assistRate
    const marginContext = clamp((teamScore - opponentScore) / 10, -0.35, 0.35)
    const raw = 6.15 + role * 3.0 + collective + marginContext + (players.length ? 0.15 : 0)
    return {
      ...player,
      rating: Number(clamp(raw, 5, 10).toFixed(1))
    }
  })
}

export function getMvp(players) {
  return [...players].sort((a, b) =>
    b.rating - a.rating ||
    (b.goals || 0) - (a.goals || 0) ||
    (b.assists || 0) - (a.assists || 0) ||
    String(a.name).localeCompare(String(b.name))
  )[0] || null
}