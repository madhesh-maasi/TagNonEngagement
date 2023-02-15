import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'AnmNonEngagementWebPartStrings';
import AnmNonEngagement from './components/AnmNonEngagement';
import { IAnmNonEngagementProps } from './components/IAnmNonEngagementProps';
import { sp } from "@pnp/sp";
require('../../assets/css/common.css');
import 'bootstrap/dist/css/bootstrap.min.css';
export interface IAnmNonEngagementWebPartProps {
  description: string;
}

export default class AnmNonEngagementWebPart extends BaseClientSideWebPart<IAnmNonEngagementWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  public render(): void {
       // Getting Item ID from URL Parameter -   
       const queryParams = new URLSearchParams(window.location.search);
       const itemID = queryParams.get('ItemID');
       console.log("itemID",itemID);
    const element: React.ReactElement<IAnmNonEngagementProps> = React.createElement(
      AnmNonEngagement,
      {
        AppContext: this.context,
        itemID: itemID,
        user:""
      }
    );

    ReactDom.render(element, this.domElement);
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
