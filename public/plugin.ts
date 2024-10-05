import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { i18n } from '@kbn/i18n';
import { PLUGIN_NAME } from '../common';
import { FlexmonsterPivotTable } from './components/FlexmonsterPivotTable';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

export class FlexmonsterPivotPlugin implements Plugin {
  public setup(core: CoreSetup) {
    core.application.register({
      id: 'flexmonsterPivot',
      title: i18n.translate('flexmonsterPivot.pluginTitle', {
        defaultMessage: 'Flexmonster Pivot',
      }),
      mount: async (params: AppMountParameters) => {
        const [coreStart] = await core.getStartServices();
        const { element } = params;

        render(<FlexmonsterPivotTable esClient={coreStart.http} />, element);

        return () => unmountComponentAtNode(element);
      },
    });
  }

  public start(core: CoreStart) {}

  public stop() {}
}

