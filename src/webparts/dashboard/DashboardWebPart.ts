import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'DashboardWebPartStrings';
import Dashboard from './components/Dashboard';
import { IDashboardProps } from './components/IDashboardProps';

import { SPComponentLoader } from '@microsoft/sp-loader'
SPComponentLoader.loadCss("https://zrwv0.sharepoint.com/sites/ICC/CDN/Forms/AllItems.aspx?id=%2Fsites%2FICC%2FCDN%2FICC%2FDashboard%2Ecss&viewid=2aecc680%2D8f37%2D4ff2%2Db3f8%2D87d74cd335f9&parent=%2Fsites%2FICC%2FCDN%2FICC");
SPComponentLoader.loadCss("https://zrwv0.sharepoint.com/sites/ICC/CDN/Forms/AllItems.aspx?id=%2Fsites%2FICC%2FCDN%2FICC%2FApprovalForm%2Ecss&viewid=2aecc680%2D8f37%2D4ff2%2Db3f8%2D87d74cd335f9&parent=%2Fsites%2FICC%2FCDN%2FICC");

export interface IDashboardWebPartProps {
  description: any;
  RequestUrl: any;
  newRequestUrl: any;
  editRequestUrl: any;
  documentSetLibTitle?: any;
  surveyListTitle?: any;
  relativeUrl?: any;
  tab1Title?: any;
  tab2Title?: any;
  tab3Title?: any;
  tab4Title?:any
  configList?: any;
  stylesUrl?: any;
  export?: any;
  ArchiveUrl?: any;
  VIPAccessUrl?: any;
  itemCount?:number;
  Disbledtab?:any;
}

export default class DashboardWebPart extends BaseClientSideWebPart<IDashboardWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: any = '';

  public render(): void {
    const element: React.ReactElement<IDashboardProps> = React.createElement(
      Dashboard,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
         spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        RequestUrl: this.properties.RequestUrl,
        newRequestUrl: this.properties.newRequestUrl,
        editRequestUrl: this.properties.editRequestUrl,
        documentSetLibTitle: this.properties.documentSetLibTitle,
        surveyListTitle: this.properties.surveyListTitle,
        relativeUrl: this.context.pageContext.web.serverRelativeUrl,
        tab1Title: this.properties.tab1Title,
        tab2Title: this.properties.tab2Title,
        tab3Title: this.properties.tab3Title,
        tab4Title:this.properties.tab4Title,
        configList: this.properties.configList,
        stylesUrl: this.properties.stylesUrl,
        export: this.properties.export,
        ArchiveUrl: this.properties.ArchiveUrl,
        VIPAccessUrl: this.properties.VIPAccessUrl,
        context: this.context,
        itemCount:this.properties.itemCount,
        Disbledtab:this.properties.Disbledtab,
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



  private _getEnvironmentMessage(): Promise<any> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: any = '';
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
              groupName: "Title Properties",
              groupFields: [
                PropertyPaneTextField("tab1Title", {
                  label: "Tab1 Title",
                  //onGetErrorMessage: this.validateUrl.bind(this)
                }),
                PropertyPaneTextField("tab2Title", {
                  label: "Tab2 Title",
                  // onGetErrorMessage: this.validateUrl.bind(this)
                }),
                PropertyPaneTextField("tab3Title", {
                  label: "Tab3 Title",
                  // onGetErrorMessage: this.validateUrl.bind(this)
                }),
                PropertyPaneTextField("tab4Title", {
                  label: "Tab4 Title",
                  // onGetErrorMessage: this.validateUrl.bind(this)
                }),
              ],
            },
            {
              groupName: "Properties",
              groupFields: [
                PropertyPaneTextField("RequestUrl", {
                  label: "New Request Form Url",
                  onGetErrorMessage: this.validateUrl.bind(this),
                }),
                PropertyPaneTextField("newRequestUrl", {
                  label: "View Request Form Url",
                  onGetErrorMessage: this.validateUrl.bind(this),
                }),
                PropertyPaneTextField("editRequestUrl", {
                  label: "Edit Request Form Url",
                  onGetErrorMessage: this.validateUrl.bind(this),
                }),
                PropertyPaneTextField("documentSetLibTitle", {
                  label: "DocumentSet Library Title",
                  // onGetErrorMessage: this.validateUrl.bind(this)
                }),
                PropertyPaneTextField("surveyListTitle", {
                  label: "Survey List Title",
                  //onGetErrorMessage: this.validateUrl.bind(this)
                }),
                PropertyPaneTextField("configList", {
                  label: "Configuration List Title",
                }),
                PropertyPaneTextField("stylesUrl", {
                  label: "Stylesheet Folder Url",
                }),
                PropertyPaneTextField("description", {
                  label: "Description",
                }),
                PropertyPaneTextField("Disbledtab", {
                  label: "Disabled Tabs",
                }),
                PropertyPaneTextField("export", {
                  label: "Export Url",
                }),
                PropertyPaneTextField("ArchiveUrl", {
                  label: "Archive Url",
                }),
                PropertyPaneTextField("VIPAccessUrl", {
                  label: "VIP Access Url",
                }),
                PropertyPaneTextField("itemCount", {
                  label: "Item Count",
                }),
              ],
            },
          ],
        }
      ]
    };
  }
}
