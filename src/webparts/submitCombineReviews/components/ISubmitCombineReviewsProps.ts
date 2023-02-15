import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubmitCombineReviewsProps {
  description: string;
  AppContext: WebPartContext;
  ItemID: number;
}
