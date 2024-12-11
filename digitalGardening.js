var digitalGardening = function() {
    var seed = "e3892214c0011ddb8bd133f3dbf376c6"
    var imageDigits = 1000
    var startingEnergy = 1024

    var powder = calculatePowder(seed)
    var images = calculateImages(seed, imageDigits)
    var energyDrop = calculateEnergyDrop(images.root, startingEnergy)

    return energyDrop
}

var calculatePowder = function(seed) {
    var powder = 0

    for (var i = 0; i < seed.length / 2; i++) {
        var left = Number("0x"+seed[i])
        var right = Number("0x"+seed[seed.length - (i + 1)])
        currentPowder = ((i + 1) * (left + right))
        powder+=currentPowder
    }

    return powder
};

var calculateImages = function(seed, numDigits) {
    var images = {
        root: parseInt(seed.slice(0,5), 16),
        stem: parseInt(seed.slice(5,10), 16),
        leaves: parseInt(seed.slice(10,15), 16)
    }

    for (const image in images) {
        digits = ""
        value = images[image]
        for (var i = 0; i < numDigits; i++) {
            value = (value * 421 + 37) % 3872873
            digits+=(value % 16).toString(16)
        }
        images[image] = digits
    }

    return images
}

var calculateEnergyDrop = function(root, startEnergy) {
    var roots = {
        left: root.slice(0,200),
        right: root.slice(200,400),
        forward: root.slice(400,600),
        backward: root.slice(600,800),
        down: root.slice(800)
    }

    var totalEnergyDrop = 0

    for (const r in roots) {
        totalEnergyDrop = totalEnergyDrop + growRoots(roots[r], startEnergy, 1)
    }

    return totalEnergyDrop
}

var growRoots = function(root, energy, iteration) {
    var energyUnits = 0

    for (var i = iteration; i * 5 < root.length; i++) {
        var index = (i - 1) * 5
        var binary = parseInt(root.slice(index, index + 5), 16).toString(2).padStart(20, '0')
        var distance = binary.slice(0,7)
        var energyDrop = 5 + parseInt(binary.slice(7,10),2)
        var direction = binary.slice(10)

        if (energyDrop < energy) {
            energyUnits+=(i * energyDrop)
            energy-=energyDrop
        }
        else {
            energyUnits+=(i * energy)
            break
        }

        if (energy >= 4) {
            var energyGiven = Math.floor(energy / 4)
            energy-=energyGiven
            energyUnits = energyUnits + growRoots(root, energyGiven, i + 1)
        }
    }

    return energyUnits
}
