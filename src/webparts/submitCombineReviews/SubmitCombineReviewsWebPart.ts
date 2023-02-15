import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SubmitCombineReviewsWebPartStrings';
import SubmitCombineReviews from './components/SubmitCombineReviews';
import { ISubmitCombineReviewsProps } from './components/ISubmitCombineReviewsProps';

export interface ISubmitCombineReviewsWebPartProps {
  description: string;
}

export default class SubmitCombineReviewsWebPart extends BaseClientSideWebPart<ISubmitCombineReviewsWebPartProps> {

  public render(): void {

    const queryParams = new URLSearchParams(window.location.search);
     const itemID = queryParams.get('ItemID');

    const element: React.ReactElement<ISubmitCombineReviewsProps> = React.createElement(
      SubmitCombineReviews,
      {
        description: this.properties.description,
        AppContext: this.context,
        ItemID: itemID
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
