import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FileMenu from '@dhis2/d2-ui-file-menu';

import VisualizationOptionsManager from '../VisualizationOptions/VisualizationOptionsManager';
import * as fromReducers from '../reducers';
import * as fromActions from '../actions';
import './MenuBar.css';

export const MenuBar = (props, context) => {
    const onOpen = id => {
        // TODO get type somehow!
        // from props, when choosing visualization type set type in the store,
        // for now it's only chart...
        return props.onSetVisualization('chart', id);
    };

    return (
        <ul className="menu-bar">
            <li>
                <button type="button">Update</button>
            </li>
            <li>
                <FileMenu
                    d2={context.d2}
                    // TODO get type somehow!
                    // from props, when choosing visualization type set type in the store,
                    // for now it's only chart...
                    fileType="chart"
                    onOpen={onOpen}
                    onTranslate={() => console.log('translate callback')}
                    onError={() => console.log('error!')}
                />
            </li>
            <li>
                <VisualizationOptionsManager />
            </li>
            <li>Download</li>
            <li>Embed</li>
        </ul>
    );
};

MenuBar.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    visualization: fromReducers.fromVisualization.visualization,
});

export default connect(
    mapStateToProps,
    {
        onSetVisualization: fromActions.fromVisualization.tSetVisualization,
    }
)(MenuBar);