import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'RequestFormWebPartStrings';
import RequestForm from './components/RequestForm';
import { IRequestFormProps } from './components/IRequestFormProps';

 import { SPComponentLoader } from '@microsoft/sp-loader'
 SPComponentLoader.loadCss("https://zrwv0.sharepoint.com/sites/ICC/CDN/Forms/AllItems.aspx?id=%2Fsites%2FICC%2FCDN%2FICC%2FRequestFormStyles%2Ecss&viewid=2aecc680%2D8f37%2D4ff2%2Db3f8%2D87d74cd335f9&parent=%2Fsites%2FICC%2FCDN%2FICC");

export interface IRequestFormWebPartProps {
  description: string;
  siteUrl: any;
  context: any;
  redirectionUrl: string;
  configList?: string;
  stylesUrl?: string;
}

export default class RequestFormWebPart extends BaseClientSideWebPart<IRequestFormWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IRequestFormProps> = React.createElement(
      RequestForm,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        siteUrl: this.context.pageContext?.web?.absoluteUrl,
        context: this.context,
        redirectionUrl: this.properties?.redirectionUrl,
        stylesUrl: this.properties?.stylesUrl,
        relativeUrl: this.context?.pageContext?.web?.serverRelativeUrl,
        configList: this.properties.configList,
      }
    );

    ReactDom.render(element, this.domElement);
  }
  private validateUrl(value: string): string {
    if (value === null || value.trim().length === 0) {
      return "Provide url";
    } else if (value.trim().indexOf("http") != 0) {
      return "Provide valid Url";
    }

    return "";
  }
  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField("redirectionUrl", {
                  label: "Redirection Url",
                  onGetErrorMessage: this.validateUrl.bind(this),
                }),
                PropertyPaneTextField("configList", {
                  label: "Configuration List Title",
                }),
                PropertyPaneTextField("stylesUrl", {
                  label: "Stylesheets path",
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
