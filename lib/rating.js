export const POSITIONS = ["RW", "LW", "ST", "CM", "LB", "RB", "CB", "GK"]

const DEFENSIVE_POSITIONS = ["GK", "CB", "LB", "RB"]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function goalImportance(beforeDiff) {
  if (beforeDiff < 0) return 1.15
  if (beforeDiff === 0) return 1
  return 0.75 + 0.2 / (1 + beforeDiff)
}

export function calculateRatings(match) {
  const players = match.players || []
  const goals = match.goals || []
  const teamScore = Number(match.teamScore)
  const opponentScore = Number(match.opponentScore)
  const result = teamScore > opponentScore ? 1 : teamScore === opponentScore ? 0 : -1

  const orderedGoals = [...goals].sort((a, b) => Number(a.order) - Number(b.order))
  const contextual = orderedGoals.map((goal, index) => ({
    ...goal,
    importance: goalImportance(index)
  }))

  const collective = result === 1 ? 0.75 : result === 0 ? 0.25 : -0.35
  const marginContext = clamp((teamScore - opponentScore) / 10, -0.35, 0.35)

  return players.map((player) => {
    const isDefensive = DEFENSIVE_POSITIONS.includes(player.position)
    const isMidfielder = player.position === "CM"
    const goalWeight = isDefensive ? 1.1 : 1
    const assistWeight = isDefensive || isMidfielder ? 1.1 : 1

    const goalPoints = contextual
      .filter(g => String(g.scorerId) === String(player.playerId))
      .reduce((sum, g) => sum + 0.8 * g.importance * goalWeight, 0)
    const assistPoints = contextual
      .filter(g => g.assistId && String(g.assistId) === String(player.playerId))
      .reduce((sum, g) => sum + 0.45 * g.importance * assistWeight, 0)

    let defensive = 0
    if (isDefensive) {
      defensive = opponentScore === 0 ? 0.4 : -Math.min(0.4, opponentScore * 0.08)
    } else if (isMidfielder && opponentScore === 0) {
      defensive = 0.15
    }

    let raw = 6.3 + collective + marginContext + goalPoints + assistPoints + defensive
    if (raw > 9.5) raw = 9.5 + (raw - 9.5) * 0.5

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
