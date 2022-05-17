import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import RoutesPath from '../constants/routes-path';

import HomePage from '../pages/Home';
import RouterScheduler from '../pages/RouterScheduler';
import BuilderScheduler from '../pages/BuilderScheduler';
import Config from '../pages/Config';

import Initialize from './Initialize';
import Analytics from './Analytics';

const Routes = () => (
    <BrowserRouter>
        <Initialize />
        <Analytics>
            <Switch>
                <Route exact path={RoutesPath.HOME.PATH} component={HomePage} />
                <Route
                    exact
                    path={RoutesPath.ROUTER_SCHEDULER.PATH}
                    component={RouterScheduler}
                />
                <Route
                    exact
                    path={RoutesPath.BUILDER_SCHEDULER.PATH}
                    component={BuilderScheduler}
                />
                <Route
                    exact
                    path={RoutesPath.CONFIGURATIONS.PATH}
                    component={Config}
                />
            </Switch>
        </Analytics>
    </BrowserRouter>
);

export default Routes;
