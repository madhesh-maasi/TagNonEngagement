import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SubmitSplitReviewsWebPartStrings';
import SubmitSplitReviews from './components/SubmitSplitReviews';
import { ISubmitSplitReviewsProps } from './components/ISubmitSplitReviewsProps';

export interface ISubmitSplitReviewsWebPartProps {
  description: string;
}

export default class SubmitSplitReviewsWebPart extends BaseClientSideWebPart<ISubmitSplitReviewsWebPartProps> {

  public render(): void {
    const queryParams = new URLSearchParams(window.location.search);
    const itemID = queryParams.get('ItemID');
    
    const element: React.ReactElement<ISubmitSplitReviewsProps> = React.createElement(
      SubmitSplitReviews,
      {
        description: this.properties.description,
        context:this.context,
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
