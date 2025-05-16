import * as React from 'react';
// import styles from './Dashboard.module.scss';
import type { IDashboardProps } from './IDashboardProps';
import DashboardProfile from './DashboardProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
export default class Dashboard extends React.Component<IDashboardProps> {
  public render(): React.ReactElement<IDashboardProps> {

    return (
      <div>
        <DashboardProfile props={this.props}/>
      </div>
    );
  }
}
