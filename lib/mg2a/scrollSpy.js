export function activeSectionId(
  positions,
  threshold = 108,
  bottomReached = false,
) {
  if (!positions.length) return null;
  if (bottomReached) return positions.at(-1).id;
  let active = positions[0].id;
  for (const section of positions) {
    if (section.top <= threshold) active = section.id;
    else break;
  }
  return active;
}
