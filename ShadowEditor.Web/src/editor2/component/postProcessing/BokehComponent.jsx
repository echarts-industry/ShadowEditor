import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 背景虚化特效组件
 * @author tengge / https://github.com/tengge1
 */
class BokehComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            enabled: false,
            focus: 50, // 距离相机距离，哪里最清晰
            aperture: 2.8, // *1e-4，光圈越小越清楚
            maxBlur: 1, // 最大模糊程度，越大越模糊
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, focus, aperture, maxBlur } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_BOKEH_EFFECT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_ENABLE_STATE} name={'enabled'} value={enabled} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_FOCUS} name={'focus'} value={focus} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_APERTURE} name={'aperture'} value={aperture} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_MAX_BLUR} name={'maxBlur'} value={maxBlur} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BokehComponent`, this.handleUpdate);
        app.on(`objectChanged.BokehComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.scene) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let scene = this.selected;
        let postProcessing = scene.userData.postProcessing || {};

        let state = {
            show: true,
            enabled: postProcessing.bokeh ? postProcessing.bokeh.enabled : false,
            focus: postProcessing.bokeh ? postProcessing.bokeh.focus : this.state.focus,
            aperture: postProcessing.bokeh ? postProcessing.bokeh.aperture : this.state.aperture,
            maxBlur: postProcessing.bokeh ? postProcessing.bokeh.maxBlur : this.state.maxBlur,
        };

        this.setState(state);
    }

    handleChange(value, name) {
        this.setState({
            [name]: value,
        });

        if (value === null) {
            return;
        }

        const { enabled, focus, aperture, maxBlur } = Object.assign({}, this.state, {
            [name]: value,
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            bokeh: {
                enabled,
                focus,
                aperture,
                maxBlur,
            },
        });

        app.call(`postProcessingChanged`, this);
    }
}

export default BokehComponent;