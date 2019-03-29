function doGet(e) {
    var userInputText = e.parameter.text;
    var callback = e.parameter.callback;
    var response = {output: []};
    var msg = response.output;
    msg.push({
        type: 'text',
        value: '「' + userInputText + '」ですね！'
    });
    var responseText = '';
    if (callback) {
        //JSONP
        responseText = callback + '(' + JSON.stringify(response) + ')';
        return send(ContentService.MimeType.JAVASCRIPT, responseText);
    } else {
        //JSON
        return sendJson(response);
    }
}
function send(mimeType, responseText) {
    var textOut = ContentService.createTextOutput();
    textOut.setMimeType(mimeType);
    textOut.setContent(responseText);
    return textOut;
}
function sendJson(response) {
    var textOut = ContentService.createTextOutput();
    var responseText = JSON.stringify(response);
    textOut.setMimeType(ContentService.MimeType.JSON);
    textOut.setContent(responseText);
    return textOut;
}