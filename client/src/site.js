require('./common')

const d3 = require('d3')
const CSVFileDocument = require('./util/csv-file-loader')
const QueryParams = require('./util/queryParamProcessor')
const axios = require('axios')

const DomainName = function (url) {
    var search = /.+:\/\/([^\\/]+)/
    var match = search.exec(decodeURIComponent(url.replace(/\+/g, ' ')))
    return match == null ? null : match[1]
}

const GoogleSheetInput = function () {
    const self = {

        build: function () {

            var queryString = window.location.href.match(/sheetId(.*)/)
            var queryParams = queryString ? QueryParams(queryString[0]) : {}

            console.log(queryParams)
            if (queryParams.sheetId) {
                axios.get('/radar', {
                    params: {
                        sheetId: queryParams.sheetId
                    }
                }).then(res => {
                    CSVFileDocument("", res.data).build()
                })
            } else {
                const content = d3.select('body')
                    .append('div')
                    .attr('class', 'input-sheet');
                setDocumentTitle()

                self.plotFileUpload(content)
            }
        },

        plotFileUpload: function (content) {
            const fileUploadForm = content.append('div')
                .attr('class', 'input-sheet__form');

            const fileUpload = fileUploadForm.append('input')
                .attr('class', 'input-sheet__field')
                .attr('type', 'file')
                .attr('name', 'sheetCsv')
                .attr('required', '');

            fileUpload.on('change', function () {
                self.loadFile(content)
            })
        },

        loadFile: function () {
            let selector = document.querySelector('input[type=file]');
            const file = selector.files[0];

            const reader = new FileReader();

            if (!file)
                return;
            reader.addEventListener("load",
                function () {
                    var form = new FormData();
                    form.append('myFile', reader.result);
                    axios.post('/radar', form).then(res => {
                        window.location.replace(window.location.origin + '/?sheetId='+res.data.id)
                    });
                }
                , false);
            reader.readAsText(file);
        }
    }

    return self
}

function setDocumentTitle() {
    document.title = 'Technology Radar'
}

GoogleSheetInput().build()
