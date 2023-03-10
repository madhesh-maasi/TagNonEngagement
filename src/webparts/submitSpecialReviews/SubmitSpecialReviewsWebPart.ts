import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SubmitSpecialReviewsWebPartStrings';
import SubmitSpecialReviews from './components/SubmitSpecialReviews';
import { ISubmitSpecialReviewsProps } from './components/ISubmitSpecialReviewsProps';
import { sp } from '@pnp/sp';

export interface ISubmitSpecialReviewsWebPartProps {
  description: string;
}

export default class SubmitSpecialReviewsWebPart extends BaseClientSideWebPart<ISubmitSpecialReviewsWebPartProps> {


  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }
  public render(): void {

    const queryParams = new URLSearchParams(window.location.search);
    const itemID = queryParams.get('ItemID');
    
    const element: React.ReactElement<ISubmitSpecialReviewsProps> = React.createElement(
      SubmitSpecialReviews,
      {
        description: this.properties.description,
        AppContext :this.context,
        ItemID:itemID
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
