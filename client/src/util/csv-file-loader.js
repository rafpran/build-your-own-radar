const InputSanitizer = require('./inputSanitizer')
const ContentValidator = require('./contentValidator')
const plotRadar = require('./radar-factory')
const d3 = require('d3')
const MalformedDataError = require('../exceptions/malformedDataError')
const SheetNotFoundError = require('../exceptions/sheetNotFoundError')

const CSVFileDocument = function (title, file) {
    const createBlips = function (file, data) {
        try {

            const columnNames = data.columns;
            const contentValidator = new ContentValidator(columnNames);
            contentValidator.verifyContent()
            contentValidator.verifyHeaders()
            const blips = _.map(data, new InputSanitizer().sanitize);
            plotRadar(title, blips, 'CSV File')
        } catch (exception) {
            self.plotErrorMessage(exception)

        }
    };
    const self = {};

    self.build = function () {
        const data = d3.csvParse(file);
        createBlips(file, data);
    }

    self.plotErrorMessage = function (exception) {
        const content = d3.select('body')
            .append('div')
            .attr('class', 'input-sheet');

        d3.selectAll('.loading').remove()
        let message = "";
        if (exception instanceof MalformedDataError) {
            message = exception.message
        } else if (exception instanceof SheetNotFoundError) {
            message = exception.message
        } else {
            console.error(exception)
        }

        const container = content.append('div').attr('class', 'error-container')
        const errorContainer = container.append('div')
            .attr('class', 'error-container__message');
        errorContainer.append('div').append('p')
            .html(message)

        let homePageURL = window.location.protocol + '//' + window.location.hostname;
        homePageURL += (window.location.port === '' ? '' : ':' + window.location.port)
        const homePage = '<a href=' + homePageURL + '>GO BACK</a>';
        errorContainer.append('div').append('p').html(homePage)
    }

    return self
}

module.exports = CSVFileDocument