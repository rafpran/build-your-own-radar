const d3 = require('d3')
const Radar = require('../models/radar')
const Quadrant = require('../models/quadrant')
const Ring = require('../models/ring')
const Blip = require('../models/blip')
const GraphingRadar = require('../graphing/radar')
const ExceptionMessages = require('./exceptionMessages')
const MalformedDataError = require('../exceptions/malformedDataError')
const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each')
}


const plotRadar = function (title, blips, currentRadarName) {
    document.title = title
    d3.selectAll('.loading').remove()

    const rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
    const ringMap = {};
    const maxRings = 4;

    _.each(rings, function (ringName, i) {
        if (i === maxRings) {
            throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS)
        }
        ringMap[ringName] = new Ring(ringName, i)
    })

    const quadrants = {};
    _.each(blips, function (blip) {
        if (!quadrants[blip.quadrant]) {
            quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant))
        }
        quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
    })

    const radar = new Radar();
    _.each(quadrants, function (quadrant) {
        radar.addQuadrant(quadrant)
    })

    if (currentRadarName !== undefined || true) {
        radar.setCurrentSheet(currentRadarName)
    }

    const size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;

    new GraphingRadar(size, radar).init().plot()
}


module.exports = plotRadar