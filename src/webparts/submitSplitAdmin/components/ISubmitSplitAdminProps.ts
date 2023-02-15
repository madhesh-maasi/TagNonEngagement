import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubmitSplitAdminProps {
  description: string;
  AppContext: WebPartContext;
  ItemID: number;
}

