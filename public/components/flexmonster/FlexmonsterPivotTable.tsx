import React from 'react';
import {
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiTitle,
  EuiComboBox,
  EuiSpacer,
  EuiPanel,
} from '@elastic/eui';
import * as FlexmonsterReact from 'react-flexmonster';
import 'flexmonster/flexmonster.min.css';

export interface FlexmonsterPivotTableProps {
  esClient: any;
}

interface FlexmonsterPivotTableState {
  selectedOptions: Array<{ label: string }>;
  options: Array<{ label: string }>;
  isLoading: boolean;
  showPivotTable: boolean;
  report: any;
}

export class FlexmonsterPivotTable extends React.Component<
  FlexmonsterPivotTableProps,
  FlexmonsterPivotTableState
> {
  constructor(props: FlexmonsterPivotTableProps) {
    super(props);
    this.state = {
      selectedOptions: [],
      options: [],
      isLoading: true,
      showPivotTable: false,
      report: null,
    };
  }

  componentDidMount() {
    this.loadIndices();
  }

  loadIndices = () => {
    this.props.esClient.get('/_cat/indices?format=json').then((response: any) => {
      const indices = response.map((item: any) => ({
        label: item.index,
      })).filter((item: any) => !item.label.startsWith('.'));
      
      this.setState({
        options: indices,
        isLoading: false,
      });
    });
  };

  onChange = (selectedOptions: Array<{ label: string }>) => {
    const report = {
      dataSource: {
        dataSourceType: 'elasticsearch',
        connection: this.props.esClient,
        index: selectedOptions[0].label,
      },
    };
    this.setState({ showPivotTable: true, selectedOptions, report });
  };

  render() {
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiTitle size="m">
              <h1>Flexmonster Pivot Table</h1>
            </EuiTitle>
          </EuiPageHeader>
          <EuiSpacer size="m" />
          <EuiComboBox
            placeholder="Select an index"
            options={this.state.options}
            selectedOptions={this.state.selectedOptions}
            onChange={this.onChange}
            isLoading={this.state.isLoading}
            singleSelection={{ asPlainText: true }}
          />
          <EuiSpacer size="m" />
          {this.state.showPivotTable && (
            <EuiPanel>
              <FlexmonsterReact.Pivot report={this.state.report} width="100%" />
            </EuiPanel>
          )}
        </EuiPageBody>
      </EuiPage>
    );
  }
}
