'use babel';

import pathUtils from '../utils/path';

export default class TaskManager {
    constructor(filePattern = '', executeFn, callback) {
        this.filePattern = filePattern;
        this.files = this.getFiles();
        this.callback = callback;

        this.notification = atom.notifications.addInfo(`Generating JSON Files`, {
            detail: 'WORKING HERE!',
            dismissable: false,
        });
        this.progress = document.createElement('progress');
        this.progress.max = this.files.length;
        this.progress.style.width = '100%';

        try {
            const notificationView = atom.views.getView(this.notification)
            const notificationContent = notificationView.querySelector('.detail-content')
            if (notificationContent) {
                notificationContent.appendChild(this.progress)
            }

            this.files.map(file => {
                executeFn(file).then(this.onTaskComplete.bind(this));
            });
        } catch (e) {}

    }

    onTaskComplete(result) {
        if (++this.progress.value == this.files.length) {
            this.callback(true, null);
        }
    }

    getFiles() {
        const f = atom.project.getDirectories().map(directory => {
            const files = directory.getEntriesSync().filter(entry => entry.isFile()).filter(entry => pathUtils.getFileExtension(entry.path) == '.template.json');

            return files;
        }).reduce((acc, fArr) => acc.concat(fArr), []);

        return f;
    }
}
