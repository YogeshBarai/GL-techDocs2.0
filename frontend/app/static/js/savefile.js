function saveFile() {
    console.log('---savingfile-------', documentObject);
    if (documentObject.DocId != 0) {
        showSyncStatus('arrow-repeat', 'Updating File ...', true);
        // UPDATE FILE 
        //http://techdocs-api.previewbox.in/api/filemodify

        axios.post(getApiUrl('filemodify'), documentObject).then(function (response) {
            documentObject.DocId = response.data.DocId;
            showSyncStatus('check', 'Synced', false, false);
        }).catch(function (error) {
            showSyncStatus('bug-fill', 'Error While Updating File', false, true);
        });
    }
}