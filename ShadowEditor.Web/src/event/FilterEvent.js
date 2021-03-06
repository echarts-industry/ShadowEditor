import BaseEvent from './BaseEvent';
import CssUtils from '../utils/CssUtils';

/**
 * 滤镜事件
 * @author tengge / https://github.com/tengge1
 */
function FilterEvent() {
    BaseEvent.call(this);
}

FilterEvent.prototype = Object.create(BaseEvent.prototype);
FilterEvent.prototype.constructor = FilterEvent;

FilterEvent.prototype.start = function () {
    app.on(`editorCleared.${this.id}`, this.onEditorCleared.bind(this));
    app.on(`optionsChanged.${this.id}`, this.onOptionsChanged.bind(this));
};

FilterEvent.prototype.stop = function () {
    app.on(`editorCleared.${this.id}`, null);
    app.on(`optionsChanged.${this.id}`, null);
};

FilterEvent.prototype.onEditorCleared = function () {
    app.editor.renderer.domElement.style.filter = '';
};

FilterEvent.prototype.onOptionsChanged = function () {
    app.editor.renderer.domElement.style.filter = CssUtils.serializeFilter(app.options);
};

export default FilterEvent;