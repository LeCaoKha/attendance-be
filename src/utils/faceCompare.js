function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

function matchFace(inputEmbedding, children) {
  let best = null;
  let min = Infinity;

  for (const child of children) {
    const d = distance(inputEmbedding, child.faceEmbedding);
    if (d < min) {
      min = d;
      best = child;
    }
  }

  return { best, min };
}

module.exports = { matchFace };
