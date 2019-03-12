const featured = {},
  hidden = {}

export async function getFeatured(net) {
  if (net === 'localhost') return [1]
  let netId
  if (net === 'mainnet') netId = 1
  if (net === 'rinkeby') netId = 4
  if (!netId) return []
  if (featured[netId]) return featured[netId]

  return await new Promise(resolve => {
    fetch(
      `https://cdn.jsdelivr.net/gh/originprotocol/origin@hidefeature_list/featurelist_${netId}.txt`
    )
      .then(response => response.text())
      .then(response => {
        const ids = response
          .split(',')
          .map(i => Number(i.split('-')[2].replace(/[^0-9]/g, '')))
        featured[netId] = ids
        resolve(ids)
      })
      .catch(() => resolve([]))
  })
}

export async function getHidden(net) {
  let netId
  if (net === 'mainnet') netId = 1
  if (net === 'rinkeby') netId = 4
  if (!netId) return []
  if (hidden[netId]) return hidden[netId]

  return await new Promise(resolve => {
    fetch(
      `https://cdn.jsdelivr.net/gh/originprotocol/origin@hidefeature_list/hidelist_${netId}.txt`
    )
      .then(response => response.text())
      .then(response => {
        const ids = response
          .split(',')
          .map(i => Number(i.split('-')[2].replace(/[^0-9]/g, '')))
        hidden[netId] = ids
        resolve(ids)
      })
      .catch(() => resolve([]))
  })
}
