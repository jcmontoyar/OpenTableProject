const maxParty = 10
let partySize = []

for(let i = 1; i <=maxParty; i++){
    const label = i===1 ? ("1 person"): (`${i} people`)
    partySize.push({
        value: i,
        label: label
    })
}

export {partySize}