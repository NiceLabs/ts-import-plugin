import React from 'react';
import Alert from "antd/lib/alert";
import { default as S } from "antd/lib/affix";
import AutoComplete from "antd/lib/auto_complete";
import { Drawer } from 'material-ui';
import { OtherComponent } from './other';
import { forEach } from 'lodash';
export class Test extends React.PureComponent<void, void> {
    render() {
        return (<OtherComponent>
        <Alert message='hello world'/>
      </OtherComponent>);
    }
}
