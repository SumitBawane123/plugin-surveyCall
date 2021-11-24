import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'SurveyCallPlugin';

export default class SurveyCallPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);


    flex.Actions.addListener('beforeHangupCall', async(payload, abortFunction) => {
      console.log("payload//////////////////////////////////",payload);
      const body = { 
        CallSid: payload.task.attributes.call_sid
      }
      const httpOpts = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }
     await fetch('https://tumbleweed-penguin-7678.twil.io/surveyCall', httpOpts);

      flec.Actions.invokeAction("TransferTask", {
        targetSid: 'WK77adad3e5d290da6cf8c3144f3c12aad',
        options: { mode: "COLD"}
      });

      abortFunction();
    });
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
