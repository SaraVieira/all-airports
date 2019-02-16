const osmosis = require('osmosis')
var fs = require('fs')

function genCharArray(charA, charZ) {
  var a = [],
    i = charA.charCodeAt(0),
    j = charZ.charCodeAt(0)
  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i))
  }
  return a
}
const letters = genCharArray('a', 'z')
const arr = []

const start = async () => {
  const all = letters.map(async letter => {
    return await osmosis
      .get(
        `https://en.wikipedia.org/wiki/List_of_airports_by_IATA_code:_${letter.toUpperCase()}`
      )
      .find('.wikitable tbody tr:not(.sortbottom)')
      .set({
        IATA: 'td:first-child',
        ICAO: 'td:nth-child(2)',
        name: 'td:nth-child(3)',
        city: 'td:nth-child(4)',
        link: 'td:nth-child(3) a@href'
      })
      .data(data => arr.push(data))
      .log(console.log)
      .error(console.log)
      .debug(console.log)
      .done(() => arr)
  })

  await Promise.all(all)
  return await fs.writeFile(
    'airports.json',
    JSON.stringify(arr),
    'utf8',
    () => {}
  )
}

start()
