import * as React from 'react';
import type { IRequestFormProps } from './IRequestFormProps';
import RequestFormProfile from './RequestFormProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../GlobalComponent/style.scss';
export default class RequestForm extends React.Component<IRequestFormProps> {
  public render(): React.ReactElement<IRequestFormProps> {
    this.props.context.absoluteUrl=this?.props?.context?.pageContext?.web?.absoluteUrl
    return (
      <div>
       <RequestFormProfile props={this.props}/>
      </div>
    );
  }
}
