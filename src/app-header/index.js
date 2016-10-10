import React from 'react';
import { render } from 'react-dom';
import { init } from 'd2/lib/d2';
import HeaderBar from './HeaderBar';
import withStateFrom from '../component-helpers/withStateFrom';
import headerBarStore$ from './headerBar.store';

function getBaseUrl(predefLocation) {
    if (predefLocation) {
        return predefLocation;
    }

    return '../api';
}

export function initHeaderBar(domElement, apiLocation, config = { schemas: [] }) {
    const baseUrl = getBaseUrl(apiLocation);
    const { noLoadingIndicator, ...d2ConfigKeys } = config;
    const d2Config = {
        ...d2ConfigKeys,
        baseUrl,
    };

    // Mock d2 for offline header-bar
    let d2Context = {
        currentUser: { userSettings: {} },
        i18n: { getTranslation(v) { return v; } },
    };

    const HeaderBarWithState = withStateFrom(headerBarStore$, HeaderBar);

    const HeaderBarWithContext = React.createClass({
        childContextTypes: {
            d2: React.PropTypes.object,
        },

        getChildContext() {
            return {
                d2: d2Context,
            };
        },

        render() {
            return (
                <HeaderBarWithState noLoadingIndicator={noLoadingIndicator} />
            );
        },
    });

    init(d2Config)
        .then((d2) => {
            d2Context = d2;

            render(<HeaderBarWithContext />, domElement);
        }, () => {
            render(<HeaderBarWithContext />, domElement);
        });
}

export default initHeaderBar;
